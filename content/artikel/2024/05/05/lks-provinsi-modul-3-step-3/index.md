---
title: "Tutorial Mengerjakan Soal Modul 4 LKS Provinsi Web Technology - Following"
date: 2024-05-05T10:14:00+07:00
tags: ["article", "laravel", "web", "technology", "lks"]
draft: false
series: ["Modul 3 LKS Provinsi Web Technology"]
series_order: 4
---

Halo semua! Wah sepertinya gak bosen nih ngikutin tutorial ini, semoga kesehatan dan kesejahteraan selalu ada untuk kalian semua. Seperti biasa, ambil air, dan siapkan mental untuk melalui neraka ini (bercanda ges).

Kali ini kita akan membuat fitur Following, kurang lebih dimana User bakal saling ngefollow satu sama lain. Fitur gampang tapi logika di belakangnya yang ribet, jadi kita akan hadirkan satu Kelas baru dimana dia bakal nge-handle semua Request yang kita kirim. Let's get going!


## Membuat Model `Follow` dan Migrationnya

Seperti biasa, kita buat dulu Model dan Migrationnya. Udah sering buat kan? Klo udah sering, gak perlu code snippet kan ya (bercanda juga, lihat spoiler di bawah klo buntu).

<details>
    <summary>Spoiler: Kode membuat Model <code>Follow</code> dan Migrationnya</summary>

`php artisan make:model Follow -m`
</details>


### Ubah kode Migration

Di modul LKS kali ini, skema tabel `follows` kurang lebih terlihat seperti ini:

| | |
|-|-|
| id | BIGINT UNSIGNED PRIMARY_KEY auto_increment |
| follower_id | BIGINT UNSIGNED FOREIGN_KEY |
| following_id | BIGINT UNSIGNED FOREIGN_KEY |
| is_accepted | TINYINT DEFAULT 0 |

Buka file Migration yang sudah digenerate tadi di `database/migrations/<timestamp>_create_follows_table.php`, lalu pada fungsi `up()` tulis kode berikut:

```php
Schema::create('follows', function (Blueprint $table) {
    $table->id();
    $table->foreignId('follower_id')->constrained('users', 'id');
    $table->foreignId('following_id')->constrained('users', 'id');
    $table->boolean('is_accepted')->default(false);
    $table->timestamps();
});
```

Nah kali ini, kita punya dua kolom yang memiliki relasi ke tabel yang sama, yaitu kolom `follower_id` dan `following_id`. Kali ini juga kita gunakan kedua argumen dari modifier `constrained(string $table, string $column)` untuk mendeklarasikan nama tabel dan nama kolom secara eksplisit, karena jika mengikuti Laravel Naming Convention, modifier `constrained` akan secara otomatis mencari tabel `followers` dan `following`.

Setelah itu, seperti biasa kita jalankan `php artisan migrate` pada command line.


### Ubah kode Model `Follow`

Buka file `app/Models/Follow.php`, tambahkan atribut `$fillable` dahulu sesuai nama kolom-kolom yang dibuat pada Migration tadi.

<details>
    <summary>Spoiler: Kode atribut <code>`$fillable`</code> model <code>Follow</code></summary>

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    use HasFactory;

    protected $fillable = [
        'follower_id',
        'following_id',
        'is_accepted',
    ];
}
```
</details>

Jangan lupa juga, karena kolom `is_accepted` yang kita buat tadi, kita harus memasukkan kolom tersebut ke atribut `$casts` dengan cast value `boolean`. Masih ingat caranya? Jika lupa, silahkan kembali ke [Tutorial ke-1](./../../04/lks-provinsi-modul-3-step-1/index.md/#penyesuaian-model-user) bagian Penyesuaian Model User.

Jika sudah menambahkan atribut `$casts`, tambahkan fungsi Relasi untuk `follower` dan `following` seperti berikut:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Follow extends Model
{
    use HasFactory;

    public function follower(): BelongsTo
    {
        return $this->belongsTo(User::class, 'follower_id', 'id');
    }

    public function following(): BelongsTo
    {
        return $this->belongsTo(User::class, 'following_id', 'id');
    }

    protected $fillable = [
        'follower_id',
        'following_id',
        'is_accepted',
    ];
}
```

<details>
    <summary>Spoiler: Kode lengkap Model <code>Follow</code> (jangan buka sebelum mengimplementasikan atribut <code>$casts</code>)</summary>

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Follow extends Model
{
    use HasFactory;

    public function follower(): BelongsTo
    {
        return $this->belongsTo(User::class, 'follower_id', 'id');
    }

    public function following(): BelongsTo
    {
        return $this->belongsTo(User::class, 'following_id', 'id');
    }

    protected $fillable = [
        'follower_id',
        'following_id',
        'is_accepted',
    ];

    protected $casts = [
        'is_accepted' => 'boolean',
    ];
}
```
</details>

### Ubah kode Model `User`

Tidak hanya memodifikasi Model `Follow` yang kita buat tadi, kita juga harus menyesuaikan Model `User` untuk menerima relasi baru dari Model `Follow`. Tambahkan kode berikut setelah fungsi `post(): HasMany`:

```php
public function followers(): HasMany
{
    return $this->hasMany(Follow::class, 'following_id', 'id');
}

