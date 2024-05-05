---
title: "Tutorial Mengerjakan Soal Modul 3 LKS Provinsi Web Technology - Post"
date: 2024-05-05T03:24:00+07:00
tags: ["article", "laravel", "web", "technology", "lks"]
draft: false
series: ["Modul 3 LKS Provinsi Web Technology"]
series_order: 3
---

Hai hai, kembali lagi di seri artikel Modul 3 LKS Provinsi bidang Web Technology. Kali ini kita akan membuat REST API untuk Modul Post. Kali ini akan banyak pembahasan lebih mendalam dan lebih matang, karena itu, siapkan air dan fokus kepada tutorial kodingnya. Perhatikan langkah demi langkah secara teliti untuk dapat mengerjakannya dengan baik.


## Membuat Model `Post` beserta Migrationnya

Kali ini, karena tabel `Post` belum tersedia oleh Laravel, kita akan belajar untuk membuat Model beserta Migrationnya secara langsung. Untuk membuatnya, jalankan perintah berikut:

`php artisan make:model Post -m`

Perhatikan flag `-m` yang diberikan, flag tersebut menandakan bahwa "Hei Laravel, buatkan saya Model `Post` beserta Migrationnya secara bersamaan. Setelah itu, Anda akan melihat bahwa ada 2 file yang dibuat pada directory `app/Models/Post.php` dan `database/migrations/<timestamp>_create_posts_table.php`.

Menggunakan flag `-m` juga mencegah Anda untuk menjalankan dua perintah yang berbeda yaitu:
- `php artisan make:model Post`; dan
- `php artisan make:migration "create posts table"`


### Memodifikasi Migration Post

Buka file `database/migrations/<timestamp>_create_posts_table.php` dan Anda akan melihat kode seperti ini:

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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
```

Berdasarkan ketentuan yang disediakan oleh modul LKS, skema tabel Post harus berisi sebagai berikut:

| | |
|-|-|
| id | BIGINT(20) UNSIGNED PRIMARY auto_increment |
| user_id | BIGINT(20) UNSIGNED FOREIGN_KEY |
| caption | VARCHAR(255) |
| created_at | TIMESTAMP |
| deleted_at | TIMESTAMP |

Perhatikan bahwa terdapat dua kolom spesial yaitu `user_id` dan `deleted_at`. Kolom `user_id` menampung ID dari seorang User, dan kolom `deleted_at` menandakan bahwa Post tersebut sudah dihapus. Metode ini dinamakan Soft Delete, mencegah adanya data yang terhapus secara permanen dari basis data tanpa jejak.

Untuk membuat kolom-kolom tersebut, ubah kode pada fungsi `up()` menjadi seperti ini:

```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained();
    $table->string('caption');
    $table->timestamps();
    $table->softDeletes();
});
```

Perhatikan bahwa terdapat `$table->foreignId('user_id')->constrained()`, kode ini memerintahkan Migration untuk membuat kolom Foreign Key dengan nama `user_id`, yang memiliki relasi langsung dengan tabel `users` kolom `id`. Fungsi `foreignId` menginstruksikan Migration untuk membuat kolom dengan tipe data BIGINT.

Sementara itu, perhatikan juga bahwa terdapat `$table->softDeletes()`, kode ini memerintahkan Migration untuk membuat kolom `deleted_at` dengan tipe data TIMESTAMP.

Setelah semua kode sesuai dengan yang Saya instruksikan, jangan lupa jalankan `php artisan migrate` untuk membuat tabel `posts` pada basis data Anda.

### Memodifikasi Kode Model `Post`

Buka file `app/Models/Post`, Anda akan melihat kode berikut:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;
}
```

Tampak kosong untuk sekarang, namun kita akan mengimplementasikan beberapa Trait, serta Atribut yang dibutuhkan.


#### Mengimplementasikan Trait `SoftDeletes`

