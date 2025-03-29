---
title: "List IP Docker Container menggunakan Bash"
date: 2025-03-29T04:10:00+07:00
tags: ["article", "bash", "docker"]
draft: false
---

Bash adalah sebuah *Command-line Interpreter* yang digunakan secara umum pada sistem operasi berbasis Unix-like, seperti Linux dan MacOS. Yang memungkinkan pengguna berinteraksi dengan sisten dengan cara mengotomatisasi tugas-tugas yang ingin diselesaikan melalui sebuah perintah.

Kalau Anda tertarik dengan latar belakang kenapa Saya memutuskan untuk menggunakan Docker dan meninggalkan sepenuhnya menginstal aplikasi secara langsung ke sistem, silahkan baca bagian **[Akar Permasalahan](#akar-permasalahan)** di bawah. Jika tidak, lewati bagian tersebut.


## Akar Permasalahan

Semenjak November 2024, Saya sudah tidak menggunakan *coding environment* yang diinstal ke mesin secara langsung. Mengapa? Hal ini didasari karena Homebrew memiliki *package versioning management* yang buruk. Kok bisa? Karena pada dasarnya Apple menganut **Planned Obsolescence**, yaitu dimana sebuah produk tidak akan mendapatkan fitur-fitur terbaru lagi setelah menyentuh versi tertentu. Ternyata hal ini tidak berlaku di *hardware*-nya saja, namun *software*-nya juga.

Walaupun, masalah di atas dapat diselesaikan dengan mudah dengan menggunakan *flag* `HOMEBREW_NO_AUTO_UPDATE=1`, namun yang namanya manusia pasti tidak luput dari sifat pelupa. Terlebih lagi pada saat itu, tidak terlintas di kepala Saya untuk meng-*export* *flag* ini ke konfigurasi `zsh` Saya. Alhasil, alih-alih saya ingin meng-*upgrade* satu *package* saja, ternyata seluruh *package* ter-*upgrade* tanpa sepengetahuan Saya (kesalahan Saya juga tidak memonitor jalannya *upgrade*, *package* apa saja yang ter-*upgrade*, dan apa akibatnya). Salah satu akibat dari kelalaian ini sebetulnya simpel, yaitu naiknya versi MySQL dari versi `80300` ke versi `90001`.

"Lho, kan hanya upgrade versi saja, memang se-fatal apa sampai harus pindah ke Docker?", tentunya sangat fatal. Karena jika dilihat dari *error*-nya sendiri, dia menampilkan `Invalid MySQL server upgrade: Cannot upgrade from 80300 to 90001. Upgrade to next major version is only allowed from the last LTS release, which version 80300 is not.`. Waduh artinya tuh apa bang Aghits? Artinya adalah *engine* dari MySQL mengenal bahwa *database* yang Saya miliki ternyata menggunakan versi `80300`, sementara versi MySQL sekarang adalah `90001`.

"Kan tinggal di-*downgrade* saja versinya, apa susahnya?", tidak semudah itu, karena pada dasarnya MySQL tidak mendukung *Backward Compatibility*, yang berarti perubahan versi major akan mengakibatkan perubahan secara fundamental pada *database* yang ada saat itu, dan pada saat mengembalikannya ke versi lama, terdapat beberapa variabel yang tidak dikenal sehingga mengakibatkan *database* tidak dapat dibaca. Seluruh perubahan fundamental akan tercatat pada `ibdata1`.

Kasus ini sudah terjadi tepatnya sebanyak 4x sepanjang karir pengembangan sistem Saya, dan pada akhirnya *I had enough of this sh\*t* dan memulai perubahan radikal kepada seluruh aplikasi yang Saya kembangkan.


## Docker, dan Permasalahannya


### Honestly, Docker is Amazing

Docker, Saya akui adalah suatu alat penunjang pengembangan yang *powerful*, karena dengan perintah yang simpel, aplikasi Anda dapat dijalankan tanpa menginstal satupun *dependencies*. Docker sangat bergantung kepada sebuah `Dockerfile` atau `docker-compose`, yang didalamnya terdapat perintah seperti berikut (Saya ambil contoh ini dari Laravel Sail):

```yml
services:
    laravel.test:
        build:
            context: ./vendor/laravel/sail/runtimes/8.4
            dockerfile: Dockerfile
            args:
                WWWGROUP: '${WWWGROUP}'
        image: sail-8.4/app
        extra_hosts:
            - 'host.docker.internal:host-gateway'
        ports:
            - '${APP_PORT:-80}:80'
            - '${VITE_PORT:-5173}:${VITE_PORT:-5173}'
        environment:
            WWWUSER: '${WWWUSER}'
            LARAVEL_SAIL: 1
            XDEBUG_MODE: '${SAIL_XDEBUG_MODE:-off}'
            XDEBUG_CONFIG: '${SAIL_XDEBUG_CONFIG:-client_host=host.docker.internal}'
            IGNITION_LOCAL_SITES_PATH: '${PWD}'
        volumes:
            - '.:/var/www/html'
        networks:
            - sail
        depends_on:
            - mysql
    mysql:
        image: 'mysql/mysql-server:8.0'
        ports:
            - '${FORWARD_DB_PORT:-3306}:3306'
        environment:
            MYSQL_ROOT_PASSWORD: '${DB_PASSWORD}'
            MYSQL_ROOT_HOST: '%'
            MYSQL_DATABASE: '${DB_DATABASE}'
            MYSQL_USER: '${DB_USERNAME}'
            MYSQL_PASSWORD: '${DB_PASSWORD}'
            MYSQL_ALLOW_EMPTY_PASSWORD: 1
        volumes:
            - 'sail-mysql:/var/lib/mysql'
            - './vendor/laravel/sail/database/mysql/create-testing-database.sh:/docker-entrypoint-initdb.d/10-create-testing-database.sh'
        networks:
            - sail
        healthcheck:
            test:
                - CMD
                - mysqladmin
                - ping
                - '-p${DB_PASSWORD}'
            retries: 3
            timeout: 5s
networks:
    sail:
        driver: bridge
volumes:
    sail-mysql:
        driver: local
```

Dan pada saat menjalankan perintah `./vendor/bin/sail up -d` untuk pertama kalinya, Docker akan menjalankan sebuah `Dockerfile` berdasarkan versi PHP yang secara *default* terpasang pada mesin. Contohnya jika versi PHP *default* Saya adalah PHP 8.4, maka Laravel Sail akan menjalankan Dockerfile yang ada pada *directory* `vendor/laravel/sail/runtimes/8.4/Dockerfile`:

```Dockerfile
FROM ubuntu:24.04

LABEL maintainer="Taylor Otwell"

ARG WWWGROUP
ARG NODE_VERSION=22
ARG MYSQL_CLIENT="mysql-client"
ARG POSTGRES_VERSION=17

WORKDIR /var/www/html

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC
ENV SUPERVISOR_PHP_COMMAND="/usr/bin/php -d variables_order=EGPCS /var/www/html/artisan serve --host=0.0.0.0 --port=80"
ENV SUPERVISOR_PHP_USER="sail"

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN echo "Acquire::http::Pipeline-Depth 0;" > /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::http::No-Cache true;" >> /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::BrokenProxy    true;" >> /etc/apt/apt.conf.d/99custom

RUN apt-get update && apt-get upgrade -y \
    && mkdir -p /etc/apt/keyrings \
    && apt-get install -y gnupg gosu curl ca-certificates zip unzip git supervisor sqlite3 libcap2-bin libpng-dev python3 dnsutils librsvg2-bin fswatch ffmpeg nano  \
    && curl -sS 'https://keyserver.ubuntu.com/pks/lookup?op=get&search=0xb8dc7e53946656efbce4c1dd71daeaab4ad4cab6' | gpg --dearmor | tee /etc/apt/keyrings/ppa_ondrej_php.gpg > /dev/null \
    && echo "deb [signed-by=/etc/apt/keyrings/ppa_ondrej_php.gpg] https://ppa.launchpadcontent.net/ondrej/php/ubuntu noble main" > /etc/apt/sources.list.d/ppa_ondrej_php.list \
    && apt-get update \
    && apt-get install -y php8.4-cli php8.4-dev \
       php8.4-pgsql php8.4-sqlite3 php8.4-gd \
       php8.4-curl php8.4-mongodb \
       php8.4-imap php8.4-mysql php8.4-mbstring \
       php8.4-xml php8.4-zip php8.4-bcmath php8.4-soap \
       php8.4-intl php8.4-readline \
       php8.4-ldap \
       php8.4-msgpack php8.4-igbinary php8.4-redis php8.4-swoole \
       php8.4-memcached php8.4-pcov php8.4-imagick php8.4-xdebug \
    && curl -sLS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_VERSION.x nodistro main" > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y nodejs \
    && npm install -g npm \
    && npm install -g pnpm \
    && npm install -g bun \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /etc/apt/keyrings/yarn.gpg >/dev/null \
    && echo "deb [signed-by=/etc/apt/keyrings/yarn.gpg] https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list \
    && curl -sS https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor | tee /etc/apt/keyrings/pgdg.gpg >/dev/null \
    && echo "deb [signed-by=/etc/apt/keyrings/pgdg.gpg] http://apt.postgresql.org/pub/repos/apt noble-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
    && apt-get update \
    && apt-get install -y yarn \
    && apt-get install -y $MYSQL_CLIENT \
    && apt-get install -y postgresql-client-$POSTGRES_VERSION \
    && apt-get -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN setcap "cap_net_bind_service=+ep" /usr/bin/php8.4

RUN userdel -r ubuntu
RUN groupadd --force -g $WWWGROUP sail
RUN useradd -ms /bin/bash --no-user-group -g $WWWGROUP -u 1337 sail

COPY start-container /usr/local/bin/start-container
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY php.ini /etc/php/8.4/cli/conf.d/99-sail.ini
RUN chmod +x /usr/local/bin/start-container

EXPOSE 80/tcp

ENTRYPOINT ["start-container"]
```

Memang seluruh perintah-perintah di atas sangatlah panjang, dan untuk pengembang awam seperti Saya, Saya tidak perlu untuk mengoprek dengan jauh `Dockerfile` ataupun `docker-compose.yml` di atas. Sehingga memudahkan Saya untuk menjalankan aplikasi Laravel tanpa menginstal alat penunjang apapun.


### Tapi...

Dengan banyaknya proyek Laravel yang Saya *handle*, dan karena kemalasan Saya menggunakan CLI untuk mengakses *Database CLI*, maka Saya menggunakan aplikasi **TablePlus** (tidak disponsori) untuk mengakses *Database-database* yang Saya miliki. Sayangnya, Saya harus mengetahui IP dari *Container Database* yang ada pada aplikasi tersebut, dan yang bikin jengkel, IPnya kadang bisa berubah-ubah. Makanya setiap ada perubahan IP, Saya pasti tidak dapat mengakses Database tersebut secara langsung, jadi konfigurasi koneksinya harus Saya edit dulu, simpan, dan coba koneksikan kembali.

Untuk bisa mengakses *database* itu kembali, Saya harus melakukan (n) tahap, yaitu:

1. Menjalankan `docker network ls` untuk melihat seluruh jaringan yang terdaftar pada Docker. Output dari perintah tersebut adalah seperti ini:
```
NETWORK ID     NAME                        DRIVER    SCOPE
1fedbf85b3f6   network_app_defaul          bridge    local
0e17478e344d   bridge                      bridge    local
535cf0ebaf20   laravel-12-base_sail        bridge    local
```
2. Setelah mengetahui nama jaringan yang ingin Saya ketahui, Saya harus menjalankan `docker network inspect {nama_jaringan}` untuk mendapatkan informasi seperti berikut:
```json
[
    {
        "Name": "laravel-12-base_sail",
        "Id": "73900e13db161435016d83567ac1794995066fd106ff83b859e6d9b4f3fe3f22",
        "Created": "2025-03-29T04:58:40.95258208+07:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "192.168.181.0/24",
                    "Gateway": "192.168.181.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "6a0072bf005951cc2a6f2ba9508f3c8553ef78235ae2067fce3d894d233f2312": {
                "Name": "laravel-12-base-mysql-1",
                "EndpointID": "5db0899761425c3247e6e5fca75a2edd6c258f9a0fa333a24ee5f837ac3e664b",
                "MacAddress": "02:42:c0:a8:b5:02",
                "IPv4Address": "192.168.181.2/24",
                "IPv6Address": ""
            },
            "ef690e4080e6d3b63da5bdcd971363ca465cd91f1b3d7fb994c8280c0baa67aa": {
                "Name": "laravel-12-base-laravel.test-1",
                "EndpointID": "6944ea98448d54c455b5fd4a8852704f611b86b83cf1f4899c120f9e8dee0563",
                "MacAddress": "02:42:c0:a8:b5:03",
                "IPv4Address": "192.168.181.3/24",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {
            "com.docker.compose.config-hash": "6e1770cb34d87dd58ce89c8ea5e219088a0a3caec213449c223c51ec5cf5677c",
            "com.docker.compose.network": "sail",
            "com.docker.compose.project": "laravel-12-base",
            "com.docker.compose.version": "2.32.4"
        }
    }
]
```
3. "Lalu apa yang harus lu lihat dari informasi ini, Ghits?", tentunya pada *key* `Containers`. Pada setiap proyek Laravel, Laravel Sail akan secara *default* membuat 2 *container*, yaitu:
- *App Container*, yang membungkus aplikasi Laravel, yang diberi label dengan format `{nama-folder}-laravel.test`; serta
- *Database Container*, yang (tentunya) membungkus *database*, yand diberi label dengan format `{nama-folder}-mysql-(n)`.
4. Lalu, dengan informasi kedua *Container* di atas, Saya harus mencopas IP-nya ke TablePlus.
5. *Voila*, kelar seluruh masalah.


## Mempersingkat *Manual Labour Work*, sebuah *effort*, dalam kulit kacang.

Dengan melakukan seluruh *step-by-step* di atas, Tentunya ada rasa malas tersendiri, tiap hari harus inspeksi alamat IP-nya dulu lalu ubah IP-nya lagi di TablePlus. "Ada nggak sih cara lebih gampangnya?" yang tiba-tiba terbesit ke kepala Saya pada pukul 03:33 WIB, tepat waktu Sahur ~**(puasa produktif coy)**~.


### 1. Ambil seluruh jaringan yang terdaftar

Pertama, Saya harus ambil dulu seluruh jaringan Docker yang terdaftar dengan menggunakan perintah `docker network ls` tadi.

```bash
#!/bin/bash

docker network ls
```

Karena perintah di atas "sudah pasti jalan" karena perintahnya simpel, dan dikenal juga, tentunya nggak ada error. Dan tentunya bodoh juga, karena tujuannya nggak tercapai. Jadi tujuan saat ini adalah **bagaimana caranya untuk mendapatkan seluruh nama jaringannya saja**. Setelah menjalankan perintah `docker network ls --help`, petunjuk penggunaan dari perintah tersebut pun muncul, dan Saya tertarik dengan sebuah tautan yang merujuk ke [Dokumentasi CLI Formatting](https://docs.docker.com/go/formatting/). Setelah membaca-baca sedikit, akhirnya dapat lah perintah berikut:

```bash
#!/bin/bash

docker network ls --format '{{.Name}}'
```

Dengan perintah tersebut, akhirnya Saya berhasil menampilkan nama jaringannya saja.

```
> ./docker-ip-grabber.sh
accounting_default
bridge
container-test_default
```


### 2. Mempercantik *output*-nya, untuk sementara...

Karena *output* yang dihasilkan rada *boring*, jadi Saya mengubah scriptnya sehingga seluruh jaringan disimpan ke satu variabel terlebih dulu, lalu di-*output*-kan nanti.

```bash
#!/bin/bash

network_names=$(docker network ls --format '{{.Name}}')

echo "Available networks:"
echo "$network_names"
```

Sehingga outputnya menjadi:

```
> ./docker-ip-grabber.sh
Available networks:
accounting_default
bridge
container-test_default
```

Sebuah *improvement*, yes. Ingat kawan-kawan, proses sekecil apapun itu, tetaplah proses ~(sama halnya kek nulis artikel ini, duh, males banget asli klo udah panjang)~.


### 3. Looping, dan `network inspect` satu-per-satu

Pada saat Bash menyimpan hasil dari `docker network ls` ke variabel `network`, sebenarnya isi dari variabel tersebut adalah sebuah `array` yang terpisah menjadi *new line*. Karena itu, Saya dapat melakukan sebuah operasi untuk tiap barisnya.

```bash
#!/bin/bash

network_names=$(docker network ls --format '{{.Name}}')

for network in $network_names; do
    echo "Inspecting network: $network"

    inspected_network=$(docker network inspect "$network")

    echo $inspected_network

    echo "------------------------------------"
done
```

Tapi, hasilnya, tentu saja, hancur *awoekawoekawoe*

```
> ./docker-ip-grabber.sh
Inspecting network: accounting_default
[ { "Name": "accounting_default", "Id": "1fedbf85b3f6f1afcf5c95fb8113431b54db9e53f963a59cfffe22ec2ac51099", "Created": "2025-03-20T21:13:06.696006208+07:00", "Scope": "local", "Driver": "bridge", "EnableIPv6": false, "IPAM": { "Driver": "default", "Options": null, "Config": [ { "Subnet": "192.168.172.0/24", "Gateway": "192.168.172.1" } ] }, "Internal": false, "Attachable": false, "Ingress": false, "ConfigFrom": { "Network": "" }, "ConfigOnly": false, "Containers": { "cb562276b489693ec8341b7da6ea4d723b0bfbe53ff9198ae322cc61bde490c3": { "Name": "accounting-db-1", "EndpointID": "b15a4ae63cb8486235137de22f7035ed15cc8f1e0abce583f7dc6a6e97d2b4db", "MacAddress": "02:42:c0:a8:ac:02", "IPv4Address": "192.168.172.2/24", "IPv6Address": "" } }, "Options": {}, "Labels": { "com.docker.compose.config-hash": "a1cd18b750e7f506cc38ce0afe80dc1d7d6d490a0413dc849e2fb87068e58eb1", "com.docker.compose.network": "default", "com.docker.compose.project": "accounting", "com.docker.compose.version": "2.32.4" } } ]
------------------------------------
Inspecting network: bridge
[ { "Name": "bridge", "Id": "0e17478e344d520bbbfa3d0a4d2905e90f8ded9f8b06615a34ba0be6d2020ef3", "Created": "2025-03-28T19:25:47.320998626+07:00", "Scope": "local", "Driver": "bridge", "EnableIPv6": false, "IPAM": { "Driver": "default", "Options": null, "Config": [ { "Subnet": "192.168.215.0/24", "Gateway": "192.168.215.1" } ] }, "Internal": false, "Attachable": false, "Ingress": false, "ConfigFrom": { "Network": "" }, "ConfigOnly": false, "Containers": {}, "Options": { "com.docker.network.bridge.default_bridge": "true", "com.docker.network.bridge.enable_icc": "true", "com.docker.network.bridge.enable_ip_masquerade": "true", "com.docker.network.bridge.host_binding_ipv4": "0.0.0.0", "com.docker.network.bridge.name": "docker0", "com.docker.network.driver.mtu": "1500" }, "Labels": {} } ]
------------------------------------
```


### 4. Ambil data "IPv4Address"

Nah caranya gimana tuh? Kalau di JavaScript kan, kita bisa pakai `output[0].Containers[containerId].IPv4Address`, kalau di Bash gimana? Dalam Bash, seluruh *output* perintah yang kita jalankan akan disimpan dalam bentuk *plaintext*, atau teks mentah. Jadi dari teks mentah tersebut, harus kita formatting / ubah menjadi JSON.

Disitulah Saya berkenalan dengan perintah `jq`. `jq` ini adalah sebuah alat pemrosesan input JSON, sehingga data didalamnya bisa diolah melalui CLI.

Contohnya adalah seperti berikut:

```bash
$ echo '{"foo": 0}' | jq
{
    "foo": 0
}
```

Setelah itu, Saya coba-coba untuk meng-*echo* *output* dari `docker network inspect`:

`echo '[ { "Name": "accounting_default", "Id": "1fedbf85b3f6f1afcf5c95fb8113431b54db9e53f963a59cfffe22ec2ac51099", "Created": "2025-03-20T21:13:06.696006208+07:00", "Scope": "local", "Driver": "bridge", "EnableIPv6": false, "IPAM": { "Driver": "default", "Options": null, "Config": [ { "Subnet": "192.168.172.0/24", "Gateway": "192.168.172.1" } ] }, "Internal": false, "Attachable": false, "Ingress": false, "ConfigFrom": { "Network": "" }, "ConfigOnly": false, "Containers": { "cb562276b489693ec8341b7da6ea4d723b0bfbe53ff9198ae322cc61bde490c3": { "Name": "accounting-db-1", "EndpointID": "b15a4ae63cb8486235137de22f7035ed15cc8f1e0abce583f7dc6a6e97d2b4db", "MacAddress": "02:42:c0:a8:ac:02", "IPv4Address": "192.168.172.2/24", "IPv6Address": "" } }, "Options": {}, "Labels": { "com.docker.compose.config-hash": "a1cd18b750e7f506cc38ce0afe80dc1d7d6d490a0413dc849e2fb87068e58eb1", "com.docker.compose.network": "default", "com.docker.compose.project": "accounting", "com.docker.compose.version": "2.32.4" } } ]' | jq`

Hasilnya adalah sebagai berikut:

```json
[
    {
        "Name": "accounting_default",
        "Id": "1fedbf85b3f6f1afcf5c95fb8113431b54db9e53f963a59cfffe22ec2ac51099",
        "Created": "2025-03-20T21:13:06.696006208+07:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "192.168.172.0/24",
                    "Gateway": "192.168.172.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "cb562276b489693ec8341b7da6ea4d723b0bfbe53ff9198ae322cc61bde490c3": {
                "Name": "accounting-db-1",
                "EndpointID": "b15a4ae63cb8486235137de22f7035ed15cc8f1e0abce583f7dc6a6e97d2b4db",
                "MacAddress": "02:42:c0:a8:ac:02",
                "IPv4Address": "192.168.172.2/24",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {
            "com.docker.compose.config-hash": "a1cd18b750e7f506cc38ce0afe80dc1d7d6d490a0413dc849e2fb87068e58eb1",
            "com.docker.compose.network": "default",
            "com.docker.compose.project": "accounting",
            "com.docker.compose.version": "2.32.4"
        }
    }
]
```

*Thought Process* yang Saya alami adalah sebagai berikut:
1. Ambil data pertama dari JSON tersebut (dalam JS: `data[0]`).
2. Mengambil data dari key `Containers` (dalam JS: `data[0].Containers`).
3. Mengambil value dari `IPv4Address` (dalam JS: `data[0].Containers[containerId].IPv4Address`).

Jika diimplementasi menggunakan perintah `jq`, maka tahapan-tahapan di atas diubah menjadi berikut:
1. `echo '--data JSON disini--' | jq -r '.[]'`
2. `echo '--data JSON disini--' | jq -r '.[].Containers'`
2. `echo '--data JSON disini--' | jq -r '.[].Containers.[].IPv4Address'`

Setelah ketemu solusi sementaranya seperti ini, maka Saya ubah Bash *script* yang tadi menjadi seperti ini:
```bash
#!/bin/bash

network_names=$(docker network ls --format '{{.Name}}')

for network in $network_names; do
    echo "Inspecting network: $network"

    ipv4_addresses=$(docker network inspect "$network" | jq -r '.[].Containers[].IPv4Address')

    if [[ -n "$ipv4_addresses" ]]; then
        echo "IPv4 Addresses in $network:"
        echo "$ipv4_addresses"
    else
        echo "No containers with IPv4 addresses found in $network."
    fi

    echo "------------------------------------"
done
```

Hasilnya adalah.....

```
> ./docker-ip-grabber.sh
Inspecting network: accounting_default
IPv4 Addresses in accounting_default:
192.168.172.2/24
------------------------------------
Inspecting network: bridge
No containers with IPv4 addresses found in bridge.
------------------------------------
```

LHO LHO, KOK ADA `/24`-NYA??? Nah, itulah pemirsa, yang dinamakan sebagai "Subnet". Orang jaringan pasti kenal betul sama istilah ini. Tentunya, Saya tidak perlu identitas "Subnet" ini untuk IP yang akan Saya masukkan ke TablePlus.


### 5. Hapus Subnet

Jadi caranya, selain kita nge-*pipeline* hasil *output plaintext* kita ke `jq`, kita juga harus *pipeline* lagi ke perintah `cut` untuk mengeliminasi Subnet yang tidak diperlukan.

Caranya adalah dengan menjalankan perintah `cut -d'/' -f1`. Artinya apa tuh?
1. Kita menggunting teks `192.168.172.2/24` dengan "delimiter" `-d` atau "acuan" garis miring (/). Perintah ini sama halnya dengan fungsi `explode()` pada PHP `explode('/', '192.168.172.2')`.
2. Dengan perintah di atas, hasilnya adalah sebuah array dengan isi `192.168.172.2` dan `24`. Kita panggil data pertama dengan cara penggunakan *flag* `-f` diikuti dengan angka urutan (dimulai dari 1, bukan 0).

Dengan mengubah *script* yang kita buat jadi seperti ini, akhirnya kita mendapatkan IP-nya saja.

```bash
#!/bin/bash

network_names=$(docker network ls --format '{{.Name}}')

for network in $network_names; do
    echo "Inspecting network: $network"

    ipv4_addresses=$(docker network inspect "$network" | jq -r '.[].Containers[].IPv4Address' | cut -d'/' -f1)

    if [[ -n "$ipv4_addresses" ]]; then
        echo "IPv4 Addresses in $network:"
        echo "$ipv4_addresses"
    else
        echo "No containers with IPv4 addresses found in $network."
    fi

    echo "------------------------------------"
done
```

```
> ./docker-ip-grabber.sh
Inspecting network: accounting_default
IPv4 Addresses in accounting_default:
192.168.172.2
------------------------------------
Inspecting network: bridge
No containers with IPv4 addresses found in bridge.
------------------------------------
```


### 6. Hanya tampilkan Network yang aktif saja

Perintah di atas akan menampilkan seluruh Network yang ada, tanpa mempedulikan apakah Container tersebut sedang aktif atau tidak. Jadi simpelnya, kita hilangkan blok perintah `else`, lalu pindah seluruh perintah `echo` ke dalam blok perintah `if`.

```bash
#!/bin/bash

network_names=$(docker network ls --format '{{.Name}}')

for network in $network_names; do
    ipv4_addresses=$(docker network inspect "$network" | jq -r '.[].Containers[].IPv4Address' | cut -d'/' -f1)

    if [[ -n "$ipv4_addresses" ]]; then
        echo "Inspecting network: $network"
        echo "IPv4 Addresses in $network:"
        echo "$ipv4_addresses"
        echo "------------------------------------"
    fi
done
```

Jadi, hasil jika kita jalankan *script* yang kita buat sejauh ini:

```
> ./docker-network-grabber.sh
Inspecting network: accounting_default
IPv4 Addresses in accounting_default:
192.168.172.2
------------------------------------
Inspecting network: another-project_sail
IPv4 Addresses in another-project_sail:
192.168.171.4
192.168.171.2
192.168.171.3
192.168.171.5
------------------------------------
Inspecting network: laravel-12-base_sail
IPv4 Addresses in laravel-12-base_sail:
192.168.181.2
192.168.181.3
------------------------------------
```

YEY! Selesai! Eh... tapi mana IP *container* untuk aplikasi, dan mana IP *container* untuk *database*?
Waduh, nama Containernya belum masuk nih 🤦‍♂️. Capek deh.


### 7. Menampilkan Nama Container di samping IP

Intinya, Saya harus menyimpan hasil dari perintah `docker network inspect` ke dalam satu variabel terlebih dahulu, lalu diolah lagi menggunakan `jq`, itulah yang terlintas pertama kali di kepala Saya. Jadi *script*-nya adalah sebagai berikut:

```bash
#!/bin/bash

network_names=$(docker network ls --format '{{.Name}}')

for network in $network_names; do
    inspected_network=$(docker network inspect "$network")
    container_name=$(echo $inspected_network | jq -r '.[].Containers[].Name')
    ipv4_addresses=$(echo $inspected_network | jq -r '.[].Containers[].IPv4Address' | cut -d'/' -f1)

    if [[ -n "$ipv4_addresses" ]]; then
        echo "Inspecting network: $network"
        echo "IPv4 Addresses in $network:"
        echo "$ipv4_addresses $container_name"
        echo "------------------------------------"
    fi
done
```

Dan pada saat dijalankan:

```
> ./docker-network-grabber.sh
Inspecting network: accounting_default
IPv4 Addresses in accounting_default:
192.168.172.2accounting-db-1
------------------------------------
Inspecting network: another-project_sail
IPv4 Addresses in another-project_sail:
192.168.171.4
192.168.171.2
192.168.171.3
192.168.171.5another-project-pgsql-1
another-project-data-master-pqsql-1
another-project-pulse-pqsql-1
another-project-laravel.test-1
------------------------------------
Inspecting network: laravel-12-base_sail
IPv4 Addresses in laravel-12-base_sail:
192.168.181.2
192.168.181.3laravel-12-base-mysql-1
laravel-12-base-laravel.test-1
------------------------------------
```

Lah kok formattingnya gak rapih gini?


### 8. Hantaman Realita

Saya baru menyadari bahwa *output* dari perintah `jq -r '.[].Containers[].Name'` ataupun `jq -r '.[].Containers[].IPv4Address'` adalah berbentuk `array`. Karena itulah hasilnya tidak rapih.

Jika saja proyek kecil ini adalah sebuah proyek Laravel, Saya pasti bisa menggunakan Collection untuk mengubah datanya menjadi *array key-value pairs* dengan cara:

```php
collect($networks)
    ->flatMap(function ($network) {
        $containers = $network[0]['Containers'];

        return collect($containers)
            ->map(fn ($container, $containerName) => [
                'ip' => $container[$containerName]->IPv4Address,
                'name' => $container[$containerName]->Name,
            ])
            ->toArray();
    })
    ->toArray();
```

Jadi, hal ini sepenuhnya Saya serahkan ke ChatGPT karena ilmu Saya belum mencapai level tersebut. Kurang lebih beginilah hasil perintah `jq` yang dibuatkan:

```bash
jq -r '.[].Containers | to_entries[] |
    select(.value.IPv4Address != null) |
    (.value.IPv4Address | sub("/.*"; "")) as $ip |
    .value.Name as $name |
    "\($ip) \($name)"'
```

Gila, *pipeline hell* betul. Jadi, menurut pemahaman Saya jika diterjemahkan *pipeline*-per-*pipeline*:
1. Ambil data `Containers` menggunakan `.[].Containers`.
2. Ubah data masing-masing *Container* menjadi `key-value` *pair*. Jadi datanya bakal diubah menjadi seperti
```json
[
    {
        "key": "IPv4Address",
        "value": "192.168.xxx.xxx"
    },
    {
        "key": "Name",
        "value": "ContainerName"
    }
]
```
3. Memfilter Container yang aktif dengan perintah `select(.value.IPv4Address != null)`. Perintah `select(boolean)` akan mengembalikan `key-value` *pair* tersebut tanpa diubah jika kondisi pada parameter `boolean` terpenuhi. Bagaimana jika tidak terpenuhi? Tidak ada data apapun yang dikembalikan ke pengguna.
4. Jika pada tahap (3) terpenuhi, maka hapus Subnet yang ada pada key `IPv4Address` dan menjadikannya sebagai variabel `$ip`.
5. Ambil data dari `.value.Name` dan menjadikannya sebagai variabel `$name`.
6. Keluarkan data yang diolah sehingga berbentuk menjadi `192.168.xxx.xxx ContainerName`.


### 9. Hasil Akhir

Jadi, dari debugging Saya yang hampir menghabiskan waktu Subuh, hasil *script*-nya adalah sebagai berikut:

```bash
#!/bin/bash

network_names=$(docker network ls --format '{{.Name}}')

for network in $network_names; do
    output=$(docker network inspect "$network" | jq -r '
        .[].Containers | to_entries[] |
        select(.value.IPv4Address != null) |
        (.value.IPv4Address | sub("/.*"; "")) as $ip |
        .value.Name as $name |
        "\($ip) \($name)"')

    if [[ -n "$output" ]]; then
        echo "Inspecting network: $network"
        echo "IPv4 Addresses in $network:"
        echo "$output"
        echo
    fi
done
```

Namun, ternyata hasilnya (lagi-lagi, masih, karena idealis) tidak seperti yang diharapkan:

```
> ./docker-network-grabber.sh
Inspecting network: accounting_default
IPv4 Addresses in accounting_default:
192.168.172.2 accounting-db-1

Inspecting network: another-app_sail
IPv4 Addresses in another-app_sail:
192.168.171.4 another-app-pgsql-1
192.168.171.2 another-app-data-master-pqsql-1
192.168.171.3 another-app-pulse-pqsql-1
192.168.171.5 another-app-laravel.test-1

Inspecting network: laravel-12-base_sail
IPv4 Addresses in laravel-12-base_sail:
192.168.181.2 laravel-12-base-mysql-1
192.168.181.3 laravel-12-base-laravel.test-1
```

Hasilnya nggak rapih, cuma ada 1 spasi di antara IP dan nama *Container*. Kita mau keterbacaan di *script* ini jadi nomor 1 di antara hal lainnya. Jadi solusinya adalah kita gunakan perintah `awk`. `awk` akan menganggap setiap spasi pada variabel `$output` yang ada sebagai pemisah antara kolom. Jadi pada variabel `$output` ini, kita memiliki 2 kolom:

```
192.168.171.4 another-app-pgsql-1
192.168.171.2 another-app-data-master-pqsql-1
192.168.171.3 another-app-pulse-pqsql-1
192.168.171.5 another-app-laravel.test-1
```

Jadi, jika kita ingin mengambil data IP saja, maka kita bisa ambil kolom pertama menggunakan perintah `awk {print $1}`, atau jika ingin mengambil nama *Container*-nya saja, kita bisa gunakan perintah `awk {print $2}`, atau jika ingin mengubahnya menjadi nama *Container*-nya dulu baru IP-nya kita bisa gunakan `awk {print $2, $1}`.

Selanjutnya, untuk menambah *spacing*, kita akan memanfaatkan perintah `printf`. Digabung dengan perintah `awk`, hasilnya menjadi `awk '{ printf "%-16s %s\n", $1, $2 }'`.

Arti dari perintah di atas adalah:
1. Keluarkan teks dengan formatting (`printf`)
2. Rata kiri-kan (`-`) seluruh 16 karakter (`16`) pertama (`%s`) . Mengapa 16? Karena IPv4 memiliki panjang 16 karakter (termasuk titik). Keseluruhan perintah kolom formatter pertama adalah `%-16s`.
3. Sediakan template untuk kolom kedua `%s`.
4. Keluarkan *new line*.

Lalu kita implementasikan ke *script* utama:

`echo "$output"  | awk '{ printf "%-16s %s\n", $1, $2 }'`

Hasilnya adalah:

```
> ./docker-network-grabber.sh
Inspecting network: accounting_default
IPv4 Addresses in accounting_default:
192.168.172.2    accounting-db-1

Inspecting network: another-app_sail
IPv4 Addresses in another-app_sail:
192.168.171.4    another-app-pgsql-1
192.168.171.2    another-app-data-master-pqsql-1
192.168.171.3    another-app-pulse-pqsql-1
192.168.171.5    another-app-laravel.test-1

Inspecting network: laravel-12-base_sail
IPv4 Addresses in laravel-12-base_sail:
192.168.181.2    laravel-12-base-mysql-1
192.168.181.3    laravel-12-base-laravel.test-1
```

![](./satisfaction.jpeg)


### 10. Finishing Touch

Lagi-lagi, biar rapih, kita hapus beberapa baris yang sekiranya tidak diperlukan seperti baris "Inspecting network", lalu "IPv4 Addresses in ...". Jadi ya, kurang lebih *script*-nya seperti ini:

```bash
if [[ -n "$output" ]]; then
    echo "$network"
    echo "$output" | awk '{ printf "%-16s %s\n", $1, $2 }'
    echo
fi
```


## Untuk kalian, yang malas baca

Tolong banget ini mah baca dari awal, apresiasi sedikit dong 😭🙏. Nulis ginian doang butuh waktu 3 jam wkwkwk. Biar sama-sama saling tau *struggle* sama *effort*. Tapi kalau kalian tetap mau *script* lengkapnya, nih.

<details>
    <summary>📄 docker-network-grabber.sh</summary>

    #!/bin/bash

    network_names=$(docker network ls --format '{{.Name}}')

    for network in $network_names; do
        output=$(docker network inspect "$network" | jq -r '
            .[].Containers | to_entries[] |
            select(.value.IPv4Address != null) |
            (.value.IPv4Address | sub("/.*"; "")) as $ip |
            .value.Name as $name |
            "\($ip) \($name)"')

        if [[ -n "$output" ]]; then
            echo "$network"
            echo "$output" | awk '{ printf "%-16s %s\n", $1, $2 }'
            echo
        fi
    done
</details>


*Well*, mungkin untuk sekarang itu dulu aja. Jadi, sampai ketemu nanti di artikel lainnya, dan semoga artikel ini bermanfaat untuk kalian!

---


Pratinjau dalam artiken ini difoto oleh <a href="https://unsplash.com/@carrier_lost?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Ian Taylor</a> di <a href="https://unsplash.com/photos/blue-and-red-cargo-ship-on-sea-during-daytime-jOqJbvo1P9g?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