public function followings(): HasMany
{
    return $this->hasMany(Follow::class, 'follower_id', 'id');
}
```

Sama seperti modifier `constrained` yang kita buat tadi di Migration, relasi `hasMany` juga menerima 3 parameter yaitu: `Class Name`, `foreign_key`, `local_key`. Karena Model `Follow` yang kita buat tadi tidak mengikut standar Laravel Naming Convention, kita harus mengisi parameter ke-2 dan ke-3 yang masing-masing berguna untuk meng-override naming convention yang sudah ditentukan.

Untuk Relasi `followers` kita gunakan Foreign Key `following_id`, karena jika kita membiarkan ini kosong, Laravel akan secara otomatis menjari kolom `user_id` pada tabel `followers`. Karena nama tabel yang kita buat bukanlah `followers` dan tidak ada kolom `user_id` di dalamnya, makanya harus kita override. Begitu juga dengan Relasi `followings`.

Kalau Anda teliti, pasti Anda menyadari bahwa fungsi `followers` menggunakan Foreign Key `following_id` bukan `follower_id`. Kenapa demikian? Karena jika dilihat dari perspektif Anda (pengguna), `followers` adalah orang yang mengikuti Anda. Begitu juga dengan perspektif Anda (pengguna), `following` adalah orang-orang yang Anda ikuti.

Cukup membingungkan bukan? Jika masih bingung, lihat skema yang diberikan oleh modul LKS di bawah:

![](<Screenshot 2024-05-05 at 08.11.03.png>)


## Membuat Service `FollowService`

Yep, kali ini kita kedatangan file Kelas baru, yaitu Service. Service ini tidak kita buat menggunakan command line, namun Anda sendiri yang membuat Folder dan Filenya. Untuk membuat `FollowService`, terdapat 2 tahapan:
1. Buat folder `Services` di directory `app`;
2. Buat file `FollowService.php` di directory `app/Services`;

Setelah itu, buka file yang barusan dibuat dan tulis kodenya sebagai berikut:

```php
<?php

namespace App\Services;

class FollowService
{

}
```

Ingat bahwa `namespace App\Services` merepresentasikan dari directory yang digunakan. Pada saat file ini dibuat, file ini terdapat di directory `app/Services`. Karena itu kita harus menamakannya persis mengikuti penulisan PSR-4. Kita juga menuliskan `class FollowService` karena nama file kita bernama `FollowService.php`, jadi kita tuliskan nama filenya tanpa `.php` di akhiran.

Service `FollowService` ini akan kita gunakan untuk berbagai fungsi-fungsi yang seharusnya tidak ada di Controller.


## Mengikuti Seseorang

Pada bagian ini, sub-modul pertama yang ditentukan oleh modul LKS adalah untuk mengikuti seseorang. Pertama-tama seperti biasa kita membuat Controllernya terlebih dahulu. Perlu diketahui bahwa sub-modul ini memiliki endpoint `/api/v1/users/:username/follow`.


### Membuat Controller

Saat ini kita membuat Invokable Controller, seperti biasa kita mengeksekusi perintah ini pada command line:

`php artisan make:controller Api/v1/User/FollowController --invokable`

"Lho kenapa ada `/v1/User`-nya? Di tutorial sebelumnya langsung `v1/NamaController`"? Hal ini dikarenakan kita mengikuti standar Routing Convention. Dimana setiap Prefix merepresentasikan directory Controller itu sendiri, secara teknis hal ini memudahkan pengembang untuk mencari Controller terkait.

Setelah mengeksekusi perintah di atas, saatnya kita memulai perkodingan.


### Menambahkan Parameter `User $user` ke fungsi `__invoke(Request $request)`

Karena kita membutuhkan Model `User` sebagai data seseorang yang akan kita Follow, kita harus menambahkannya setelah parameter `Request $request`. Kode lengkapnya adalah seperti ini:

```php
<?php

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user)
    {
        //
    }
}
```


### Mencegah Anda mengikuti diri Anda sendiri

Bukan aplikasi yang sempurna jika Anda bisa mengikuti diri Anda sendiri. Akan sangat lucu jika seseorang User dapat mengikuti dirinya sendiri, jadi kita harus mencegah hal itu supaya tidak terjadi.

Pertama-tama kita harus mengecek apakah User yang sedang login adalah user yang sama:

```php
<?php

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user)
    {
        if ($request->user()->id == $following->id) {
            return response()->json([
                'message' => 'You are not allowed to follow yourself',
            ], 422);
        }
    }
}
```

Sekarang kita memiliki kode yang mencegah Anda mengikuti diri Anda sendiri. Namun kode ini sulit dibaca dan sulit dimengerti, karena itu `FollowService` akan datang untuk membantu.


#### Pindahkan Pengecekan Kode ke `FollowService`

Buka file `FollowService.php`, lalu tambahkan fungsi berikut di dalam Kelas `FollowService`:

```php
/**
 * Checks if a user is trying to follow themselves.
 *
 * @param  App\Models\User  $follower   The user attempting to follow.
 * @param  App\Models\User  $following  The user being followed.
 * @return bool Returns true if the user is attempting to follow themselves, otherwise false.
 */
