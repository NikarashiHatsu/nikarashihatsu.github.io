---
title: "Autentikasi Custom Laravel 9 Dengan Breeze"
date: 2022-08-01T16:38:00+07:00
tags: ["article", "laravel", "technology"]
draft: false
---

Hai, lama tak jumpa 👋. Udah lama gak nulis juga, jadi agak kangen sedikit sama blog yang isinya daging semua. Well, berhubung ada waktu, jadi *let's go* 😬.

Jadi kasusnya itu, barusan Saya mau refaktor *project legacy*, tapi karena ini adalah fase awal refaktor, jadi sebisa mungkin databasenya nggak berganti dulu. Karena pasti butuh waktu ekstra juga buat *remigrate* database lama ke database yang baru dengan struktur dan skema yang berbeda. Mari kita kupas.

## Laravel Breeze
Laravel Breeze ini adalah sebuah *package* yang disediakan oleh Laravel, secara *official* yang bisa teman-teman unduh [disini](https://laravel.com/docs/9.x/starter-kits#laravel-breeze). Breeze ini udah nyediain *view* untuk Login, Register, Lupa Password, Verifikasi Email, dan lain sebagainya yang bisa mempersingkat waktu *development* kalian.

Sekedar info barangkali males buka dokumentasi, cara instal Breeze adalah sebagai berikut:
```bash
# 1. Tambahkan Breeze ke packages.json atau dengan cara menjalankan perintah:
composer require laravel/breeze --dev

# 2. Instal Breeze Scaffolding untuk Laravel dengan cara menjalankan perintah:
php artisan breeze:install

# 3. Jalankan npm install && npm run dev
npm install && npm run dev
```

Dengan kelebihannya ini, Breeze memiliki beberapa kelemahan jika digunakan secara bawaan. Breeze hanya mengenal **Email** dan **Password** sebagai "key" dari autentikasi mereka. Lantas, **bagaimana jika Saya ingin mengubah kolom autentikasi default Breeze?** Cukup mudah sebetulnya, cuma butuh waktu sekitar 3 menitan, namun karena Saya orang dokumentasi, jadi Saya sekalian ngulik ke file *vendor*-nya juga wkwkwk.

### Skema Database
Anggap saja Saya memiliki tabel user dengan struktur seperti ini:
```bash
mysql> SHOW COLUMNS FROM MUSR;
+------------+--------------+------+-----+---------+-------+
| Field      | Type         | Null | Key | Default | Extra |
+------------+--------------+------+-----+---------+-------+
| USRID      | int          | NO   | PRI | NULL    |       |
| USREM      | varchar(100) | NO   |     | NULL    |       |
| USRNM      | varchar(100) | NO   |     | NULL    |       |
| USRPW      | text         | NO   |     | NULL    |       |
+------------+--------------+------+-----+---------+-------+
4 rows in set (0.00 sec)
```

Agak *complicated* karena strukturnya aneh ya, tapi sedikit penjelasan:
- `USRID` adalah singkatan dari `user_id`
- `USREM` adalah singkatan dari `email`
- `USRNM` adalah singkatan dari `username`
- `USRPW` adalah singkatan dari `password`

Nyeleneh semisal kita terbiasa ngikutin *naming convention* dari Laravel. Apalagi nama tabelnya `MUSR`, bukan `users`, tapi *no worries, I got you covered*.

### Overriding Breeze's Authentication
> **CATATAN**: *Project* ini dibuat untuk Laravel 9.x, jika teman-teman menggunakan versi dibawahnya, mohon cek dokumentasi lebih lanjut untuk mengecek ulang apakah metode yang sama sudah diimplementasi pada versi-versi sebelumnya.

1. Pertama-tama, kita harus ubah metode `authenticate()` pada `App\Http\Requests\Auth\LoginRequest`. Fungsi ini ada pada baris ke-44:
    ```php
    <?php
    // app/Http/Requests/Auth/LoginRequest.php
    // ...
    class LoginRequest extends FormRequest
    {
        // ...
        public function authenticate()
        {
            $this->ensureIsNotRateLimited();
    
            if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
                RateLimiter::hit($this->throttleKey());
    
                throw ValidationException::withMessages([
                    'email' => trans('auth.failed'),
                ]);
            }
    
            RateLimiter::clear($this->throttleKey());
        }
        // ...
    }
    ```
    Nah, jika teman-teman lihat pada bagian `Auth::attempt()`, Breeze secara *default* menggunakan `email` dan `password` sebagai *key* dari autentikasinya. Untuk menyesuaikan skema Breeze dengan skema tabel User yang saya punya, kita harus mengubahnya dengan kode sebagai berikut:
    ```php
    <?php
    // app/Http/Requests/Auth/LoginRequest.php
    // ...
    class LoginRequest extends FormRequest
    {
        // ...
        public function authenticate()
        {
            $this->ensureIsNotRateLimited();
    
            if (! Auth::attempt(['USREM' => $this->email, 'password' => $this->password], $this->boolean('remember'))) {
                RateLimiter::hit($this->throttleKey());
    
                throw ValidationException::withMessages([
                    'email' => trans('auth.failed'),
                ]);
            }
    
            RateLimiter::clear($this->throttleKey());
        }
        // ...
    }
    ```
    Nah, dengan ini, autentikasi "Custom* bisa kita implementasikan.

    "Bentar Ghits, ngubah 1 file doang?" nggak kok wkwkwk, kita akan ubah 1 file lagi

2. Kedua, sesuaikan model `User`. Hal ini meliputi perubahan atribut `$fillable`, `$hidden`, dll:
    ```php
    <?php
    // app/Models/User.php
    class User extends Authenticatable
    {
        use HasApiTokens, HasFactory, Notifiable, SoftDeletes;
    
        protected $table = "MUSR";
    
        protected $primaryKey = "USRID";
    
        public $incrementing = false;
    
        public function getAuthPassword()
        {
            return $this->USRPW;
        }
    
        /**
         * The attributes that are mass assignable.
         *
         * @var array<int, string>
         */
        protected $fillable = [
            'USREM',
            'USRPW',
            'USRNM',
        ];
    
        /**
         * The attributes that should be hidden for serialization.
         *
         * @var array<int, string>
         */
        protected $hidden = [
            'USRPW',
        ];
    }
    ```
       
    Jangan bingung dulu, berikut penjelasannya:
    1. Atribut `$table` akan mengatur nama tabel yang kita pakai. Teman-teman juga bisa menggunakan nama tabel lain untuk autentikasi kalian. Seperti `pengguna`, `mod_user`, `mod_anggota`, dlsb. Bebaskanlah kreasi kalian, tapi tetap gunakan nama yang *meaningful*.
    2. Atribut `$primaryKey` akan mengatur Primary Key yang digunakan. Secara default, Laravel akan mengatur kolom ini ke `id`. Menurut dokumentasinya, Primary Key yang dimaksud oleh Laravel adalah sebuah kolom yang *Auto Incrementable*.
    3. Atribut `$incrementing` adalah penanda bahwa atribut `$primaryKey` adalah sebuah `AUTO_INCREMENT`. Karena `USRID` adalah bukan sebuah *Auto Increment*, maka Saya mengatur atribut ini ke `false`.
    4. Metode `getAuthPassword(): string` adalah sebuah metode yang digunakan oleh kontrak `Authenticatable`, yang dimana ia akan memberikan *hashed value* dari `password` yang ada di database, lalu diverifikasi oleh kontrak `UserProvider`. Pembahasan ini akan sangat mendalam untuk dibahas di artikel ini, jadi akan saya simpan untuk pembahasan lain hari. Intinya, teman-teman harus me-*return* *value* dari kolom "password" yang ada pada database.

Daaaaaan, *voilla*. Aplikasi yang Anda bangun sekarang bisa diakses menggunakan tabel `user` *legacy* 🥳🎉. Sekian artikelnya, semoga bermanfaat. Jika ada pertanyaan terkait artikel ini, silahkan cantumkan di kolom komentar.