Pertama-tama, mari kita implementasikan Trait `SoftDeletes` untuk menginstruksikan Laravel bahwa Model `Post` ini adalah tipe Model yang tidak boleh dihapus secara permanen. Untuk mengimplementasikannya Anda harus menggunakan Trait `Illuminate\Database\Eloquent\SoftDeletes`. Kode lengkapnya adalah berikut:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes;
}
```


#### Mengisi Atribut `$fillable`

Dengan mengisi atribut `$fillable`, Anda dapat menggunakan Model ini untuk menjadikannya dapat di-_mass-created_, sehingga Anda tidak perlu mendefinisikan kolomnya satu per-satu pada saat penyimpanan data.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'caption',
    ];
}
```


#### Membuat Relasi ke Model `User`

Kita kedepannya ingin untuk mendapatkan data `User` secara otomatis, tanpa harus menggunakan klausa `JOIN` pada saat mengambil data `Post`. Untuk itu kita dapat menggunakan relasi `BelongsTo`. Ikuti kode berikut:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected $fillable = [
        'user_id',
        'caption',
    ];
}
```

Perhatikan bahwa Saya menulis kode

```php
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}
```

Ini adalah standar penulisan kode untuk Model Relation `BelongsTo`, Anda akan belajar banyak tipe relasi lebih banyak di [dokumentasi resmi Laravel](https://laravel.com/docs/10.x/eloquent-relationships#defining-relationships). Kode ini memiliki arti bahwa "Model `Post` ini dimiliki oleh `User`".

Anda mungkin bertanya-tanya apa maksud dari `user(): BelongsTo`? Arti dari kode tersebut adalah fungsi `user()` memiliki return type `BelongsTo`. Kode Anda akan error jika tidak menggunakan `use Illuminate\Database\Eloquent\Relations\BelongsTo` di atas file karena PHP tidak mengetahui apakah `BelongsTo` adalah sebuah tipe data, atau sebuah kelas.

Untuk saat ini, penulisan kode Untuk Model `Post` telah selesai. Selanjutnya kita akan membuat Model `PostAttachment`.


## Membuat Model `PostAttachment` beserta Migrationnya

Seperti pada saat kita membuat Model `Post`, Anda harus membuat Model dan Migrationnya secara langsung. Cobalah untuk mengetik perintah untuk membuat Model dan Migrationnya secara langsung sebelum melihat spoiler di bawah. Buktikan bahwa Anda belajar dan mengikuti tutorial dengan sungguh-sungguh.

<details>
    <summary>Spoiler: Kode Membuat Model <code>PostAttachment</code> beserta Migrationnya</summary>

`php artisan make:model PostAttachment -m`
</details>

Jika Anda telah berhasil menjalankan kode tersebut, mari kita modifikasi Migrationnya terlebih dahulu.


### Memodifikasi Migration Post Attachments

Untuk tabel `post_attachments` yang akan kita buat, modul LKS sudah menyediakan skema sebagai berikut:

| | |
|-|-|
| id | BIGINT(20) UNSIGNED PRIMARY auto_increment |
| post_id | BIGINT(20) UNSIGNED FOREIGN_KEY |
| storage_path | VARCHAR(255) |

Buka file `database/migrations/<timestamp>_create_post_attachments_table.php`, dan masukkan kode berikut ke dalam fungsi `up()` pada Migration Anda:

```php
Schema::create('post_attachments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('post_id')->constrained();
    $table->string('storage_path');
    $table->timestamps();
});
```

Anda tentunya sudah familiar dengan fungsi `foreignId()`, `string()`, dan modifier `constrained()` bukan? Jadi jika ditanya oleh penguji, semoga Anda dapat menjawabnya. Jika masih belum, silahkan kembali ke artikel sebelumnya dan baca apa maksud dari fungsi-fungsi tersebut.


### Memodifikasi Model `PostAttachment`

Buka file `app/Models/PostAttachment` dan tuliskan atribut `$fillable` berdasarkan kolom-kolom yang Anda buat. Jangan buka spoiler di bawah kecuali Anda sudah membuat atribut `$fillable`. Jika sudah, silahkan Anda komparasikan kode yang sudah Anda buat dengan apa yang sudah Saya buat.

<details>
    <summary>Spoiler: Kode Model <code>PostAttachment</code> dengan atribut <code>$fillable</code></summary>

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'storage_path',
    ];
}
```
</details>