public static function isFollowingSelf(User $follower, User $following): bool
{
    return $follower->id == $following->id;
}
```

Pada contoh kode di atas, bagian terpentingnya adalah kode yang dimulai dari `public static function` sampai dengan kurawal tutup `}`, kode di atas dan selebihnya dinamakan Dokumentasi atau PHPDocs. Dokumentasi membantu pengembang lainnya untuk memahami apa fungsi dari kode yang Anda tulis jikalau kode tersebut masih terlalu abstrak untuk dimengerti.

Pada fungsi `isFollowingSelf` ini kita memiliki 2 Parameter yaitu Model `User` sebagai `$follower` dan Model `User` sebagai `$following`. Betul sekali, Parameter sebuah fungsi dapat memiliki tipe data yang sama. Anda juga bebas memiliki berapa banyak Paremeter yang dibutuhkan, namun untuk sekarang, ikuti kode yang Saya tulis saat ini. Pastikan juga fungsi `isFollowingSelf` me-return `boolean`.


#### Ubah Pengecekan Kode di `FollowController`

Setelah memindahkan pengecekan antar dua Argumen, kita harus memodifikasi kode yang kita tulis di `FollowController` tadi, kurang lebih hasil jadinya adalah sebagai berikut:

```php
<?php

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\FollowService;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user)
    {
        if (FollowService::isFollowingSelf($request->user(), $user)) {
            return response()->json([
                'message' => 'You are not allowed to follow yourself',
            ], 422);
        }
    }
}
```

Nah, kode kita terlihat lebih mudah dibaca kan? Jika Anda masih tidak dapat membaca kode ini karena skill Bahasa Inggris yang kurang, Saya sarankan untuk belajar ekstra antara bahasa Pemrograman dan Bahasa Inggris :D


### Mencegah User untuk Mengikuti User yang Sudah Diikuti

Bayangkan jika ada User yang men-spam tombol Follow lebih dari satu kali, karena terdapat XHR Request antara browser dan server, ada kemungkinan bahwa state tombol Follow belum berubah ke tombol Unfollow. Karena itu kita harus mencegah hal ini terjadi.


#### Mengecek Apakah User sudah mengikuti User yang Sudah Diikut

Setelah kode pencegahan untuk mengikuti diri sendiri, tambahkan kode berikut:

```php
$userFollowed = Follow::query()
    ->where('follower_id', $request->user()->id)
    ->where('following_id', $user->id)
    ->first();

if (! empty($userFollowed)) {
    return response()->json([
        'message' => 'You are already followed',
        'status' => $userFollowed->is_accepted
            ? 'following'
            : 'requested',
    ], 422);
}
```

Pertama-tama kita mengecek ke basis data apakah kita sudah mengikuti User yang akan kita ikuti. Jika data tidak kosong, maka Controller akan mengembalikan `response` berupa `json` dengan pesan "You are already followed" dengan status apakah User yang diikuti tersebut sudah menerimanya atau belum. Jika sudah diterima, maka field status akan menampilkan `following`, sebaliknya akan menampilkan `requested`.


#### Pindahkan Pengecekan Sudah Mengikuti ke `FollowService`

Karena kode di atas terlalu sulit untuk dimengerti, lagi-lagi kita pindahkan ke Service `FollowService`. Berikut ini adalah kodenya, mohon tambahkan kodenya setelah fungsi `isFollowingSelf`:

```php
/**
 * Checks if a user is already following another user.
 *
 * @param  \App\Models\User  $follower   The user who is potentially following
 * @param  \App\Models\User  $following  The user who is potentially being followed.
 * @return \App\Models\Follow|null  Returns the Follow model instance if the user is already following, otherwise null.
 */
public static function isAlreadyFollowing(User $follower, User $following): ?Follow
{
    $userFollowed = Follow::query()
        ->where('follower_id', $follower->id)
        ->where('following_id', $following->id)
        ->first();

    return $userFollowed;
}
```

Kurang lebih kodenya sama, namun kita harus mengembalikan data Model `Follow` jika ditemukan. Perhatikan bahwa return type dari fungsi `isAlreadyFollowing` adalah `?Follow`. Tanda tanya sebelum Model `Follow` menandakan bahwa return type `Follow` adalah opsional, bisa jadi ada dan bisa jadi juga tidak ada sama sekali. Kode yang kita buat bisa jadi sudah ada datanya di basis data (akan mengembalikan Model `Follow`), dan bisa jadi juga belum (akan mengembalikan `null`).


#### Ubah Pengecekan Apakah Sudah Mengikuti di `FollowController`

Karena sudah dipindahkan, kita akan mengubah Controller kita menjadi seperti ini:

```php
<?php

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\FollowService;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user)
    {
        if (FollowService::isFollowingSelf($request->user(), $user)) {
            return response()->json([
                'message' => 'You are not allowed to follow yourself',
            ], 422);
        }

        if (! empty($userFollowed = FollowService::isAlreadyFollowing($request->user(), $user))) {
            return response()->json([
                'message' => 'You are already followed',
                'status' => $userFollowed->is_accepted
                    ? 'following'
                    : 'requested',
            ], 422);
        }
    }
}
```

Anda mungkin bertanya kenapa ada kode `$userFollowed = FollowService...`? Hal ini dikarenakan jika fungsi `isAlreadyFollowing` mengembalikan data Model `Follow`, kita dapat menggunakannya kembali sebagai `$userFollowed`. Lihat `response` `json` yang kita buat pada field `status`. Disitu kita menggunakan variabel `$userFollowed` untuk mengecek apakah permintaan Follow yang dikirim oleh pengguna sudah diterima atau belum.


### Mengikuti User

Akhirnya setelah 2 pengecekan yang intens, kita masuk ke bagian yang mudahnya, yaitu menyimpan data `Follow`. Seperti biasa kita menggunakan blok `try-catch` sebagai langkah pencegahan jika terjadi error. Tambahkan kode ini setelah kode terakhir di `FollowController`:

```php
try {
    $follow = Follow::create([
        'follower_id' => $request->user()->id,
        'following_id' => $user->id,
    ]);;
} catch (\Throwable $th) {
    return response()->json([
        'message' => 'Following user failed: ' . $th->getMessage(),
    ], 500);
}

