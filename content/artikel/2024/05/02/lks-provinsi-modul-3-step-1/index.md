---
title: "Tutorial Mengerjakan Soal Modul 3 LKS Provinsi Web Technology - Autentikasi"
date: 2024-05-04T05:40:00+07:00
tags: ["article", "laravel", "web", "technology", "lks"]
draft: false
series: ["Modul 3 LKS Provinsi Web Technology"]
series_order: 1
---

Halo semua 👋, jika kalian membaca ini, berarti Anda telah lolos ke tahap selanjutnya dan siap berkompetisi dengan beberapa kompetetitor lain. Selamat berpusing-pusing ria, dan jangan lupa untuk semangat belajarnya.

Dalam dalam modul ini, kita harus membuat sebuah REST API menggunakan Laravel 10. Untuk tahap pertama, kita akan membahas bagaimana caranya kita membuat Endpoint Autentikasi yaitu Register, Login, dan Register. Mari kita lihat soal lengkap dari sub-modul Autentikasi yang akan kita buat.


## Penyesuaian Tabel `users`

Sebelum itu, kita harus menyesuaikan tabel `users` yang secara default sudah disediakan oleh Laravel. Pada awalnya, Laravel hanya akan menyediakan tabel `users` dengan skema sebagai berikut:

| Kolom | Tipe Data |
|-|-|
| id | BIGINT UNSIGNED PRIMARY_KEY auto_increment |
| name | VARCHAR(255) |
| email | VARCHAR(255) |
| email_verified_at | TIMESTAMP DEFAULT NULL |
| password | VARCHAR(255) |
| remember_token | VARCHAR(100) |
| created_at | TIMESTAMP NULL |
| updated_at | TIMESTAMP NULL |

Dan kita akan mengubahnya menjadi berikut:

| Kolom | Tipe Data |
|-|-|
| id | BIGINT UNSIGNED PRIMARY_KEY auto_increment |
| full_name | VARCHAR(255) |
| username | VARCHAR(255) |
| bio | VARCHAR(255) |
| is_private | BOOLEAN |
| password | VARCHAR(255) |
| remember_token | VARCHAR(100) |
| created_at | TIMESTAMP NULL |
| updated_at | TIMESTAMP NULL |


### Menambahkan Kolom `username`, `bio`, dan `is_private`

Dikarenakan pada soal kita membutuhkan kolom-kolom tersebut, kita akan menggunakan fitur Laravel yang bernama **Migrations**. Migrations berguna untuk mengubah struktur tabel tanpa menyentuh klien basis data seperti *phpMyAdmin*. Migrations juga berguna jika Anda bekerja dengan beberapa orang lain sebagai tim dengan menjaga supaya struktur data tetap konsisten.

Untuk menambahkan kolom `username`, `bio`, dan `is_private`, kita perlu mengeksekusi perintah berikut pada command line:

`php artisan make:migration "add username bio and is_private columns to users table"`

Menjalankan perintah tersebut akan membuat sebuah file dengan format `<timestamp>_add_username_bio_and_is_private_columns_to_users_table.php` pada folder `database/migrations`. Buka file tersebut dan Anda akan melihat file seperti ini:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
```

Pada sebuah Migration, Anda akan melihat fungsi `up` yang digunakan untuk memanipulasi sebuah tabel pada sebuah basis data. Sementara fungsi `down` digunakan untuk mengembalikan skema pada _state_ sebelumnya. Bisa dikatakan bahwa fungsi `down` harus berisi kebalikan dari fungsi `up`.

Pada sebuah Migration juga, Anda akan melihat kode `Schema::table('users', function (Blueprint $table) { })`, kode ini menandakan bahwa kita akan membuat perubahan pada tabel `users`.

Kita akan ubah Migration di atas sebagai berikut:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->after('name', function (Blueprint $table) {
                $table->string('username');
                $table->string('bio');
                $table->boolean('is_private');
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'username',
                'bio',
                'is_private',
            ]);
        });
    }
};
```