Jika Anda berhasil menulis kode atribut `$fillable` dengan kolom-kolom yang sesuai, selamat! Anda sudah mempelajari cara membuat atribut. Selanjutnya, implementasikan kode bahwa "Model `PostAttachment` ini dimiliki oleh `Post` menggunakan Relasi `BelongsTo`. Coba buat kode tersebut lalu komparasikan kodenya di spoiler bawah.

<details>
    <summary>Spoiler: Kode Model <code>PostAttachment</code> dengan relasi <code>BelongsTo</code></summary>

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostAttachment extends Model
{
    use HasFactory;

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    protected $fillable = [
        'post_id',
        'storage_path',
    ];
}
```
</details>

Jika kode Model `PostAttachment` sudah mirip dengan kode yang Saya tulis, silahkan lanjut ke langkah selanjutnya.


### Memodifikasi Model `Post` (lagi)

Eits, belum selesai sampai situ, kita harus mengimplementasikan sebuah kode yang menginstruksikan Laravel bahwa Model `Post` memiliki banyak `PostAttachment`. Bagaimana caranya? Ikuti kode berikut:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function post_attachments(): HasMany
    {
        return $this->hasMany(PostAttachment::class);
    }

    protected $fillable = [
        'user_id',
        'caption',
    ];
}
```

Disini kita belajar salah satu relasi baru yang bernama `HasMany`. Relasi ini memiliki arti bahwa Model `Post` ini memiliki banyak `PostAttachment`, atau dalam bahasa manusianya "Post ini memiliki banyak Lampiran". Jika sudah selesai, mari kita buat Controllernya di langkah selanjutnya.


## Memodifikasi Model `User`

Eits, lagi-lagi kita belum selesai. Sebelum membuat `PostController`, kita harus memodifikasi sedikit kode Model `User`. Namun, tidak akan ada tantangan jika Saya memberikan Anda kode lengkapnya tanpa Anda mencobanya terlebih dahulu, maka dari itu:

{{< alert icon="alert-02-stroke-rounded" cardColor="#0ea5e9" iconColor="#082f49" textColor="#0c4a6e" >}}
  Tugas: Implementasikan bahwa Model `User` memiliki relasi `HasMany` ke Model `Post`.
{{< /alert >}}

Komparasikan kode Anda dengan kode Saya untuk mengecek apakah langkah Anda sudah benar.

<details>
    <summary>Spoiler: Kode Model <code>User</code> dengan relasi <code>HasMany</code> kepada Model <code>Post</code></summary>

```php
<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    public function post(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'full_name',
        'email',
        'password',
        'username',
        'bio',
        'is_private',
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
        'is_private' => 'boolean',
    ];
}

```
</details>

Jika kode Anda sudah mirip dengan kode di atas, mari lanjut (kali ini asli) ke langkah selanjutnya!


## Mengubah File `.env`

Sebelum lanjut ke langkah selanjutnya, kita harus mengubah sedikit file `.env`. Buka file `.env` dan cari variabel `FILESYSTEM_DISK`, ubah valuenya dari `local` ke `public`.

Setelah itu jalankan perintah `php artisan storage:link` di command line supaya semua lampiran yang User unggah dapat dibaca oleh browser.


## Membuat Controller `PostController`

Kali ini kita akan membuat `PostController` dengan approach yang berbeda, yaitu dengan cara membuat Controller bertipe API Resource. Untuk membuatnya, eksekusi perintah ini:

`php artisan make:controller Api/v1/PostController --api --model=Post`

