---
title: "Tutorial Mengerjakan Soal Modul 3 LKS Provinsi Web Technology - User"
date: 2024-05-06T11:03:00+07:00
tags: ["article", "laravel", "web", "technology", "lks"]
draft: false
series: ["Modul 3 LKS Provinsi Web Technology"]
series_order: 6
---

Hai hai, kita sekarang ada di sub-modul terakhir nih, semoga masih semangat ya. Walaupun ini sub-modul terakhir, masih ada lagi modul Front-End, jadi jangan senang dulu wkwkwk. Perjalanan yang ditempuh baru setengah jalan, so I wish your luck.

Di artikel kali ini kita akan membuat modul untuk mendapatkan data User yang belum memfollow User yang login, serta mendapatkan detail dari salah satu User. Kali ini artikelnya gak panjang-panjang kok, lumayan mudah juga. Jadi silahkan baca tutorialnya dengan santai, siapkan air minum, dan let's get coding.


## Mendapatkan User yang belum Follow

Di soal modul LKS Web Tech 2024 kali ini, ketentuan dari endpoint `/api/v1/users` adalah untuk mengambil data seluruh User yang belum diikuti oleh User yang sedang login, User yang login juga harus di-exclude dari daftar.


### Buat Invokable Controller `Api/v1/UserController`

Buat Controller tersebut menggunakan perintah ini pada command line:

`php artisan make:controller Api/v1/UserController --invokable`


#### Mengambil data User dari Request

Pada fungsi `__invoke` yang ada pada file `app/Http/Controllers/Api/v1/UserController`, tambahkan kode berikut untuk mengambil data User yang sedang login.

```php
$loggedInUser = $request->user();
```


#### Mengambil User ID yang belum Diikuti

Kita akan menggunakan Reversed Approach untuk mendapatkan data User yang belum kita follow, maksud dari Reversed Approach adalah kita mengambil seluruh ID User yang sudah User itu follow sebagai array, lalu kita tambahkan ID User yang sedang login. Dengan adanya kumpulan dari User ID ini, kita ambil data User dari tabel `users` yang ID-nya bukan kumpulan dari User ID tersebut.

Kedengarannya sulit, namun jika diimplementasikan, kodenya cukup mudah:

```php
// Get the User IDs who followed the Logged In User
$usersFollowed = $loggedInUser
    ->followings
    ->pluck('following_id');

// Add the Logged In User ID to the array
$usersFollowed[] = $loggedInUser->id;
```

Pertama, karena variabel `$loggedInUser` adalah sebuah instance dari `App\Models\User` yang memiliki relasi `followings`, kita bisa mendapatkan User-user yang sudah `$loggedInUser` ikuti. Setelah itu, kita panggil atribut `followings`-nya, dan karena setiap pemanggilan atribut relasi akan me-return instance `\Illuminate\Database\Eloquent\Collection`, kita dapat memanipulasi data `followings`-nya sebelum disajikan atau digunakan kembali.

Fungsi `pluck()` adalah sebuah fungsi `Collection` yang berguna untuk mengambil data dari sebuah properti yang disediakan. Contohnya adalah sebagai berikut:

```json
[
    {
        "id": 1,
        "full_name": "Aghits Nidallah",
        "username": "irlnidallah",
        "bio": "Seorang full-stack developer, mahasiswa, dan {manusia,robot} yang hidup dengan menikmati kopi ☕️.",
        "is_private": false,
        "created_at": "2024-05-03T21:36:32.000000Z",
        "updated_at": "2024-05-03T21:36:32.000000Z"
    },
    {
        "id": 3,
        "full_name": "Nikarashi Hatsu",
        "username": "nikarashihatsu",
        "bio": "Hatsu Shiroyuki Alter",
        "is_private": false,
        "created_at": "2024-05-05T14:57:53.000000Z",
        "updated_at": "2024-05-05T14:57:53.000000Z"
    }
]
```

Response JSON di atas adalah sebuah contoh Response yang diberikan pada saat kita mengambil data dari tabel `users`. Anggaplah kita ingin mengambil `id`-nya saja, kita bisa menggunakan fungsi `pluck('username')`, sehingga datanya akan menjadi seperti berikut:

```json
[
    "irlnidallah",
    "nikarashihatsu"
]
```

Sangat berguna bukan? Walaupun manipulasi Collection adalah sesuatu teknik yang membutuhkan pengalaman, mempelajarinya bukanlah suatu hal yang merugikan. Seiring Anda menggunakan Eloquent, Anda akan senantiasa memanipulasi Collection di suatu waktu.

Kembali ke konteks awal, karena hasil dari fungsi `pluck()` adalah berbentuk array, kita akan menambahkan User ID yang sedang login pada saat itu. Anggaplah skenarionya `following_id` yang sudah di-`pluck` seperti ini:

```php
// Get the User IDs who followed the Logged In User
$usersFollowed = $loggedInUser
    ->followings
    ->pluck('following_id');

// result: $usersFollowed = [2]

// Add the Logged In User ID to the array
$usersFollowed[] = $loggedInUser->id;

// Assuming the Logged In User ID is 1, then
// result: $usersFollowed = [2, 1]
```

Kita bisa menambahkan sebuah value ke dalam array yang sudah ada dalam sebuah variabel dengan menggunakan sintaks `$variable[] = mixed`.


#### Mengambil data User yang belum Diikut

Setelah kita mendapatkan seluruh User ID yang belum diikuti oleh User yang login, saatnya kita menyajikan datanya kepada User. Untuk hal ini, simpel saja, kita gunakan kode berikut:

```php
return response()->json([
    // Get the User who haven't folowwed the Logged In User
    'users' => User::query()
        ->whereNotIn('id', $usersFollowed)
        ->get(),
]);
```

Fungsi `whereNotIn` merepresentasikan klausa SQL `WHERE NOT IN` yang menerima sebuah array. Jika diterjemahkan ke dalam bahasa manusia, arti dari kode di atas kurang lebih "Ambil data User dengan ID YANG BUKAN DARI ID (1, 2, 3, ...n)". Setelah itu, kita sajikan ke User.

<details>
    <summary>Spoiler: Kode lengkap <code>UserController</code></summary>

```php
<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $loggedInUser = $request->user();

        // Get the User IDs who followed the Logged In User
        $usersFollowed = $loggedInUser
            ->followings
            ->pluck('following_id');

        // Add the Logged In User ID to the array
        $usersFollowed[] = $loggedInUser->id;

        return response()->json([
            // Get the User who haven't folowwed the Logged In User
            'users' => User::query()
                ->whereNotIn('id', $usersFollowed)
                ->get(),
        ]);
    }
}
```
</details>


### Mendaftarkan Rute User Controller ke `routes/api.php`

Tambahkan kode ini di bawah Rute `following` yang ada di file `routes/api.php`:

```php
Route::get('/users', \App\Http\Controllers\Api\v1\UserController::class);
```