return response()->json([
    'message' => 'Follow success',
    'status' => $follow->is_accepted
        ? 'following'
        : 'requested',
], 201);
```

Seperti biasa, kita akan mengembalikan `response` berupa `json` pada saat error dengan pesan "Following user failed: Error" dan mengembalikan `response` yang sama dengan pesan "Follow success" jika berhasil.


#### Memindahkan Kode "Ikuti" Seseorang ke `FollowService`

Sudah bisa dilihat polanya sekarang? Saat ini kita hanya:
- Menulis kode pada `FollowController`
- Memindahkan kode yang sulit dibaca ke `FollowService` dengan nama fungsi yang mudah dimengerti
- Mengubah kode lama di `FollowController` supaya menggunakan fungsi yang ada pada `FollowService`

Kita akan mengimplementasikan fungsi `follow` juga sekarang. Buka file `FollowService` lalu tambahkan kode ini:

```php
/**
 * Creates a follow relationship between two users.
 *
 * @param  \App\Models\User  $follower   The user who is following.
 * @param  \App\Models\User  $following  The user who is being followed.
 * @return \App\Models\Follow  Returns the Follow model instance representing the new follow relationship.
 */
public static function follow(User $follower, User $following): Follow
{
    return Follow::create([
        'follower_id' => $follower->id,
        'following_id' => $following->id,
    ]);
}
```


#### Ubah Kode Penyimpanan data Follow di `FollowController`

Ubah kode pada blok `try` Anda ke:

```php
$follow = FollowService::follow($request->user(), $user);
```

Yap, semudah itu. Untuk saat ini, kita tidak perlu menyentuk `FollowController` lagi.

<details>
    <summary>Kode lengkap <code>FollowController</code></summary>

```php
<?php

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\FollowService;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user)
    {
        if (FollowService::isFollowingSelf($request->user(), $user)) {
            return response()->json([
                'message' => 'You are not allowed to follow yourself',
            ], 422);
        }

        if (! empty($userFollowed = FollowService::isAlreadyFollowing($request->user(), $user))) {
            return response()->json([
                'message' => 'You are already followed',
                'status' => $userFollowed->is_accepted
                    ? 'following'
                    : 'requested',
            ], 422);
        }

        try {
            $follow = FollowService::follow($request->user(), $user);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Following user failed: ' . $th->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => 'Follow success',
            'status' => $follow->is_accepted
                ? 'following'
                : 'requested',
        ], 201);
    }
}
```
</details>


### Mendaftarkan Rute `Follow`

Buka file `routes/api.php` Anda, lalu pada grup Middleware `auth:sanctum`, setelah kode Rute DELETE `/posts/{post}` tambahkan kode berikut:

```php
Route::group(['prefix' => 'user'], function () {
    Route::post('/{user:username}/follow', \App\Http\Controllers\Api\v1\User\FollowController::class)
        ->missing(function () {
            return response()->json([
                'message' => 'User not found',
            ]);
        });
```

Kita akan menggunakan prefix `user` sehingga URL endpoint yang akan diakses memiliki URL seperti `/api/v1/user`. Selanjutnya kita daftarkan Rute `Follow` yang mengarah ke `FollowController`.

Sebelumnya Anda sudah familiar dengan Named Parameter seperti `/posts/{post}` di tutorial sebelumnya, namun kenapa kita menggunakan `/{user:username}` kali ini? Hal ini dikarenakan kita akan menggunakan kolom `username` dari model `User` sebagai parameternya. Jadi alih-alih kita mengirimkan User ID nanti pada saat kita mengembangkan modul Front-Endnya, kita akan mengirimkan `username`-nya saja.

Kita juga gunakan modifier `missing` untuk mengkustomisasi pesan yang kita kirimkan ke User saat User dengan `username` yang dicari tidak ditemukan pada basis data.


## Berhenti Mengikuti Seseorang

Berhenti Mengikuti biasa kita kenal sebagai "Unfollow", jika Anda belum pernah mendengar istilah ini, berarti Anda terlalu baik sampai belum pernah unfollow orang di Instagram 😜.


### Membuat Invokable Controller `UnfollowController`

Kita eksekusi perintah ini di command line:

`php artisan make:controller Api/v1/User/UnfollowController --invokable`

Setelah itu, kita buka Controllernya.


#### Mengecek Apakah User Sudah Mengikut User yang ingin Diunfollow

Kita harus mengecek apakah User yang ingin kita unfollow ada atau tidak pada basis data. Trivia saja, untuk menghapus data yang bahkan tidak ada pada basis data sebenarnya tidak akan menyebabkan error, namun pada saat dieksekusi, DB Engine tidak akan me-return apapun. Jadi ada baiknya kita memberikan Response custom berupa pesan bahwa "Anda belum mengikuti User tersebut".


### Menambahkan Parameter `User $user` ke fungsi `__invoke(Request $request)`

Sama seperti `FollowController`, kita juga harus menambahkan Parameter `User $user` ke fungsi `__invoke()`. Hal ini kita gunakan untuk mengambil data `User` yang dikirimkan sebagai parameter di Rute API.

```php
<?php

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UnfollowController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user)
    {
        //
    }
}
```


### Mengecek Apakah User Sudah Mengikuti

Untuk mengecek apakah User yang sedang login sudah mengikuti User yang ingin di-unfollow, tambahkan kode berikut di fungsi `__invoke` pada `UnfollowController` Anda:

```php
<?php

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\FollowService;
use Illuminate\Http\Request;