Berbeda dengan tutorial Autentikasi sebelumnya yang menggunakan flag `--invokable` yang hanya berisikan 1 fungsi didalamnya yaitu `__invoke(Request $request)`, kita akan membuat banyak fungsi-fungsi yang masing-masing bertanggung jawab untuk menerima Request dengan tipe yang berbeda-beda. Menggunakan flag `--api` akan membuat fungsi:
- `index()`, digunakan untuk mengambil banyak data terkait dengan sebuah Model;
- `store(Request $request)`, digunakan untuk menyimpan data Model ke basis data;
- `show(Model $model)`, digunakan untuk mengambil 1 data spesifik terkait dengan Model;
- `update(Request $request, Model $model)`, digunakan untuk mengubah data Model dari basis data;
- `delete(Model $model)`, digunkana untuk menghapus data dari basis data;

Menjalankan perintah di atas akan membuat file `app/Http/Controllers/Api/v1/PostController.php` lalu ikuti langkah-langkah selanjutnya.


### Implementasi fungsi `store`

Fungsi `store` digunakan untuk menyimpan data Model `Post` ke basis data. Akan ada beberapa langkah sebelum fungsi ini selesai, jadi Saya mohon untuk teliti dalam mengimplementasikan fungsi ini.


#### Validasi Data Request

Seperti biasa, kita harus memvalidasi data yang masuk sebelum disimpan ke database. Dalam modul LKS, kita diberikan informasi validasi sebagai berikut:

| | |
|-|-|
| caption | required |
| attachments | required, array of image files, mimes: jpg, jpeg, png, gif, or webp |

Kode untuk validasi di atas adalah sebagai berikut:

```php
$data = $request->validate([
    'caption' => ['required'],
    'attachments' => ['required'],
    'attachments.*' => ['required', 'image', 'mimes:png,jpg,jpeg,webp,gif'],
]);
```

Arti dari aturan validasi di atas adalah sebagai berikut:
- `caption` haruslah diisi;
- `attachments` haruslah diisi, dengan aturan masing-masing file yang diunggah adalah:
  - berbentuk `image` atau gambar yang valid; dengan
  - memiliki format `png,jpg,jpeg,webp,gif`

Perhatikan bahwa ada aturan validasi `'attachments.*`, aturan ini berarti bahwa semua file yang ada pada key `attachments` haruslah memiliki aturan `blablabla`. Pada Laravel, aturan ini disebut dengan Multiple Field Validation.

Selanjutnya, apakah Anda ingat arti O dari prinsip SOLID? Jika Anda masih ingat, ikuti tugas berikut:

{{< alert icon="alert-02-stroke-rounded" cardColor="#0ea5e9" iconColor="#082f49" textColor="#0c4a6e" >}}
  Tugas: Pindahkan aturan validasi dari fungsi `store` pada `PostController` ke file `StorePostRequest`
{{< /alert >}}


#### Menyimpan Data `Post`

Untuk menyimpan data Model Post, tambahkan kode berikut ini setelah baris kode Validation:

```php
try {
    $post = Post::create([
        'user_id' => $request->user()->id,
        'caption' => $data['caption'],
    ]);
} catch (\Throwable $th) {
    return response()->json([
        'message' => 'Post failed to be created: ' . $th->getMessage(),
    ], 500);
}

return response()->json([
    'message' => 'Post created successfully',
], 201);
```

Kode di atas menginstruksikan bahwa kita menyimpan sebuah `Post` dengan `user_id` terkait ke User yang sedang login saat itu, serta menyimpan `caption`. Jika gagal, maka kita kembalikan `response` berbentuk `json` dengan pesan "Post failed to be created: Error". Jika berhasil kita kembalikan `response` berbentuk `json` dengan pesan "Post created successfully".


#### Menyimpan Lampiran Yang Dikirim

Perlu diingat bahwa kita belum mengimplementasikan kode untuk menyimpan data Lampiran. Untuk menyimpan kode Lampiran, kita harus memodifikasi kode seperti berikut:

```php
try {
    DB::beginTransaction();

    $post = Post::create([
        'user_id' => $request->user()->id,
        'caption' => $data['caption'],
    ]);

    /** @var \Illuminate\Http\UploadedFile $attachment */
    foreach ($data['attachments'] as $attachment) {
        $post->post_attachments()->create([
            'storage_path' => $attachment->store(date('Y-m-d') . '/uploads'),
        ]);
    }
} catch (\Throwable $th) {
    DB::rollBack();

    return response()->json([
        'message' => 'Post failed to be created: ' . $th->getMessage(),
    ], 500);
}

DB::commit();

return response()->json([
    'message' => 'Post created successfully',
], 201);
```

Perhatikan bahwa tepat setelah blok kode `try` kita mengimplementasikan `DB::beginTransaction()`. Kode ini menginstruksikan Controller bahwa kode-kode setelah ini adalah bagian dari Database Transaction. Kita menerapkan kode ini untuk mencegah data tersimpan ke basis data jika suatu saat terjadi kegagalan di salah satu baris pada blok `try`.

Setelah itu, kita implementasikan kode `foreach` untuk mengambil semua data lampiran yang sudah kita validasi untuk disimpan ke tabel `post_attachments`. Jika Anda bertanya-tanya apa maksud dari `/** @var \Illuminate\Http\UploadedFile $attachment */`, kode ini menginstruksikan IDE untuk memberikan tanda bahwa variabel `$attachment` merupakan bagian dari `\Illuminate\Http\UploadedFile`. IDE tidak mengetahui secara default tipe data `$attachment`, karena itu kita mengimplementasikannya secara eksplisit.

Kode berikut

```php
$post->post_attachments()->create([
    'storage_path' => $attachment->store(date('Y-m-d') . '/uploads'),
]);
```

Menginstruksikan bahwa kita akan menyimpan lampiran ke relasi `post_attachments` yang ada di Model `Post`, dengan data untuk kolom `storage_path` berisi directory dimana `$attachment` disimpan.

Pada blok `catch` kita implementasikan `DB::rollBack()` untuk menginstruksikan Controller bahwa "sudah terjadi error di blok `try` dan kita ingin data-data sementara yang ada di basis data dihapus.

Sementara setelah blok `try-catch` kita imlpementasikan `DB::commit()` untuk menginstruksikan Controller bahwa "seluruh kode telah berhasil dijalankan dan tidak ada kendala sama sekali, jadi silahkan simpan semua data sementara".


### Implementasi fungsi `delete`

Pada fungsi `delete`, kita ingin menghapus data Model `Post` beserta data `PostAttachment` yang terkait. Untuk itu, implementasikan kode ini:

```php
try {
    DB::beginTransaction();

    $post->post_attachments()->delete();

    $post->delete();
} catch (\Throwable $th) {
    DB::rollBack();

    return response()->json([
        'message' => 'Post failed to be deleted: ' . $th->getMessage(),
    ], 500);
}

DB::commit();

return response()->json([
    'message' => 'Post deleted successfully',
]);
```

Lagi-lagi, karena terdapat lebih dari satu operasi yang menyangkut eksekusi perintah di basis data, kita harus mengimplementasikan `DB::beginTransaction()`, `DB::rollBack()` dan `DB::commit()`.

Pada blok `try` kita mencoba untuk menghapus lampirannya terlebih dahulu, baru menghapus Post-nya. Hal ini untuk mencegah lampiran tidak dapat dihapus karena "parent" dari `post_attachment` sudah tidak ada pada basis data.


### Implementasi fungsi `index`

Ini adalah bagian terakhir dalam mengimplementasikan `PostController`, jangan lupa untuk peregangan sejenak dan minum air secukupnya. Sudah? Mari kita lanjutkan sesi belajar kita.

Sebelum itu, pada modul LKS kita diharuskan untuk memvalidasi parameter `page` dan `size`. Validasi ini penting dikarenakan kita akan mengimplementasikan Paginasi, supaya Post yang kita ambil tidak terlalu banyak dan dibatasi maksimal 10 Post per-sekali Request.

Aturan validasi yang didapat dari modul LKS adalah sebagai berikut:

| | |
|-|-|
| `page` | integer, minimum 0 and default 0 |
| `size` | integer, minimum 1 and default 10 |

Dengan data di atas, kita bisa tulis aturan Validasinya sebagai berikut:

```php
$data = $request->validate([
    'page' => ['nullable', 'integer', 'gte:0'],
    'size' => ['nullable', 'integer', 'gte:1']
]);
```

Karena kedua parameter tidak diperlukan maka kita atur ke `nullable`, dan karena kedua parameter berbentuk angka kita atur validasinya ke `integer`. Setelah itu untuk parameter `page` dan `size`, kita memiliki aturan minimum yaitu 0 dan 1, karena itu kita tuliskan aturan `gte:0` dan `gte:1`. Aturan `gte:<num>` memiliki arti "greater or equal than" atau "lebih besar dari sama dengan".

Setelah itu, kita tuliskan kode berikut setelah validasi:

```php
return response()->json([
    'page' => $data['page'] ?? 0,
    'size' => $data['size'] ?? 10,
    'posts' => Post::query()
        ->with([
            'user',
            'post_attachments',
        ])
        ->offset($data['page'] ?? 0)
        ->limit($data['size'] ?? 10)
        ->orderByDesc('created_at')
        ->get(),
]);
```

Kita menginstruksikan fungsi `index` untuk mengirimkan `response` berbentuk `json` dengan key sebagai berikut:
- `page` jika User mengirimkan instruksi buka "halaman <n>", jika tidak ada kirimkan 0;
- `size` jika Use rmengirimkan instruksi ambil data sebanyak "<n> Post", jika tidak ada kirimkan 10;
- `posts` ambil semua Post dengan:
  - data relasi ke:
    - `user` yang membuat Post
    - Lampiran-lampiran yang ada di `post_attachment` yang terkait dengan Post
  - buka halaman `$data['page']` atau default 0 (halaman pertama)
  - batasi data Post sebanyak `$data['size']` atau default 10
  - urutkan data Post dengan data posting terbaru

{{< alert icon="alert-02-stroke-rounded" cardColor="#0ea5e9" iconColor="#082f49" textColor="#0c4a6e" >}}
  Tugas: Pindahkan aturan validasi dari fungsi `index` pada `PostController` ke file `IndexPostRequest`
{{< /alert >}}

<details>
    <summary>Spoiler: Kode Lengkap <code>PostController</code></summary>

```php
<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\IndexPostRequest;
use App\Http\Requests\Api\v1\StorePostRequest;
use App\Models\Post;
use Illuminate\Support\Facades\DB;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(IndexPostRequest $request)
    {
        $data = $request->validated();

        return response()->json([
            'page' => $data['page'] ?? 0,
            'size' => $data['size'] ?? 10,
            'posts' => Post::query()
                ->with([
                    'user',
                    'post_attachments',
                ])
                ->offset($data['page'] ?? 0)
                ->limit($data['size'] ?? 10)
                ->orderByDesc('created_at')
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        $data = $request->validated();

        try {
            DB::beginTransaction();

            $post = Post::create([
                'user_id' => $request->user()->id,
                'caption' => $data['caption'],
            ]);

            /** @var \Illuminate\Http\UploadedFile $attachment */
            foreach ($data['attachments'] as $attachment) {
                $post->post_attachments()->create([
                    'storage_path' => $attachment->store(date('Y-m-d') . '/uploads'),
                ]);
            }
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                'message' => 'Post failed to be created: ' . $th->getMessage(),
            ], 500);
        }

        DB::commit();

        return response()->json([
            'message' => 'Post created successfully',
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        try {
            DB::beginTransaction();

            $post->post_attachments()->delete();

            $post->delete();
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                'message' => 'Post failed to be deleted: ' . $th->getMessage(),
            ], 500);
        }

        DB::commit();

        return response()->json([
            'message' => 'Post deleted successfully',
        ]);
    }
}
```
</details>

## Implementasi Rute `Post`