<details>
    <summary>Spoiler: Kode lengkap sementara <code>routes/api.php</code></summary>

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
            Route::put('/{user:username}/accept', \App\Http\Controllers\Api\v1\User\AcceptController::class)
                ->missing(function () {
                    return response()->json([
                        'message' => 'User not found',
                    ]);
                });
            Route::get('/{user:username}/followers', \App\Http\Controllers\Api\v1\User\FollowerController::class)
                ->missing(function () {
                    return response()->json([
                        'message' => 'User not found',
                    ]);
                });
        });

        Route::get('/following', \App\Http\Controllers\Api\v1\FollowingController::class);

        Route::get('/users', \App\Http\Controllers\Api\v1\UserController::class);
    });
});
```
</details>


## Mendapatkan Detail User

Pada bagian ini, kita akan menambahkan beberapa field Response yang lumayan sulit jika tidak diteliti dengan baik. Field Response tambahannya adalah:
- `is_your_account` yang menandakan bahwa apakah akun yang dicari adalah Akun dari orang yang sedang Log In?
- `following_status` menandakan apakah status Follow yang diminta dari Akun yang dicari ini adalah `not-following` (belum follow), `requested` (sudah follow tapi belum diterima), serta `following` (sudah follow dan sudah diterima)
- `posts_count` banyaknya postingan pada akun yang dicari
- `followers_count` banyaknya user yang mengikuti Akun yang dicari
- `followings_count` banyaknya user yang diikuti oleh Akun yang dicari
- `posts` detail dari postingan

Dengan field Response tambahan sebanyak itu, perlu Anda ketahui bahwa sebagian besar tambahannya dapat dilakukan dengan cara mudah dan menggunakan fitur yang sudah disediakan Laravel.

Namun perlu diketahui juga bahwa kita memiliki kondisi tambahan yaitu "Field posts should be hidden if the user is a private user and the follow status is not following or is requested". Jadi, kita terjemahkan dulu ke poin-poin penting bahwa field `posts` harus disembunyikan jika:
1. `is_private` dari user yang dicari adalah `true`
2. `following_status` dari user yang dicari adalah `not-following` atau `requested`. Jadi bisa disimpulkan bahwa field `posts` tidak akan disembunyikan jika `following_status`-nya adalah `following`.

Sudah kebayang gimana kodenya? Santai, gampang kok, kita coba koding pelan-pelan dari sini.


### Membuat `UserService`

Sama seperti pada saat kita membuat `FollowService`, kita akan membuat `UserService`.

Buat file baru bernama `UserService.php` pada folder `app/Services`, lalu tambahkan kode berikut:

```php
<?php

namespace App\Services;

use App\Models\User;

class UserService
{
    //
}
```


#### Kode Cek Akun yang Dicari adalah Akun Sendiri

Kode berikut digunakan untuk mengecek apakah User yang sedang dicari adalah milik diri sendiri (User yang login):

```php
/**
 * Checks if the given user is the same as the logged-in user.
 *
 * @param  \App\Models\User  $loggedInUser The currently logged-in user.
 * @param  \App\Models\User  $userSearched The user being searched or viewed.
 * @return bool Returns true if the given user is the same as the logged-in user, otherwise false.
 */
public static function isOwnAccount(User $loggedInUser, User $userSearched): bool
{
    return $loggedInUser->id == $userSearched->id;
}
```


#### Kode Cek Status Following

Kode berikut digunakan untuk mendapatkan `status` antara User yang sedang login dan User yang sedang dicari:

```php
/**
 * Gets the following status between the logged-in user and the searched user.
 *
 * @param  \App\Models\User  $loggedInUser The currently logged-in user.
 * @param  \App\Models\User  $userSearched The user being searched or viewed.
 * @return string Returns the following status:
 *      - 'not-following' if the logged-in user is not following the searched user.
 *      - 'following' if the logged-in user is following the searched user and the follow request is accepted.
 *      - 'requested' if the logged-in user has sent a follow request to the searched user, pending acceptance.
 */
public static function getFollowingStatus(User $loggedInUser, User $userSearched): string
{
    $follow = FollowService::findFollowingRelationship($loggedInUser, $userSearched);

    if (empty($follow)) return 'not-following';

    return $follow->is_accepted
        ? 'following'
        : 'requested';
}
```


#### Kode Cek Akun yang Dicari adalah Akun Privat

Kode berikut digunakan untuk menentukan apakah Akun User yang dicari adalah akun privat.

```php
/**
 * Checks if the searched user's account is private.
 *
 * @param  \App\Models\User  $userSearched The user being searched or viewed.
 * @return bool Returns true if the searched user's account is private, otherwise false.
 */
public static function isPrivate(User $userSearched): bool
{
    return $userSearched->is_private;
}
```


#### Kode Cek Apakah Status `not-following` atau `requested`

Kode berikut digunakan untuk menentukan apakah status Following antara User yang login dan User yang dicari adalah `not-following` atau `requested`.

```php
/**
 * Checks if the given status indicates that the user is not following or has sent a follow request.
 *
 * @param  string  $status The status to check.
 * @return bool Returns true if the status indicates that the user is not following or has sent a follow request, otherwise false.
 */