Pada fungsi `up` yang sudah kita modifikasi, kita menggunakan sintaks `$table->after(string $column, Callback)` untuk **menambahkan** beberapa kolom setelah kolom yang sudah kita tentukan pada parameter `$column`. Pada kasus ini kita menambahkan kolom:
- `username` - string / VARCHAR(255)
- `bio` - string / VARCHAR(255)
- `is_private` - boolean

Seperti yang kita katakan tadi bahwa fungsi `down` merupakan kebalikan dari fungsi `up`, maka kita akan **menghapus** kolom-kolom di atas.

Setelah disimpan, kita harus menjalankan Migration tersebut dengan menjalankan `php artisan migrate` pada command line. Setelah Migration berhasil dijalankan, maka kita akan melihat perubahan pada tabel `users` sebagai berikut:

| Kolom | Tipe Data |
|-|-|
| id | BIGINT UNSIGNED PRIMARY_KEY auto_increment |
| name | VARCHAR(255) |
| username | VARCHAR(255) |
| bio | VARCHAR(255) |
| is_private | BOOLEAN |
| email | VARCHAR(255) |
| email_verified_at | TIMESTAMP DEFAULT NULL |
| password | VARCHAR(255) |
| remember_token | VARCHAR(100) |
| created_at | TIMESTAMP NULL |
| updated_at | TIMESTAMP NULL |


### Mengubah kolom `name` menjadi `full_name`

Untuk mengubah kolom `name` menjadi `full_name`, kita perlu mengeksekusi perintah berikut pada command line:

`php artisan make:migration "change name to full_name in users table"`

Menjalankan perintah tersebut akan membuat sebuah file dengan format `<timestamp>_change_name_to_full_name_in_users_table.php` pada folder `database/migrations`. Buka file tersebut dan ubahlah file tersebut sampai terlihat seperti ini:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('name', 'full_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('full_name', 'name');
        });
    }
};
```

Fungsi dari `$table->renameColumn(string $before, string $after)` adalah untuk mengubah nama kolom.

{{< alert icon="alert-02-stroke-rounded" cardColor="#0ea5e9" iconColor="#082f49" textColor="#0c4a6e" >}}
  Jangan tertukar antara fungsi `rename` dan `renameColumn`. Fungsi `rename` akan mengubah nama tabel, sementara `renameColumn` akan mengubah nama salah satu kolom dari tabel tersebut.
{{< /alert >}}

Setelah disimpan, kita harus menjalankan Migration tersebut dengan menjalankan `php artisan migrate` pada command line. Setelah Migration berhasil dijalankan, maka kita akan melihat perubahan pada tabel `users` sebagai berikut:

| Kolom | Tipe Data |
|-|-|
| id | BIGINT UNSIGNED PRIMARY_KEY auto_increment |
| full_name | VARCHAR(255) |
| username | VARCHAR(255) |
| bio | VARCHAR(255) |
| is_private | BOOLEAN |
| email | VARCHAR(255) |
| email_verified_at | TIMESTAMP DEFAULT NULL |
| password | VARCHAR(255) |
| remember_token | VARCHAR(100) |
| created_at | TIMESTAMP NULL |
| updated_at | TIMESTAMP NULL |


### Menghapus kolom `email` dan `email_verified_at`

Untuk menghapus kolom `email` menjadi `email_verified_at`, kita perlu mengeksekusi perintah berikut pada command line:

`php artisan make:migration "drop email and email_verified_at columns in users table`