Kita sudah menuliskan seluruh fungsi yang dibutuhkan untuk lomba kali ini pada `PostController`, namun User belum dapat mengakses endpoint Post dikarenakan kita belum mendefinisikannya.

Untuk itu mari kita buka file `routes/api.php` dan tambahkan kode ini setelah Grup Rute `/auth`:

```php
Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::get('/posts', [\App\Http\Controllers\Api\v1\PostController::class, 'index']);
    Route::post('/posts', [\App\Http\Controllers\Api\v1\PostController::class, 'store']);
    Route::delete('/posts/{post}', [\App\Http\Controllers\Api\v1\PostController::class, 'destroy'])
        ->missing(function () {
            return response()->json([
                'message' => 'Post not found',
            ]);
        });
});
```

Perhatikan bahwa kita mendefinisikan Rute Grup `posts` ini mengimplementasikan Middleware `auth:sanctum`. Seperti yang sudah kita pelajari sebelumnya, kita mencegah pengguna untuk dapat mengakses endpoint ini tanpa memiliki kredensial. Jadi User harus login terlebih dulu sebelum mendapatkan / mengirim / menghapus data `Post`.

Perhatikan juga di masing-masing endpoint kita menuliskan `[\App\Http\Controllers\Api\v1\PostController::class, 'index']`, kode ini menginstruksikan endpoint tersebut menggunakan Controller `PostController` pada fungsi `index`. Begitu juga pada endpoint-endpoint lainnya.

Anda mungkin bertanya-tanya pada endpoint DELETE `/posts/{post}` apa yang dimaksud dari `{post}` tersebut? Baris kode ini disebut dengan Named Parameter, yang artinya Fasad Route menginstruksikan ke instance Request bahwa rute ini membutuhkan ID dari suatu `Post`, mengambilnya, dan mengirimkan datanya ke Controller sebagai Argumen.

Setelah itu, jika data dari suatu `Post` tidak ditemukan atau sudah dihapus, maka kita mengirimkan pesan "Post not found" dalam modifier `missing(Callback)`.


## Membuat `PostPolicy`

Pada saat ini, kita berhasil membuat kode yang dapat menghapus sebuah Postingan. Namun semua User dapat menghapus data tersebut. Kita tidak ingin hal itu terjadi dan kita hanya ingin User yang membuat Post tersebutlah yang boleh menghapus datanya. Karena itu kita harus membuat sebuah Policy.

Policy adalah sebuah file untuk mendefinisikan aturan-aturan tentang siapa saja yang bisa memanipulasi data dari sebuah Model. Untuk membuat `PostPolicy`, jalankan perintah ini di command line:

`php artisan make:policy PostPolicy --model=Post`

Flag `--model` menginstruksikan kepada Artisan bahwa untuk membuat `PostPolicy` ini, kita merujuk kepada sebuah Model bernama `Post`.

Setelah perintah berhasil dijalankan, file Policy akan disimpan ke dalam folder `app/Policies`. Buka `app/Policies/PostPolicy.php` dan Anda akan melihat kode berikut:

```php
<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Post $post): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Post $post): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Post $post): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Post $post): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Post $post): bool
    {
        //
    }
}
```

Dikarenakan seluruh fungsi mewajibkan isinya me-return value berupa `boolean`, kita harus memberikan semua fungsinya return type. Ubahlah dari masing-masing fungsi dengan return value:

| Fungsi | Return Value | Keterangan |
|-|-|-|
| `viewAny` | `true` | Kita ingin siapapun dapat melihat Postingan apapun |
| `view` | `true` | Kita ingin siapapun dapat melihat detail Postingan siapapun |
| `create` | `true` | Kita ingin siapapun dapat membuat Postingan |
| `update` | `$user->id == $post->user_id` | Kita ingin User yang membuat Post tersebutlah yang bisa mengubah Postingannya |
| `delete` | `$user->id == $post->user_id` | Kita ingin User yang membuat Post tersebutlah yang bisa menghapus Postingannya |
| `restore` | `false` | Kita tidak ingin siapapun dapat mengembalikan Posting yang sudah dihapus |
| `forceDelete` | `false` | Kita tidak ingin siapapun dapat menghapus Posting secara permanen |