class UnfollowController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user)
    {
        if (empty(FollowService::isAlreadyFollowing($request->user(), $user))) {
            return response()->json([
                'message' => 'You are not following the user',
            ], 422);
        }
    }
}
```

...Lho, kita tidak memindahkan kode apapun ke `FollowService`? Mengapa demikian? Hal ini dikarenakan fungsi `isAlreadyFollowing` sudah didefinisikan dan dapat digunakan dimanapun. Konsep ini dinamakan Code Reusability, yaitu konsep penggunaan ulang kode yang sekiranya berulang-ulang dan redundan dapat terjadi di file yang berbeda-beda. Code Reusability ini membantu Anda untuk mempersingkat kode dan mencegah terjadinya ketidak-konsistenan kode di antara file.


### Berhenti Mengikuti

Nah karena pengecekan sebelumnya sudah bisa langsung digunakan, maka kita tinggal buat saja fungsi Unfollownya. Seperti biasa kita akan gunakan blok `try-catch`:

```php
<?php

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\FollowService;
use Illuminate\Http\Request;

class UnfollowController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user)
    {
        if (empty(FollowService::isAlreadyFollowing($request->user(), $user))) {
            return response()->json([
                'message' => 'You are not following the user',
            ], 422);
        }

        try {
            Follow::query()
                ->where('follower_id', $request->user()->id)
                ->where('following_id', $user->id)
                ->delete();
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Unfollowing user failed: ' . $th->getMessage(),
            ], 500);
        }

        return response()->noContent();
    }
}
```

Perhatikan bahwa pada saat data berhasil dihapus, kita mengembalikan `response()->noContent()` alih-alih `response()->json()` seperti biasa. Kenapa? Karena kita sudah tidak memiliki data apapun yang dapat dikembalikan ke pengguna, mudahnya karena data tersebut sudah dihapus.


#### Memindahkan Fungsi Unfollow ke `FollowService`

Yak, kita pindahkan lagi kode Unfollow kita ke `FollowService`, tambahkan kode berikut ke file `FollowService`:

```php
/**
 * Removes a follow relationship between two users.
 *
 * @param  \App\Models\User  $follower   The user who is currently following.
 * @param  \App\Models\User  $following  The user who is currently being followed.
 * @return bool Returns true if the follow relationship is successfully removed, otherwise false.
 */
public static function unfollow(User $follower, User $following): bool
{
    return Follow::query()
        ->where('follower_id', $follower->id)
        ->where('following_id', $following->id)
        ->delete();
}
```

Fungsi `delete` pada Model Query akan mengembalikan `boolean`, jadi hasilnya pasti antara `true` jika data berhasil dihapus, atau `false` jika gagal.


#### Mengubah Kode Unfollow di `UnfollowController`

Pada blok `try`, ubah kodenya menjadi seperti ini:

```php
FollowService::unfollow($request->user(), $user);
```

Simpel bukan?

<details>
    <summary>Kode lengkap <code>UnfollowController</code></summary>

```php
<?php

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\FollowService;
use Illuminate\Http\Request;

class UnfollowController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user)
    {
        if (empty(FollowService::isAlreadyFollowing($request->user(), $user))) {
            return response()->json([
                'message' => 'You are not following the user',
            ], 422);
        }

        try {
            FollowService::unfollow($request->user(), $user);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Unfollowing user failed: ' . $th->getMessage(),
            ], 500);
        }

        return response()->noContent();
    }
}
```
</details>


### Mendaftarkan Rute `Unfollow`

Lagi-lagi kita membuka file `routes/api.php` untuk menambahkan Rute, memang membosankan tapi ini adalah hal yang selalu terjadi di bidang pengembangan web, jadi mohon bersabar dan ikuti saja alurnya. Semoga suatu saat Anda menjadi web developer yang jago dan bermartabak (eh bermartabat).

Tambahkan kode ini setelah Rute `/{user:username}/follow`

```php
Route::delete('/{user:username}/unfollow', \App\Http\Controllers\Api\v1\User\UnfollowController::class)
    ->missing(function () {
        return response()->json([
            'message' => 'User not found',
        ]);
    });
```



<details>
    <summary>Kode lengkap <code>routes/api.php</code> untuk saat ini</summary>

```php
<?php