Menjalankan perintah tersebut akan membuat sebuah file dengan format `<timestamp>_drop_email_and_email_verified_at_columns_in_users_table.php` pada folder `database/migrations`. Buka file tersebut dan ubahlah file tersebut sampai terlihat seperti ini:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'email',
                'email_verified_at',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->after('is_private', function (Blueprint $table) {
                $table->string('email')->unique();
                $table->timestamp('email_verified_at')->nullable();
            });
        });
    }
};
```

Fungsi dari `$table->dropColumn(array $columns)` adalah untuk menghapus kolom-kolom yang ada pada tabel tersebut, Anda dapat menghapus satu atau lebih kolom.

Dikarenakan pada fungsi `up` kita menghapus dua kolom, maka pada fungsi `down` kita harus menambahkan dua tabel dengan nama kolom dan tipe data yang sesuai.
- `email` - string / VARCHAR(255)
- `email_verified_at` - TIMESTAMP NULL

Pada bagian ini juga kita dapat melihat dua modifier berupa `unique` dan `nullable`. Modifier `unique` menandakan bahwa kolom tersebut haruslah unik dan tidak boleh ada data yang serupa pada baris itu, contohnya pada baris 1 terdapat email `yourlovelydev@gmail.com`, maka baris selanjutnya tidak boleh ada email seperti itu juga. Modifier `nullable` menandakan bahwa kolom tersebut boleh dikosongkan dan dapat diisi lain kali.

Setelah disimpan, kita harus menjalankan Migration tersebut dengan menjalankan `php artisan migrate` pada command line. Setelah Migration berhasil dijalankan, maka kita akan melihat perubahan pada tabel `users` sebagai berikut:

| Kolom | Tipe Data |
|-|-|
| id | BIGINT UNSIGNED PRIMARY_KEY auto_increment |
| full_name | VARCHAR(255) |
| username | VARCHAR(255) |
| bio | VARCHAR(255) |
| is_private | BOOLEAN |
| password | VARCHAR(255) |
| remember_token | VARCHAR(100) |
| created_at | TIMESTAMP NULL |
| updated_at | TIMESTAMP NULL |


## Penyesuaian Model `User`

Model adalah suatu kelas dalam Laravel yang berfungsi untuk memanipulasi data berdasarkan tabel yang merepresentasikan nama model tersebut. Seperti contohnya Model `User` (singular), maka nama tabelnya adalah `users` (plural). Contoh lainnya adalah model `Transaction`, maka nama tabelnya adalah `transactions`. Intinya, nama Model berbentuk singular, dan nama tabelnya berbentuk plural. Seluruh Model terdapat pada folder `app/Models`.

Buka Model `User` yang terdapat pada folder `app/Models`, Anda akan melihat kode seperti ini:

```php
<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}
```

Struktur pada Model User ini terdapat sebagai berikut:
- Traits, dapat dilihat pada bagian atas setelah kurawal (`{`), menggunakan keyword `use`. Pada Model User ini menggunakan Trait `HasApiTokens`, `HasFactory`, dan `Notifiable`. Masing-masing berfungsi untuk menandakan bahwa Model ini dapat memiliki API Token, memiliki Laravel Factory, dan dapat menerima Notifikasi.
- Attributes, adalah variabel (atau bisa disebut properti) yang merepresentasikan nilai dari karakteristik kelas tersebut. Pada Model User ini terdapat 3 Atribut utama yaitu:
  - `$fillable`, yang berfungsi untuk me-whitelist kolom-kolom apa saja yang boleh diisi pada saat Anda menggunakan metode "mass-fill";
  - `$hidden`, yang berfungsi untuk menyembunyikan kolom-kolom pada saat penyajian data; serta
  - `$casts`, yang berfungsi untuk menngubah tipe data yang ada pada basis data, dan merepresentasikannya dalam tipe data yang ada pada PHP, atau tipe data baru yang sudah dikembangkan.

Model `User` adalah sebuah model yang mengekstensi / menuruni sifat-sifat dari `Authenticatable` yang didalamnya berisi fungsi-fungsi untuk mengautentikasi pengguna ke aplikasi, sehingga `User` dapat digunakan untuk masuk / keluar di aplikasi yang Anda bangun. Kelas `Authenticatable` sendiri menuruni sifat-sifat dari `Model` sehingga dapat berinteraksi dengan basis data.

Kita akan menyesuaikan kolom-kolom baru yang ada pada tabel `users` dengan atribut-atribut pada model `User`:

```diff
<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
-       'name',
+       'full_name',
        'email',
        'password',
+       'username',
+       'bio',
+       'is_private',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
+       'is_private' => 'boolean',
    ];
}
```


## Autentikasi

Setelah seluruh penyesuaian terhadap tabel `users` dan Model `User` sudah selesai, saatnya kita mengerjakan soal LKS bagian Autentikasi.
Bagian ini terbagi menjadi 3 sub-bagian yaitu Register yang digunakan oleh user untuk mendaftar, Login yang digunakan oleh user untuk masuk ke sistem dan mendapatkan data-data yang ada pada aplikasi, serta Logout yang digunakan oleh user untuk keluar dari aplikasi.


### Register


#### Membuat RegisterController

Pertama, kita harus membuat Controller yang akan menanggung beban Request yang digunakan untuk pendaftaran. Untuk membuat controller, jalankan perintah berikut:

`php artisan make:controller Api/v1/Auth/RegisterController --invokable`

Perintah di atas akan membuat Controller di folder `app/Http/Controllers/Api/v1/Auth/`. Buka Controller tersebut dan Anda akan melihat kode seperti berikut:

```php
<?php

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;

