---
title: "Standarisasi CI4 - Environment"
date: 2022-07-02T09:39:42+07:00
tags: ["article", "codeigniter", "php"]
draft: false
series: ["Standarisasi CI4"]
series_order: 3
---

Halo, selamat datang lagi ke seri artikel "Standarisasi CI4". Kali ini kita akan membahas sebuah file khusus bernama `.env` (baca: dot-envi). "Kenapa kok ada titiknya?" karena simpelnya, *dotenv* ini adalah sebuah file pengaturan, dimana sistem UNIX (seperti Linux, dan Mac) tidak bisa membaca file ini secara eksplisit, *walaupun Windows bisa*.

Saya membuat tulisan ini sebab keresahan pribadi Saya terhadap teman-teman yang mengatur konfigurasi sesuai mesinnya sendiri, tanpa memikirkan bagaimana kedepannya jika kode ini di-*maintain* pengembang lain.

File `.env` ini berisi pengaturan-pengaturan sensitif seperti kredensial *database*, *key* dari sebuah REST API, atau bahkan sebuah *key* untuk meng-enkripsi sebuah data yang ada pada *database* teman-teman.

## Kenapa kita harus mengatur `.env`?
Jika kita bekerja dengan tim, kita harus mengetahui bahwa mesin setiap orang berbeda-beda. Bisa saja kasusnya seperti ini:

1. Developer A
    - Menggunakan XAMPP
    - Databasenya memiliki *password* dengan nilai *root*.
    - Base URL dari projectnya adalah `localhost/project-ci`
2. Developer B
    - Menggunakan Laragon
    - Databasenya memiliki *password* dengan nilai *toor*.
    - Base URL dari projectnya adalah `project-ci.dev`
3. Developer C
    - Menggunakan NGINX
    - Databasenya tidak ber-*password*
    - Base URL dari projectnya adalah `127.0.0.1:8080/project_ci`
4. Developer D
    - Menggunakan Valet
    - Databasenya memiliki *password* dengan nilai *laravelisthebest*.
    - Base URL dari projectnya adalah `project-ci.test`

Jika teman-teman menggunakan **Git** sebagai *version control*, maka tentu teman-teman akan mengetahui bahwa ***file config* lokal akan terpantau perubahannya, dan akan terkirim ke *upstream* karena tidak masuk ke dalam daftar `.gitignore`**. Karena itu, `.env` sangat berguna pada projek tim karena setiap pengembang bisa menyesuaikan konfigurasinya sendiri, secara independen **sesuai mesin masing-masing**.

## Lalu bagaimana cara mengatur `.env`?
Sangat mudah, pada saat menginisialisasi suatu *project* CI4, Anda akan melihat struktur seperti ini:
```
📁　project-ci/
├─ 📁　app/
├─ 📁　public/
├─ 📁　system/
├─ 📁　tests/
├─ 📁　writable/
├─ CHANGELOG.md
├─ composer.json
├─ deptrac.yaml
├─ env
├─ LICENSE
├─ README.md
├─ SECURITY.md
├─ spark
```

Teman-teman bisa buka file bernama `env`, lalu simpan file tersebut sebagai file baru bernama `.env`. **Jangan hapus atau *rename* file `env` biasa, file ini berfungsi sebagai *template* konfigurasi untuk developer lain**.

**PENTING**:
> Untuk mengatur sebuah konstanta *environment variables*, sangatlah mudah. Anda hanya perlu menghapus tanda `#` di awal sebuah konstanta, lalu mengatur isi dari konstanta itu setelah tanda `=`.

Mari kita bahas isi dari file `.env` ini satu-per-satu. Saya akan bahas pengaturan-pengaturan yang sering Saya gunakan:

## *Environment*
```bash
#--------------------------------------------------------------------
# ENVIRONMENT
#--------------------------------------------------------------------

# CI_ENVIRONMENT = production
```