use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {
    Route::group(['prefix' => 'auth'], function () {
        Route::post('/register', \App\Http\Controllers\Api\v1\Auth\RegisterController::class);
        Route::post('/login', \App\Http\Controllers\Api\v1\Auth\LoginController::class);
        Route::post('/logout', \App\Http\Controllers\Api\v1\Auth\LogoutController::class)
            ->middleware('auth:sanctum');
    });

    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::get('/posts', [\App\Http\Controllers\Api\v1\PostController::class, 'index']);
        Route::post('/posts', [\App\Http\Controllers\Api\v1\PostController::class, 'store']);
        Route::delete('/posts/{post}', [\App\Http\Controllers\Api\v1\PostController::class, 'destroy'])
            ->missing(function () {
                return response()->json([
                    'message' => 'Post not found',
                ]);
            });

        Route::group(['prefix' => 'user'], function () {
            Route::post('/{user:username}/follow', \App\Http\Controllers\Api\v1\User\FollowController::class)
                ->missing(function () {
                    return response()->json([
                        'message' => 'User not found',
                    ]);
                });
            Route::delete('/{user:username}/unfollow', \App\Http\Controllers\Api\v1\User\UnfollowController::class)
                ->missing(function () {
                    return response()->json([
                        'message' => 'User not found',
                    ]);
                });
        });
    });
});
```
</details>


## Mengambil Data User yang Diikuti

Ini adalah tahap terakhir di tutorial kali ini, pengingat rutin untuk minum air dan jangan patah semangat!


### Membuat Invokable Controller `FollowingController`

Nah, pada titik ini, jangan lupa bahwa `FollowController` dan `FollowingController` merupakan dua Controller yang berbeda. Saat ini kita hanya fokus di `FollowingController`. Buatlah `FollowingController` menggunakan perintah:

`php artisan make:controller Api/v1/FollowingController`

Karena Controller ini akan dapat diakses secara umum, kita tidak butuh parameter apapun seperti Rute `follow` atau `unfollow`.


#### Ambil Data User (`Follow`) yang Diikuti

Sekarang, kita harus mengambil data siapa saja pengguna yang sudah diikuti berdasarkan pengguna yang sedang login, untuk itu kita tulis kode berikut:

```php
<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FollowingController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        /** @var \Illuminate\Database\Eloquent\Collection */
        $followings = $request->user()->followings;

        return response()->json([
            'following' => $followings,
        ]);
    }
}
```

Saat ini kode kita hanya mengembalikan data mentah dari tabel `Follow`, jika digambarkan, Responsenya adalah seperti berikut:

```json
{
    "following": [
        {
            "id": 6,
            "follower_id": 1,
            "following_id": 2,
            "is_accepted": false,
            "created_at": "2024-05-04T23:36:37.000000Z",
            "updated_at": "2024-05-04T23:36:37.000000Z"
        }
    ]
}
```

Tidak terlalu cantik bukan? Bahkan kita juga tidak mengetahui data apa yang dimaksud. Karena itu kode tadi akan kita modifikasi lebih lanjut menggunakan metode Eloquent Mapping.


#### Eloquent Mapping

Saya akan mengubah kode di atas menjadi kode berikut, akan sulit menjelaskannya satu-per-satu jadi akan Saya jelaskan sekaligus:

```php
<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FollowingController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        /** @var \Illuminate\Database\Eloquent\Collection */
        $followings = $request->user()->followings;

        return response()->json([
            'following' => $followings
                ->map(function (Follow $follow) {
                    $userData = $follow->following;

                    return $userData;
                })
                ->values();,
        ]);
    }
}
```

Pertama-tama, kode `$followings = $request->user()->followings` akan menghasilkan sebuah Collection yang dihasilkan oleh Eloquent, karena itu dinamakan `\Illuminate\Database\Eloquent\Collection` yang merupakan turunan dari `\Illuminate\Support\Collection`. Laravel sudah memperhatikan kemudahan manipulasi data sebelum penyajian. Salah satu fungsi yang sangat berguna untuk manipulasi data ini adalah fungsi `map()`.

Fungsi `map()` adalah suatu fungsi yang menerima sebuah koleksi `array`, yang masing-masing datanya akan di-loop lalu dapat kita manipulasi. Fungsi `map()` menerima Callback dengan Argumen Model yang berkaitan. Karena `$followings` adalah koleksi dari sekumpulan Model `Follow`, maka kita gunakan `Follow $follow` sebagai Argumennya.

Dalam blok `map()`, kita buat satu variabel baru bernama `$userData` yang berisi data Model `User` yang diambil dari relasi `following`. Jika Anda lupa mengenai hal ini, silahkan buka file `app/Models/Follow` dan cek apakah fungsi `following` tersedia.

Jika pada titik ini kode Anda tidak error, maka Anda dapat melanjutkan ke tahap selanjutnya. Response yang dihasilkan dari kode ini kurang lebih seperti ini:

```json
{
    "following": [
        {
            "id": 2,
            "full_name": "Hatsu Shiroyuki",
            "username": "hatsushiroyuki",
            "bio": "An Impostor",
            "is_private": false,
            "created_at": "2024-05-04T19:46:40.000000Z",
            "updated_at": "2024-05-04T19:46:40.000000Z"
        }
    ]
}
```


#### Mengecek Apakah User yang diikuti Mengirimkan Permintaan Follow

Pada blok kode `map()` yang kita tulis tadi, kita harus tambahkan kode pengecekan apakah User yang kita ikuti sudah mengirimkan Permintaan Follow atau belum. Studi kasus nyata yang sering kita jumpai adalah fitur "Follow Back" atau "Follback" yang ada di Instagram. Kurang lebih seperti itu fiturnya.

Ubah kode `FollowingController` menjadi seperti ini:

```php
<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FollowingController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        /** @var \Illuminate\Database\Eloquent\Collection */
        $followings = $request->user()->followings;

        return response()->json([
            'following' => $followings
                ->map(function (Follow $follow) use ($request) {
                    $userData = $follow->following;

                    $userData['is_requested'] = Follow::query()
                        ->where('follower_id', $request->user()->id)
                        ->where('following_id', $follow->following_id)
                        ->exists();

                    return $userData;
                })
                ->values();,
        ]);
    }
}
```

Perhatikan bahwa pada Callback `map()` kita tambahkan `use($request)` setelah `function(Follow $follow)`. Kode ini dibutuhkan supaya kita dapat menggunakan instance `$request` di dalam blok `map()`.

Untuk kode pengecekannya sendiri, simpelnya kita mengecek apakah data User yang kita follow sudah mengirimkan request "Follback". Jika sudah ada, maka valuenya adalah `true`, sebaliknya `false`.

Hasil kodenya adalah sebagai berikut:

```json
{
    "following": [
        {
            "id": 2,
            "full_name": "Hatsu Shiroyuki",
            "username": "hatsushiroyuki",
            "bio": "An Impostor",
            "is_private": false,
            "created_at": "2024-05-04T19:46:40.000000Z",
            "updated_at": "2024-05-04T19:46:40.000000Z",
            "is_requested": true
        }
    ]
}
```

Response di atas sudah sesuai dengan apa yang diharapkan dari modul LKS, namun kita perlu memperbaiki kodenya supaya jadi lebih rapi.


#### Memindahkan Logika Pengambilan Data ke `FollowService`

Karena kode yang kita buat di atas terlalu berantakan dan tidak bisa dibaca dengan baik, kita akan coba untuk memindahkan kode pengambilan datanya ke fungsi tersendiri di `FollowService`.

Pertama-tama buat fungsi baru bernama `following()` di bawah fungsi `unfollow()` pada file `FollowService`, yang memiliki 1 Parameter yaitu `User $user` dan memiliki return type `\Illuminate\Support\Collection`. Kurang lebih kodenya seperti ini:

```php
/**
 * Retrieves the users that the given user is following.
 *
 * @param  \App\Models\User  $follower  The user whose followings are to be retrieved.
 * @return \Illuminate\Support\Collection Returns a collection of users that the given user is following.
 */