class RegisterController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(RegisterRequest $request)
    {
        //
    }
}
```

Tampak kosong untuk sekarang, tapi kita akan memodifikasi kode ini lain kali.


#### Mendaftarkan Rute Registrasi

Untuk mendaftarkan rute registrasi kita ke Controller yang barusan dibuat, buka file `routes/api.php`, Anda akan melihat kode sebagai berikut:

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
```

Ubah file ini sehingga terlihat seperti ini:

```php
<?php

use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {
    Route::group(['prefix' => 'auth'], function () {
        Route::post('/register', \App\Http\Controllers\Api\v1\Auth\RegisterController::class);
    });
});
```

Pada file ini, kita berkenalan dengan sebuah Fasad bernama `Route`, Fasad `Route` ini berfungsi untuk mendaftarkan rute-rute yang mungkin ada di aplikasi yang kita bangun. Pengembang memiliki kebebasan untuk mendefinisikan bagaimana rute aplikasi yang dibangun, namun disarankan untuk tetap menggunakan standar penulisan kode dan praktek terbaik yang sudah ada di kalangan para pengembang.

Pertama-tama kita akan membuat sebuah grup rute `v1` yang mendefinisikan bahwa kumpulan rute-rute yang ada pada bagian ini merupakan rute versi pertama. Setelah itu, definisikan grup rute `auth` yang mendefinisikan bahwa kumpulan rute-rute yang ada bagian ini merupakan rute autentikasi.

Setelah itu, baru kita daftarkan rute `register` kita yang akan di-handle oleh `RegisterController` yang barusan kita buat. Endpoint `register` ini kita atur untuk hanya dapat menerima metode `POST`.


#### Mengubah file `RegisterController`

Setelah mendaftarkan rute `register`, kita sebenarnya sudah dapat menerima data yang dikirimkan oleh user, namun kita belum mengolahnya sehingga User dapat masuk ke aplikasi. Sehingga kita harus memodifikasi `RegisterController` supaya data yang dikirimkan dapat memperbolehkan User untuk masuk ke aplikasi.

Kita modifikasi `RegisterController` sehingga dilihat sebagai berikut:

```php
<?php

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\Auth\RegisterRequest;
use App\Models\User;

class RegisterController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(RegisterRequest $request)
    {
        $userData = $request->validate([
            'full_name' => ['required', 'string'],
            'bio' => ['required', 'string', 'max:100'],
            'username' => ['required', 'string', 'unique:users,username', 'min:3', 'regex:/^[a-zA-Z0-9._]+$/'],
            'password' => ['required', 'string', 'confirmed'],
            'is_private' => ['required', 'boolean'],
        ]);

        try {
            $user = User::create($userData);

            $token = $user->createToken('facegram');
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Register failed: ' . $th->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => 'Register success',
            'token' => $token->plainTextToken,
            'user' => $user,
        ]);
    }
}
```

Dalam tahap ini, pertama-tama kita harus memvalidasi data yang dikirimkan oleh user, jika merujuk pada soal, seluruh data yang dikirimkan harus divalidasi sebagai berikut:

| Kolom | Aturan Validasi |
|-|-|
| `full_name` | required |
| `bio` | required, max 100 chars |
| `username` | required, min 3 chars, unique, only alphanumeric, dot "." or underscore "_" allowed) |
| `password` | required, min 6 chars |
| `is_private` | boolean |