public static function isStatusNotFollowingOrRequested(string $status): bool
{
    return in_array($status, ['not-following', 'requested']);
}
```

Setelah seluruh kode `UserService` diimplementasi, kurang lebih lengkapnya adalah sebagai berikut:

<details>
    <summary>Spoiler: Kode lengkap <code>UserService</code></summary>

```php
<?php

namespace App\Services;

use App\Models\User;

class UserService
{
    /**
     * Checks if the given user is the same as the logged-in user.
     *
     * @param  \App\Models\User  $loggedInUser The currently logged-in user.
     * @param  \App\Models\User  $userSearched The user being searched or viewed.
     * @return bool Returns true if the given user is the same as the logged-in user, otherwise false.
     */
    public static function isOwnAccount(User $loggedInUser, User $userSearched): bool
    {
        return $loggedInUser->id == $userSearched->id;
    }

    /**
     * Gets the following status between the logged-in user and the searched user.
     *
     * @param  \App\Models\User  $loggedInUser The currently logged-in user.
     * @param  \App\Models\User  $userSearched The user being searched or viewed.
     * @return string Returns the following status:
     *      - 'not-following' if the logged-in user is not following the searched user.
     *      - 'following' if the logged-in user is following the searched user and the follow request is accepted.
     *      - 'requested' if the logged-in user has sent a follow request to the searched user, pending acceptance.
     */
    public static function getFollowingStatus(User $loggedInUser, User $userSearched): string
    {
        $follow = FollowService::findFollowingRelationship($loggedInUser, $userSearched);

        if (empty($follow)) return 'not-following';

        return $follow->is_accepted
            ? 'following'
            : 'requested';
    }

    /**
     * Checks if the searched user's account is private.
     *
     * @param  \App\Models\User  $userSearched The user being searched or viewed.
     * @return bool Returns true if the searched user's account is private, otherwise false.
     */
    public static function isPrivate(User $userSearched): bool
    {
        return $userSearched->is_private;
    }

    /**
     * Checks if the given status indicates that the user is not following or has sent a follow request.
     *
     * @param  string  $status The status to check.
     * @return bool Returns true if the status indicates that the user is not following or has sent a follow request, otherwise false.
     */
    public static function isStatusNotFollowingOrRequested(string $status): bool
    {
        return in_array($status, ['not-following', 'requested']);
    }
}
```
</details>


### Membuat Invokable Controller `UserDetailController`

Seperti halnya kita ingin membuat fitur baru, kita mulai dengan pembuatan Controller dulu. Jalankan perintah ini pada command line:

`php artisan make:controller Api/v1/User/UserDetailController --invokable`

Setelah itu, buka file `UserDetailController` dan tambahkan Parameter `User $user` setelah `Request $request` pada fungsi `__invoke()`.

```php
<?php

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserDetailController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user)
    {
        return response()->json($user);
    }
}
```


#### Memuat data `posts`

Saat ini, kita sudah pernah membuat relasi `post` pada Model `User`, namun karena Model `User` dapat memiliki banyak `Post`, kita secara tidak sengaja memiliki typo pada Model `User`. Perhatikan kode berikut pada Model `User`:

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
```

Secara sekilas tidak ada yang salah, namun jika diteliti lagi, mengikuti standar Naming Convention Laravel, relasi `post` seharusnya bernama `posts` karena Model `User` dapat memiliki lebih dari 1 `Post`. Ubah nama fungsi relasi `post` menjadi `posts` lalu ikuti langkah selanjutnya.

Setelah memperbaiki typo, sekarang kita akan memuat data postingan dari User yang kita cari. Kembali ke file `UserDetailController`, tambahkan kode berikut:

```php
<?php

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserDetailController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user)
    {
        $user->load([
            'posts',
        ]);

        return response()->json($user);
    }
}
```

Fungsi dari `$user->load(...$relations)` adalah memuat data relasi yang didefinisikan pada Mode `User`, kode ini hampir sama dengan fungsi statis `User::with()`, namun karena Model User sudah kita definisikan sebagai Parameter pada fungsi `__invoke` sebagai Model Binding, sehingga data User sudah diambil secara otomatis, kita hanya perlu memuat data tambahannya saja.