public static function following(User $user): Collection
{
    /** @var \Illuminate\Database\Eloquent\Collection */
    $followings = $user->followings;

    return $followings
        ->map(function (Follow $follow) use ($user) {
            $userData = $follow->following;

            $userData['is_requested'] = Follow::query()
                ->where('follower_id', $user->id)
                ->where('following_id', $follow->following_id)
                ->exists();

            return $userData;
        })
        ->values();
}
```

Karena kodenya sudah dipindah, kita bisa memodifikasi kode pada `FollowingController` kita menjadi seperti ini:

```php
<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Services\FollowService;
use Illuminate\Http\Request;

class FollowingController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return response()->json([
            'following' => FollowService::following($request->user()),
        ]);
    }
}
```

Jadi lebih simpel bukan?


#### Memindahkan Logika Pengecekan Sudah Follow Back

Logika yang kita tulis di atas sudah hampir sempurna, namun tetap saja baris kode `$userData['is_requested']` sangat tidak rapih. Kita butuh memindahkannya ke fungsi lain. Untuk kasus ini, buat fungsi baru bernama `isRequested` yang menerima 2 Argumen yaitu `User $follower`, dan `User $following`.

Tambahan kodenya kurang lebih seperti ini:

```php
/**
 * Checks if a follow relationship is requested between two users.
 *
 * @param  \App\Models\User  $follower   The user who initiated the follow request.
 * @param  \App\Models\User  $following  The user who is being followed.
 * @return bool Returns true if a follow relationship is requested between the two users, otherwise false.
 */
public static function isRequested(User $follower, User $following): bool
{
    return Follow::query()
        ->where('follower_id', $follower->id)
        ->where('following_id', $following->id)
        ->exists();
}
```

Sehingga pada kode blok `map()` yang ada pada fungsi `following()` bisa kita ubah menjadi:

```php
/**
 * Retrieves the users that the given user is following.
 *
 * @param  \App\Models\User  $follower  The user whose followings are to be retrieved.
 * @return \Illuminate\Support\Collection Returns a collection of users that the given user is following.
 */
public static function following(User $user): Collection
{
    /** @var \Illuminate\Database\Eloquent\Collection */
    $followings = $user->followings;

    return $followings
        ->map(function (Follow $follow) use ($user) {
            $userData = $follow->following;

            // To determine if the logged-in user is already being followed
            // by $follow->following (the user being followed), we need to
            // reverse the comparison, checking if $follow->following is
            // following the logged-in user ($user).
            $userData['is_requested'] = self::isRequested($follow->following, $user);

            return $userData;
        })
        ->values();
}
```

Nah, lebih simpel bukan? Silahkan komparasi kode final antara `FollowingController` dan `FollowService` untuk saat ini:

<details>
    <summary>Spoiler: Kode lengkap <code>FollowingController</code></summary>

```php
<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Services\FollowService;
use Illuminate\Http\Request;

class FollowingController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return response()->json([
            'following' => FollowService::following($request->user()),
        ]);
    }
}
```
</details>

<details>
    <summary>Spoiler: Kode lengkap <code>FollowService</code></summary>

```php
<?php

namespace App\Services;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Support\Collection;