Validasi-validasi yang ada pada Laravel, lengkapnya dapat dilihat pada [dokumentasi berikut](https://laravel.com/docs/10.x/validation), namun yang digunakan saat ini adalah:
- `required`, memvalidasi kolom tersebut **wajib diisi**
- `string`, memvalidasi kolom tersebut berbentuk string atau teks
- `max:num`, memvalidasi kolom tersebut tidak boleh lebih dari `num` karakter
- `unique:table,column`, memvalidasi data dari kolom tersebut tidak boleh sama dari data yang ada di tabel `table` dan kolom `column`
- `min:num`, memvalidasi kolom tersebut minimal berisi `num` karakter
- `regex:pattern`, memvalidasi kolom tersebut harus berbentuk sebuah pola `pattern`, pada kasus ini kita menggunakan regex `/^[a-zA-Z0-9._]+$/` yang berarti menerima karakter `a s/d z`, `A s/d Z`, `0 s/d 9`, serta memperbolehkan titik `.` dan underscore `_`
- `confirmed`, memvalidasi kolom tersebut harus sama dengan data `<column>_confirmation`
- `boolean`, memalidasi kolom tersebut harus berbentuk boolean (`true` / `false`)

Perhatikan kode berikut:

```php
$userData = $request->validate([
    'full_name' => ['required', 'string'],
    'bio' => ['required', 'string', 'max:100'],
    'username' => ['required', 'string', 'unique:users,username', 'min:3', 'regex:/^[a-zA-Z0-9._]+$/'],
    'password' => ['required', 'string', 'confirmed'],
    'is_private' => ['required', 'boolean'],
]);
```

Kelas `\Illuminate\Http\Request` memiliki fungsi `validate()` yang digunakan untuk memvalidasi data yang dikirimkan. Setelah data yang dikirimkan berhasil divalidasi, maka data akan di-assign ke sebuah variabel bernama `$userData`, variabel ini akan kita gunakan pada tahap selanjutnya.

Setelah melakukan validasi, kita harus menyimpan data user yang dikirimkan ke basis data, perhatikan kode berikut:

```php
try {
    $user = User::create($userData);

    $token = $user->createToken('facegram');
} catch (\Throwable $th) {
    return response()->json([
        'message' => 'Register failed: ' . $th->getMessage(),
    ], 500);
}
```

Blok kode `try-catch` berfungsi untuk "mencoba" potongan kode, lalu jika terdapat sebuah error, maka kita dapat melakukan sesuatu terhadap error tersebut alih-alih menampilkan error kepada user.

Untuk menyimpan data User, kita harus memanggil fungsi statis `create` yang terdapat pada model `User` dengan memanggil `User::create(array $properties)`. Karena hasil dari validasi yang sukses adalah berbentuk array, maka variabel `$userData` bisa dapat langsung digunakan sebagai argumen fungsi `create()`. Jika `User::create($userData)` berhasil dijalankan, maka hasil dari eksekusi tersebut akan mereturn sebuah objek `User` yang dapat disajikan ke user. Kita menyimpannya ke variabel `$user` untuk digunakan nanti.

Setelah menyimpan data User, harapannya adalah user dapat langsung masuk ke aplikasi, karena itu kita harus membuat Sanctum Token juga. Untuk membuat Sanctum Token, kita harus menggunakan Model yang menggunakan Trait `HasApiTokens`, karena model `User` sudah mengimplementasi Trait tersebut, maka kita dapat langsung membuatnya dengan memanggil fungsi `createToken(string $tokenName)`. Pada kasus ini kita akan menyimpan token yang sudah dibuat ke variabel `$token`.

Namun dari kedua baris kode yang ada di blok `try`, jika ada salah satu dari eksekusi kode yang bermasalah, maka blok `catch` akan menerima error tersebut dan kita dapat mengolah error tersebut sebelum dikirimkan ke user. Approach `catch` kita kali ini adalah mengembalikan Response berbentuk JSON dengan pesan `Register failed: <error message>`. Keyword `return` menandakan bahwa kode setelahnya siap untuk dikirimkan kembali kepada user. Yang dikembalikan adalah sebuah `response()`, berbentuk `json(array $data, int $status)`. HTTP Status 500 yang kita tulis menandakan bahwa error terjadi karena ada kesalahan pada server.

Jika seluruh kode yang ada di blok `try` berhasil dijalankan, maka selanjutnya Controller akan mengirimkan `response()` berbentuk `json()` yang ada di bawahnya yaitu:

```php
return response()->json([
    'message' => 'Register success',
    'token' => $token->plainTextToken,
    'user' => $user,
]);
```


#### Menyesuaikan Validasi

Dalam konsep SOLID, terdapat konsep One Responsibility, yaitu setiap file atau kelas hanya boleh memiliki satu tanggung jawab. Karena Controller berfungsi sebagai penjembatan antara Request dan basis data, adanya proses validasi menjadikan Controller `RegisterController` memiliki dua tanggung jawab, karena itu kita harus memisahkan peran tersebut ke sebuah `Request`. Untuk membuat sebuah `Request` yang sesuai dengan konteks ini, jalankan perintah berikut:

`php artisan make:request Api/v1/Auth/RegisterRequest`

File ini akan membuat sebuah file yang diletakkan di `app/Http/Requests/Api/v1/Auth/RegisterRequest`, buka file tersebut dan Anda akan melihat kode ini:

```php
<?php

namespace App\Http\Requests\Api\v1\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
        ];
    }
}
```

Pertama-tama, kita akan mengubah value return yang ada pada fungsi `authorize` menjadi `true`, lalu memindahkan seluruh aturan validasi yang ada di `RegisterController` ke `RegisterRequest`. Hasil kode akhir akan berbentuk seperti ini:

```php
<?php

namespace App\Http\Requests\Api\v1\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string'],
            'bio' => ['required', 'string', 'max:100'],
            'username' => ['required', 'string', 'unique:users,username', 'min:3', 'regex:/^[a-zA-Z0-9._]+$/'],
            'password' => ['required', 'string', 'confirmed'],
            'is_private' => ['required', 'boolean'],
        ];
    }
}
```

Setelah itu, pada file `RegisterController`, kita harus mengubah penulisannya sedikit. Pertama, tambahkan kode:

```php
use App\Http\Requests\Api\v1\Auth\RegisterRequest;
```

di barisan paling atas sebelum `class RegisterController extends Controller`, lalu mengubah `public function __invoke(Request $request)` menjadi `public function __invoke(RegisterRequest $request)`. Perubahan kode lengkapnya adalah sebagai berikut:

```diff
<?php

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;
+ use App\Http\Requests\Api\v1\Auth\RegisterRequest;
use App\Models\User;
- use Illuminate\Http\Request;

class RegisterController extends Controller
{
    /**
     * Handle the incoming request.
     */
+   public function __invoke(RegisterRequest $request)
-   public function __invoke(Request $request)
    {
+       $userData = $request->validated();
-       $userData = $request->validate([
-           'full_name' => ['required', 'string'],
-           'bio' => ['required', 'string', 'max:100'],
-           'username' => ['required', 'string', 'unique:users,username', 'min:3', 'regex:/^[a-zA-Z0-9._]+$/'],
-           'password' => ['required', 'string', 'confirmed'],
-           'is_private' => ['required', 'boolean'],
-       ]);

        try {
            $user = User::create($userData);

            $token = $user->createToken('facegram');
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Register failed: ' . $th->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => 'Register success',
            'token' => $token->plainTextToken,
            'user' => $user,
        ]);
    }
}
```

Jika Anda sudah berhasil mencapai titik ini, selamat! Anda hanya perlu mencobanya menggunakan software API Testing seperti Postman, Thunder Client, atau APIDog. Pilih sesuai yang Anda inginkan. Serta jangan lupa, perjalanan baru dimulai sekarang.


### Login

Seperti biasa, alur untuk pembuatan sebuah endpoint baru adalah dengan membuat Controllernya terlebih dahulu, untuk membuat `LoginController`, jalankan perintah berikut pada command line:

`php artisan make:controller Api/v1/Auth/LoginController --invokable`


#### Mendaftarkan Rute Login

Abaikan dulu penulisan kode `LoginController` untuk sementara waktu, dan kita fokus ke pendaftaran rute. Seperti yang sebelumnya dilakukan, buka file `routes/api.php`, lalu daftarkan `LoginController` ke rute `login`.

Sebagai tantangan, jangan buka dulu spoiler di bawah sebelum Anda bisa mengetahui apa yang harus Anda lakukan. Ingat bahwa Anda sedang belajar dan bukan meniru.

<details>
    <summary>Spoiler <code>routes/api.php</code> setelah ditambahkan</summary>

```php
<?php

use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {
    Route::group(['prefix' => 'auth'], function () {
        Route::post('/register', \App\Http\Controllers\Api\v1\Auth\RegisterController::class);
        Route::post('/login', \App\Http\Controllers\Api\v1\Auth\LoginController::class);
    });
});
```
</details>

Apakah rute `/v1/auth/login` sudah Anda tambahkan? Jika sudah, silahkan buka spoiler di atas dan komparasikan perbedaannya dengan kode Anda. Jika sudah sesuai, silahkan ke langkah berikutnya.


#### Mengubah file `LoginController`

Buka file `app/Http/Controllers/Api/v1/Auth/LoginController.php`, lalu kita modifikasi kodenya hingga terlihat sebagai berikut:

```php
<?php

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $userData = $request->validate([
            'username' => ['required'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($userData)) {
            return response()->json([
                'message' => 'Wrong username or password',
            ], 401);
        }

        $user = User::query()
            ->where('username', $userData['username'])
            ->first();

        $token = $user->createToken('facegram');

        return response()->json([
            'message' => 'Login success',
            'token' => $token->plainTextToken,
            'user' => $user,
        ]);
    }
}
```

Untuk validasi, simpel saja karena tidak ada kebutuhan khusus yang didefinisikan dalam soal, sehingga kita hanya perlu menandakan bahwa kolom `username` dan `password` adalah `required`.

Setelah itu, kita akan menggunakan Fasad `Auth` untuk "mencoba" masuk ke dalam sistem menggunakan data yang sudah divalidasi. Metode `attempt(array $data)` akan me-return `boolean`, `true` jika berhasil dan `false` jika gagal. Perhatikan tanda seru atau "_bang_" pada kode `if (! Auth::attempt($userData))`, kode itu dibaca sebagai "Jika Fasad Auth **GAGAL** untuk mencoba masuk ke sistem dengan `$userData` yang diberikan, maka..." kita akan memberikan `response` berupa `json` dengan pesan "Wrong username or password" dengan HTTP Response Code 401 yang berarti "Unauthorized".

Kode setelah blok `if` adalah kode yang dieksekusi "Jika Fasad Auth **BERHASIL**", setelahnya kita mengambil data `User` dengan menggunakan kolom `username` sebagai klausa `WHERE`, lalu membuat token dari `User` tersebut, dan terakhir kita memberikan `response` berupa `json` dengan data yang sudah kita ambil.


#### Memindahkan Validasi ke `LoginRequest`

Apakah Anda memngingat prinsip O pada SOLID yang berarti "One Responsibility"? Kita akan mengimplementasikannya pada Login juga. Seperti biasa kita jalankan perintah untuk membuat `Request` dengan perintah:

`php artisan make:request Api/v1/Auth/LoginRequest`

Lalu buka file `app/Http/Requests/Api/v1/Auth/LoginRequest.php`, ubah return value `authorize` menjadi `true`, lalu pindahkan aturan validasi yang ada pada `LoginController` ke fungsi `rules` pada `LoginRequest`. Hasil kodenya adalah sebagai berikut:

```php
<?php

namespace App\Http\Requests\Auth\v1;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'username' => ['required'],
            'password' => ['required'],
        ];
    }
}
```

Tentu saja, kita juga harus mengubah kode yang ada pada `LoginController`, kurang lebih sebagai berikut:


```diff
<?php

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;
+ use App\Http\Requests\Auth\v1\LoginRequest;
use App\Models\User;
- use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
-       $userData = $request->validate([
-           'username' => ['required'],
-           'password' => ['required'],
-       ]);

+       if (! Auth::attempt($request->validated())) {
-       if (! Auth::attempt($userData)) {
            return response()->json([
                'message' => 'Wrong username or password',
            ], 401);
        }

        $user = User::query()
+           ->where('username', $request->username)
-           ->where('username', $userData['username'])
            ->first();

        $token = $user->createToken('facegram');

        return response()->json([
            'message' => 'Login success',
            'token' => $token->plainTextToken,
            'user' => $user,
        ]);
    }
}
```


### Logout

Fitur `Logout` adalah fitur terakhir yang ada pada Autentikasi ini. Sebelum melanjutkan, Anda sudah mengetahui siklus Pembuatan Controller dan Pendaftaran Rute kan? Jika masih belum paham, di bawah ini adalah ringkasannya:
- Buat Controller
- Daftarkan Rute
- Modifikasi Controller
  - Validasi Data
  - Manipulasi Data
  - Return Value

Sebagai tantangan kali ini, coba Anda buat Controller `LogoutController`, tulis perintahnya dulu di command line, namun jangan eksekusi perintahnya terlebih dulu. Jika Anda rasa perintah yang Anda tulis sudah benar, silahkan cross-check dengan perintah yang saya buat di bawah:

<details>
    <summary>Spoiler: Perintah pembuatan Controller <code>LogoutController</code></summary>

`php artisan make:controller Api/v1/Auth/LogoutController --invokable`
</details>

Jika kodenya sama dengan apa yang Anda tulis, selamat! Ini membuktikan Anda belajar dengan sungguh-sungguh. Selanjutnya mungkin Anda sudah tau bahwa kita akan mendaftarkan Rutenya ke `routes/api.php`, namun dikarenakan kita memiliki satu fitur yang mencegah orang tanpa "Token" bisa menggunakan endpoint `logout`, maka harus Saya jelaskan juga arti kode di balik fungsi tersebut.

#### Mendaftarkan Rute Logout

File `routes/api.php` yang kita sudah kenal dimodifikasi sampai dengan terlihat sebagai berikut:

```php
<?php

use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {
    Route::group(['prefix' => 'auth'], function () {
        Route::post('/register', \App\Http\Controllers\Api\v1\Auth\RegisterController::class);
        Route::post('/login', \App\Http\Controllers\Api\v1\Auth\LoginController::class);
        Route::post('/logout', \App\Http\Controllers\Api\v1\Auth\LogoutController::class)->middleware('auth:sanctum');
    });
});
```

Tidak seperti Rute `register` dan `login`, kita memiliki tambahan modifier `middleware(array|string|null $middleware)`. Middleware `auth:sanctum` menginstruksikan kepada Fasad `Auth` bahwa seluruh orang yang mengakses Rute `logout` harus memiliki `Bearer Token`. Hal ini mencegah Rute `logout` tidak dapat diakses oleh orang yang belum pernah login.

#### Mengubah file `LogoutController`

Ubah file `app/Http/Controllers/Api/v1/Auth/LogoutController` sehingga menjadi kode seperti ini:

```php
<?php

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LogoutController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $user = $request->user();

        try {
            $user->tokens()->delete();
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Logout failed: ' . $th->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => 'Logout success',
        ]);
    }
}
```

Kita tidak perlu melakukan validasi apapun, karena tujuan kita pada modul Logout kali ini hanyalah menghapus token-token yang terkait pada suatu User, sehingga token-token tersebut dinyatakan "Invalid" sehingga User tidak dapat mengakses Rute dengan Middleware `auth:sanctum` menggunakan token yang sama.

Kode `$request->user()` adalah perintah untuk mendapatkan instance User. Di latar belakang, `auth:sanctum` mencoba untuk mendapatkan data User dari Access Token yang diberikan melalui Header Request, sehingga kita dapat mengambil data User dari Fasad `Request` tanpa harus mengetahui `username` dan `password` di setiap Controller.

Pada blok `try`, kita coba untuk menghapus data token-token yang terkait pada User tersebut, lalu jika gagal, maka simpelnya kita akan return `response` sebagai `json` dengan pesan bahwa "Logout failed: error". Jika berhasil maka kita kirim `response` berbentuk `json` dengan pesan bahwa "Logout success".


## Akhir kata

Ini adalah artikel panjang yang memiliki durasi sekitar 20 menit, jadi dibutuhkan kesabaran untuk membaca secara teliti langkah demi langkah yang harus diimplementasikan. Terima kasih sudah membaca sampai akhir, semoga Anda lolos dalam LKS Provinsi 2024!