Jika Anda sudah mengimplementasikan kode di atas, kurang lebih kodenya akan seperti ini (pastikan untuk coba dahulu sebelum komparasi kode):

<details>
    <summary>Spoiler: Kode <code>PostPolicy</code></summary>

```php
<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Post $post): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Post $post): bool
    {
        return $user->id == $post->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Post $post): bool
    {
        return $user->id == $post->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Post $post): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Post $post): bool
    {
        return false;
    }
}
```
</details>


### Mengimplementasikan `PostPolicy` ke `PostController`

Walaupun `PostPolicy` sudah kita implementasikan kode-kodenya, kita perlu menginstruksikan `PostController` untuk mengimplementasikan masing-masing fungsinya. Untuk itu, kita modifikasi sedikit `PostController` kita menjadi seperti ini:

```php
<?php

namespace App\Http\Controllers\Api\v1;

// ... Kode `use`

class PostController extends Controller
{
    public function __construct()
    {
        return $this->authorizeResource(Post::class);
    }

    // ... Sisa kode setelahnya di bawah
}
```

Implementasikan fungsi `__construct()` yang didalamnya mereturn `$this->authorizeResource(Post::class)`. Fungsi `__construct` adalah sebuah fungsi yang dieksekusi sebelum kode apapun yang ada pada suatu Kelas. `$this->authorizeResource(Model)` menginstruksikan Controller untuk menggunakan sebuah Policy dari suatu Model. Simpelnya, semua aturan-aturan akses yang sudah kita definisikan tadi dalam `PostPolicy` akan diimplementasikan ke masing-masing Fungsi yang ada di `PostController`.

Dilansir dari [dokumentasi resmi Laravel](https://laravel.com/docs/10.x/authorization), berikut adalah fungsi-fungsi Policy yang diimplementasikan ke fungsi-fungsi Controller

| Fungsi Controller | Fungsi Policy |
|-|-|
| index | viewAny |
| swow | view |
| create | create |
| store | create |
| edit | update |
| update | update |
| destroy | delete |


## Forbidden Exception Handling

Terakhir, sebelum kita menyelesaikan tutorial kali ini, kita harus mengimplementasikan Exception Handling jika ada data User yang menghapus data Posting orang lain. Sebelum kita mengimplementasikannya, error yang diberikan oleh Laravel kurang lebih seperti ini:

```json
{
    "message": "This action is unauthorized.",
    "exception": "Symfony\\Component\\HttpKernel\\Exception\\AccessDeniedHttpException",
    "file": "/project-dir/vendor/laravel/framework/src/Illuminate/Foundation/Exceptions/Handler.php",
    "line": 491,
    "trace": [
        {
            "file": "/project-dir/vendor/laravel/framework/src/Illuminate/Foundation/Exceptions/Handler.php",
            "line": 463,
            "function": "prepareException",
            "class": "Illuminate\\Foundation\\Exceptions\\Handler",
            "type": "->"
        },
        // ... sisa Stack Trace
    ]
}
```

Kita tidak ingin menunjukan bahwa kita memiliki error yang secara eksplisit ditunjukkan ke User, maka dari itu kita harus tambahkan kode berikut ke file `app/Exception/Handler.php`:

```php
<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;  // Copas ini
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $e)  // Copas seluruh fungsi ini
    {
        if ($e instanceof AuthorizationException) {
            return response()->json([
                'message' => 'Forbidden',
            ], 403);
        }

        return parent::render($request, $e);
    }
}
```

## Akhir Kata

Untuk saat ini, selamat Anda telah menyelesaikan Sub-modul kedua dari Modul Back End. Selanjutnya dapat jadi lebih mudah / lebih sulit. Jadi, semangat belajar, dan jangan lupa berdo'a untuk kesuksesan Anda!

[Kode lengkap](https://github.com/NikarashiHatsu/lks-modul-3-be/tree/post).