*Environment* akan memberikan petunjuk ke CI4 apakah aplikasi ini ada di fase "Pengembangan"/`development`, atau "Dirilis"/`production`. Pengaturan ini mempengaruhi bagaimana CI4 meng-*handle* sebuah error.

Pada *environment* `development` semua *error* akan dikeluarkan oleh CI4, memberikan *insight* secara penuh terhadap keseluruhan *error*. Dimana letak kesalahan secara persis. **Anda harus mengatur konstan `CI_ENVIRONMENT` ke `development` pada masa pengembangan.

Lalu bagaimana CI4 meng-*handle* kode ketika `CI_ENVIRONMENT` diatur ke `production`? Simpelnya, seluruh *error* akan disembunyikan dalam sebuah halaman *500: Internal Server Error*. Secara *default*, CI4 akan menampilkan halaman *Whoops! We seem to have hit a snag. Please try again later...* **Hanya atur `CI_ENVIRONMENT` ke `production` pada saat aplikasi sudah dirilis**, karena kita tidak ingin pengguna tahu dimana letak *error* yang sebenarnya.

"Lho, kalau kita nggak tau *error*nya dimana pas *production*, terus gimana caranya kita memperbaiki *bug* yang ada?" tenang, kita punya file *Logs*! *Logs* ini, menurut Saya adalah media "penyempurnaan" sebuah aplikasi. Jadi seluruh *error* yang terjadi pada saat *production* bisa teman-teman temukan di folder `writable/logs/log-{date}.log`. File ini akan menyimpan seluruh *error* yang terjadi pada hari itu.

Isi dari sebuah file *log*, berisi kurang lebih seperti ini:
```bash
CRITICAL - 2022-07-02 05:06:10 --> Class "App\Controllers\User" not found
in APPPATH/Controllers/Home.php on line 9.
 1 SYSTEMPATH/CodeIgniter.php(896): App\Controllers\Home->index()
 2 SYSTEMPATH/CodeIgniter.php(466): CodeIgniter\CodeIgniter->runController(Object(App\Controllers\Home))
 3 SYSTEMPATH/CodeIgniter.php(349): CodeIgniter\CodeIgniter->handleRequest(null, Object(Config\Cache), false)
 4 FCPATH/index.php(55): CodeIgniter\CodeIgniter->run()
 5 /Users/shiroyuki/.composer/vendor/laravel/valet/server.php(234): require('FCPATH/index.php')
```

## *Base URL*
Saya bilang di atas bahwa:
> Jika kita bekerja dengan tim, kita harus mengetahui bahwa mesin setiap orang berbeda-beda

Itu betul adanya, dan ini adalah salah satu pengaturan yang krusial. Karena setiap pengembang memiliki *base URL* yang berbeda-beda **tergantung pada setiap *host engine* yang dimiliki**.

```bash
#--------------------------------------------------------------------
# APP
#--------------------------------------------------------------------

# app_baseURL = ''
```

**Mengatur *base URL* sangat penting pada saat pemanggilan URL pada aplikasi**. Kita akan simulasikan keadaan fungsi `base_url()` pada setiap developer jika mereka tidak mengatur konstanta `app_baseURL`.

Perlu diketahui bahwa secara *default*, fungsi `base_url()` akan mengembalikan nilai *http://localhost:8080*. Berikut adalah hasil akses ke browser, jika setiap pengembang tidak mengatur konstanta `app_baseURL` terlebih dahulu:

1. Pengembang A: 404: Error Not Found
2. Pengembang B: 404: Error Not Found
3. Pengembang C: 200: OK
4. Pengembang D: 404: Error Not Found

Maka dari itu, setiap pengembang perlu mengatur konstansta `app_baseURL`-nya masing-masing. Jika disimulasikan, maka setiap pengembang akan mengatur konstanta `app_baseURL` menjadi seperti ini:

1. Pengembang A:
    - Mengatur `app_baseURL` ke `localhost/project-ci`
    - Hasil akses browser: 200: OK