class FollowService
{
    /**
     * Checks if a user is trying to follow themselves.
     *
     * @param  App\Models\User  $follower   The user attempting to follow.
     * @param  App\Models\User  $following  The user being followed.
     * @return bool Returns true if the user is attempting to follow themselves, otherwise false.
     */
    public static function isFollowingSelf(User $follower, User $following): bool
    {
        return $follower->id == $following->id;
    }

    /**
     * Checks if a user is already following another user.
     *
     * @param  \App\Models\User  $follower   The user who is potentially following
     * @param  \App\Models\User  $following  The user who is potentially being followed.
     * @return \App\Models\Follow|null  Returns the Follow model instance if the user is already following, otherwise null.
     */
    public static function isAlreadyFollowing(User $follower, User $following): ?Follow
    {
        $userFollowed = Follow::query()
            ->where('follower_id', $follower->id)
            ->where('following_id', $following->id)
            ->first();

        return $userFollowed;
    }

    /**
     * Creates a follow relationship between two users.
     *
     * @param  \App\Models\User  $follower   The user who is following.
     * @param  \App\Models\User  $following  The user who is being followed.
     * @return \App\Models\Follow  Returns the Follow model instance representing the new follow relationship.
     */
    public static function follow(User $follower, User $following): Follow
    {
        return Follow::create([
            'follower_id' => $follower->id,
            'following_id' => $following->id,
        ]);
    }

    /**
     * Removes a follow relationship between two users.
     *
     * @param  \App\Models\User  $follower   The user who is currently following.
     * @param  \App\Models\User  $following  The user who is currently being followed.
     * @return bool Returns true if the follow relationship is successfully removed, otherwise false.
     */
    public static function unfollow(User $follower, User $following): bool
    {
        return Follow::query()
            ->where('follower_id', $follower->id)
            ->where('following_id', $following->id)
            ->delete();
    }

    /**
     * Retrieves the users that the given user is following.
     *
     * @param  \App\Models\User  $follower  The user whose followings are to be retrieved.
     * @return \Illuminate\Support\Collection Returns a collection of users that the given user is following.
     */
    public static function following(User $user): Collection
    {
        /** @var \Illuminate\Database\Eloquent\Collection */
        $followings = $user->followings;

        return $followings
            ->map(function (Follow $follow) use ($user) {
                $userData = $follow->following;

                // To determine if the logged-in user is already being followed
                // by $follow->following (the user being followed), we need to
                // reverse the comparison, checking if $follow->following is
                // following the logged-in user ($user).
                $userData['is_requested'] = self::isRequested($follow->following, $user);

                return $userData;
            })
            ->values();
    }

    /**
     * Checks if a follow relationship is requested between two users.
     *
     * @param  \App\Models\User  $follower   The user who initiated the follow request.
     * @param  \App\Models\User  $following  The user who is being followed.
     * @return bool Returns true if a follow relationship is requested between the two users, otherwise false.
     */
    public static function isRequested(User $follower, User $following): bool
    {
        return Follow::query()
            ->where('follower_id', $follower->id)
            ->where('following_id', $following->id)
            ->exists();
    }
}
```
</details>


### Mendaftarkan Rute `Following`

Untuk mendaftarkan Rute `Following` kali ini, cukup mudah. Anda hanya butuh menambahkan kode berikut di Rute Grup Middleware `auth:sanctum` saja:

`Route::get('/following', \App\Http\Controllers\Api\v1\FollowingController::class);`

Sehingga kode lengkap `routes/api.php` kurang lebih seperti ini:


<details>
    <summary>Spoiler: Kode lengkap <code>routes/api.php</code></summary>

```php
<?php

use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {
    Route::group(['prefix' => 'auth'], function () {
        Route::post('/register', \App\Http\Controllers\Api\v1\Auth\RegisterController::class);
        Route::post('/login', \App\Http\Controllers\Api\v1\Auth\LoginController::class);
        Route::post('/logout', \App\Http\Controllers\Api\v1\Auth\LogoutController::class)
            ->middleware('auth:sanctum');
    });

    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::get('/posts', [\App\Http\Controllers\Api\v1\PostController::class, 'index']);
        Route::post('/posts', [\App\Http\Controllers\Api\v1\PostController::class, 'store']);
        Route::delete('/posts/{post}', [\App\Http\Controllers\Api\v1\PostController::class, 'destroy'])
            ->missing(function () {
                return response()->json([
                    'message' => 'Post not found',
                ]);
            });

        Route::group(['prefix' => 'user'], function () {
            Route::post('/{user:username}/follow', \App\Http\Controllers\Api\v1\User\FollowController::class)
                ->missing(function () {
                    return response()->json([
                        'message' => 'User not found',
                    ]);
                });
            Route::delete('/{user:username}/unfollow', \App\Http\Controllers\Api\v1\User\UnfollowController::class)
                ->missing(function () {
                    return response()->json([
                        'message' => 'User not found',
                    ]);
                });
        });

        Route::get('/following', \App\Http\Controllers\Api\v1\FollowingController::class);
    });
});
```
</details>


## Akhir Kata

Kali ini artikel yang benar-benar panjang ya? Ingat, perjalanan yang ditempuh dengan usaha yang sungguh-sungguh akan menghasilkan sebuah reward yang sungguh-sungguh juga. Tetap gigih, berdo'a untuk kesuksesan Anda, serta jaga kesehatan karena perjalanan ini masih panjang.

See you on the flip side!

[Kode lengkap](https://github.com/NikarashiHatsu/lks-modul-3-be/tree/following).