#### Memuat Statistik Jumlah `followers`, `followings`, `posts`

Sama seperti kode sebelumnya, namun sedikit berbeda, kita perlu menggunakan fungsi `$user->loadCount(...$relations)`. Kodenya adalah sebagai berikut:

```php
<?php

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserDetailController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user)
    {
        $user->load([
            'posts',
        ]);

        $user->loadCount([
            'posts',
            'followers',
            'followings',
        ]);

        return response()->json($user);
    }
}
```


#### Menambahkan Field `is_your_account`

Untuk menambahkan field `is_your_account` ke Response JSON yang dibutuhkan oleh User, kita hanya butuh menambahkan field `is_your_account` pada variabel `$user`, dengan value yang kita dapatkan dari memanggil `UserService::isOwnAccount`. Kodenya adalah sebagai berikut:

```php
<?php

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserDetailController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user)
    {
        $user->load([
            'posts',
        ]);

        $user->loadCount([
            'posts',
            'followers',
            'followings',
        ]);

        $user['is_your_account'] = UserService::isOwnAccount($request->user(), $user);

        return response()->json($user);
    }
}
```


#### Menambahkan Field `following_status`

Field `following_status` digunakan untuk menentukan apakah User yang sedang login memiliki relasi Follow kepada User yang dicari. Jika tidak ada relasi, maka field harus memiliki value `not-following`. Jika ada relasi, dua kemungkinan akan terjadi: `requested` jika belum diterima, `following` jika sudah diterima. Kita hanya perlu memanggil `UserService::getFollowingStatus`. Kodenya adalah sebagai berikut:

```php
<?php

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserDetailController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user)
    {
        $user->load([
            'posts',
        ]);

        $user->loadCount([
            'posts',
            'followers',
            'followings',
        ]);

        $user['is_your_account'] = UserService::isOwnAccount($request->user(), $user);

        $user['following_status'] = UserService::getFollowingStatus($request->user(), $user);

        return response()->json($user);
    }
}
```


#### Menyembunyikan Field `posts` Jika Akun Privat, atau Status bukan `following`

Untuk pertama kalinya, kita akan menggunakan 2 fungsi disaat yang bersamaan. Fungsi tersebut adalah `UserService::isPrivate($user)` dan `UserService::isStatusNotFollowingOrRequested`. Kodenya adalah sebagai berikut:

```php
<?php

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserDetailController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user)
    {
        $user->load([
            'posts',
        ]);

        $user->loadCount([
            'posts',
            'followers',
            'followings',
        ]);

        $user['is_your_account'] = UserService::isOwnAccount($request->user(), $user);

        $user['following_status'] = UserService::getFollowingStatus($request->user(), $user);

        if (UserService::isPrivate($user) || UserService::isStatusNotFollowingOrRequested($user['following_status'])) {
            unset($user->posts);
        }

        return response()->json($user);
    }
}
```

Alasan kenapa kita menggunakan kode

```php
if (UserService::isPrivate($user) || UserService::isStatusNotFollowingOrRequested($user['following_status'])) {
    unset($user->posts);
}
```

adalah karena kemudahan keterbacaan. Jika kita menulis semua fungsi pengecekannya, kurang lebih kodenya adalah sebagai berikut:

```php
if ($user->is_private || in_array($status, ['not-following', 'requested'])) {
    unset($user->posts);
}
```

Kodenya mungkin lebih singkat, namun kita perlu waktu untuk membaca semuanya secara bersamaan.


## Akhir Kata

Kita sudah selesai mengerjakan modul Back-End dari Modul 3. Selanjutnya, kita akan belajar cara untuk menggunakan Vue.js sebagai Front-End. Terima kasih atas semangat dan ketekunan kalian dalam membaca seri artikel kali ini. Sampai bertemu di artikel selanjutnya 👋.

[Kode Lengkap](https://github.com/NikarashiHatsu/lks-modul-3-be/tree/user).