2. Pengembang B:
    - Mengatur `app_baseURL` ke `project-ci.dev`
    - Hasil akses browser: 200: OK
3. Pengembang C:
    - Mengatur `app_baseURL` ke `127.0.0.1:8080/project-ci`
    - Hasil akses browser: 200: OK
4. Pengembang D:
    - Mengatur `app_baseURL` ke `project-ci.test`
    - Hasil akses browser: 200: OK

Bagaimana? Sudah paham bagaimana pentingnya mengatur *Base URL* kan? Yuk kita lanjut ke pengaturan penting lainnya.

## *Database*
```bash
#--------------------------------------------------------------------
# DATABASE
#--------------------------------------------------------------------

# database.default.hostname = localhost
# database.default.database = ci4
# database.default.username = root
# database.default.password = root
# database.default.DBDriver = MySQLi
# database.default.DBPrefix =
```

Sama halnya seperti pengaturan konstanta *app_baseURL*, setiap pengembang juga *mungkin* memiliki pengaturan yang berbeda-beda dalam mengakses *database*-nya.

Secara default, CI4 akan mengatur konfigurasi *database* seperti ini (akan Saya ambil beberapa pengaturan yang sering dipakai):
```php
// app/Config/Database.php
public $default = [
    'hostname' => 'localhost',
    'username' => '',
    'password' => '',
    'database' => '',
    'DBDriver' => 'MySQLi',
    'port'     => 3306,
];
```

Ini yang akan terjadi kepada **seluruh** pengembang tidak mengatur konfigurasi *database* pada saat mencoba mengambil data dari *database*:

```bash
CodeIgniter\Database\Exceptions\DatabaseException #8
Unable to connect to the database.
Main connection [MySQLi]: Access denied for user ''@'localhost' (using password: NO)
```

Ya, setiap pengembang tidak dapat terkoneksi ke *database*, bahkan pada **konfigurasi XAMPP yang tidak menggunakan *password* secara *default***. Solusinya? Atur konstansta *environment* berikut sesuai mesin masing-masing:

1. Pengembang A:
    - Mengatur `database.default.username` ke `root`
    - Mengatur `database.default.password` ke `root`
2. Pengembang B:
    - Mengatur `database.default.username` ke `root`
    - Mengatur `database.default.password` ke `toor`
3. Pengembang C:
    - Mengatur `database.default.username` ke `root`
4. Pengembang D:
    - Mengatur `database.default.username` ke `root`
    - Mengatur `database.default.password` ke `laravelisthebest`
Dengan ini, setiap pengembang tidak akan mendapatkan *error* terkait koneksi ke *database*.

## Rangkuman konstanta `.env` yang penting
1. `CI_ENVIRONMENT`, ubah ke `development`, `production` atau `testing`.
    - Ubah ke `development` jika aplikasi dalam tahap pengembangan.
    - Ubah ke `produciton` jika aplikasi sudah dirilis.
    - Ubah ke `testing` jika ingin menjalankan *test*.
2. `app.baseURL`, mengatur URL yang akan dipanggil oleh fungsi `base_url()`. Hal ini akan mempengaruhi pemanggilan *assets* dan *routing*.
3. `app.forceGlobalSecureRequests`, atur ke `true` atau `false`. Pengaturan ini akan memaksa skema URL yang digunakan ke `https`.
4. `database.default.hostname`, mengatur nama *host* dari server *database* yang dipakai.
5. `database.default.database`, mengatur nama *database* yang ingin dipakai.
6. `database.default.username`, mengatur *username* dari *user* dari *host*.
7. `database.default.password`, mengatur *password* dari *user* yang terdaftar di *host*.
8. `database.default.DBDriver`, mengatur *engine* dari *database* yang dipakai.

#### Daftar Pustaka
- *Configuration* dari [Dokumentasi CI4](https://codeigniter.com/user_guide/general/configuration.html?highlight=env)
- Pengalaman pribadi menggunakan CI4 selama 6 bulan.
