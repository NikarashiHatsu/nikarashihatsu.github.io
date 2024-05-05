---
title: "Tutorial Mengerjakan Soal Modul 3 LKS Provinsi Web Technology - Followers"
date: 2024-05-05T21:52:00+07:00
tags: ["article", "laravel", "web", "technology", "lks"]
draft: false
series: ["Modul 3 LKS Provinsi Web Technology"]
series_order: 5
---

Halo semua, kembali lagi dengan seri artiikel Tutorial Mengerjakan Soal Modul 3 LKS Provinsi Web Technology, kali ini kita akan membahas cara membuat Back End sub-modul Follower. Seperti biasa, siapkan air minum dan mental, karena tutorial kali ini sama panjangnya seperti artikel-artikel sebelumnya.

Ready to code? Check them out!


## Menerima Follower

Kali ini, karena Model `Follow` sudah dibuat dan User bisa meminta Follow ke User lain, saatnya kita membuat fitur untuk menerima Follower. Studi kasus kali ini adalah:

| User A | User B |
|-|-|
| Meminta Follow Request ke User B | Menerima Follow Request dari User A |
| User A tidak login | User B yang login |

Saat ini, kita gunakan satu studi kasus dulu, supaya kalian tidak kewalahan. Langsung saja masuk ke tahap selanjutnya.


### Membuat Invokable Controller `Api/v1/User/AcceptController`

Seperti biasa, kita membuat Controller dengan mengeksekusi perintah ini:

`php artisan make:controller Api/v1/User/AcceptController --invokable`

Buka file `app/Http/Controllers/Api/v1/User/AcceptController` dan kita akan menambahkan beberapa fitur pengecekan terlebih dahulu.


### Mengecek Jika User A tidak Follow User B

Pertama-tama, kita harus mengecek apakah User A (user yang tidak login), sudah Follow User B (user yang login). Untuk itu, kita harus mengecek data dari tabel `follows` dengan kondisi secara terbalik.

```php
<?php

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AcceptController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user)
    {
        $follower = Follow::query()
            ->where('follower_id', $user->id)
            ->where('following_id', $request->user()->id)
            ->first();

        if (empty($follower)) {
            return response()->json([
                'message' => 'The user is not following you',
            ], 422);
        }
    }
}
```

Saat ini, jika User A (yang meminta Follow ke User B) belum mem-Follow User A, maka Response yang dikembalikan akan terlihat seperti berikut:

```json
{
    "message": "The user is not following you"
}
```

#### Memindahkan Logika Pengecekan Tidak Follow ke `FollowService`

Karena kita menerapkan prinsip One Responsibility, pindahkan logika pengecekan Tidak Follow ke `FollowService`. Tambahkan kode berikut ke file `FollowService`:

```php
/**
 * Finds the follow relationship where the given user is the follower and the other user is being followed.
 *
 * @param  \App\Models\User  $loggedInUser  The user who logged in
 * @param  \App\Models\User  $follower      The user who is potentially following.
 * @return \App\Models\Follow|null  Returns the Follow model instance representing the follow relationship if found, otherwise null.
 */
public static function findFollowingRelationship(User $loggedInUser, User $follower): ?Follow
{
    return Follow::query()
        ->where('follower_id', $follower->id)
        ->where('following_id', $loggedInUser->id)
        ->first();
}

/**
 * Checks if a user is not following another user.
 *
 * @param  \App\Models\User  $loggedInUser  The user who logged in
 * @param  \App\Models\User  $follower      The user who is potentially following.
 * @return bool  Returns true if the $following user is following the $follower user, otherwise false.
 */
public static function isUserNotFollowing(User $loggedInUser, User $follower): bool
{
    return empty(self::findFollowingRelationship($loggedInUser, $follower));
}
```

Fungsi `findFollowingRelationship` adalah kode untuk mengambil data dari database. Sementara fungsi `isUserNotFollowing` adalah kode untuk menentukan apakah User A sudah mengikuti User B.


#### Mengubah Kode Pengecekan pada `AcceptController`

Setelah kode Pengecekan Tidak Follow dipindah, kita modifikasi kode `if` yang tadi kita buat menjadi seperti ini:

```php
if (FollowService::isUserNotFollowing($request->user(), $user)) {
    return response()->json([
        'message' => 'The user is not following you',
    ], 422);
}
```


### Mengecek Jika Permintaan Follow Sudah Diterima

Kita tambahkan kode berikut setelah blok kode `if` yang ada di `AcceptController`:

```php
$following = FollowService::findFollowingRelationship($request->user(), $user);

if ($following?->is_accepted ?? false) {
    return response()->json([
        'message' => 'Follow request is already accepted',
    ], 422);
}
```

Ingat bahwa kita sudah pernah membuat fungsi `findFollowingRelationship` pada `FollowService`, karena logika yang kita buat kurang lebih sama, maka kita gunakan kode tersebut lagi.

Karena hasil return dari `findFollowingRelationship` bisa saja mereturn Model `Follow` ataupun `null` jika data tidak ditemukan, maka kita gunakan fitur Null Safe operator untuk mendapatkan kolom `is_accepted`. Jika data Model `Follow` ada dan permintaan Follow sudah diterima oleh User B (user yang login), maka Controller akan memberikan pesan bahwa "Permintaan Follow dari User A sudah diterima".


#### Memindahkan Kode Pengecekan Permintaan Follow

Sekali lagi, karena `$following?->is_accepted` terlalu abstrak bagi manusia, kita pindahkan kode ini ke suatu fungsi bernama `isFollowRequestAlreadyAccepted` ke `FollowService`. Dengan merepresentasikan kode ke dalam bentuk bahasa yang dipahami manusia, sesama pengembang dapat saling mengerti apa yang ingin dilakukan pengembang sebelumnya dalam kode ini.

Tambahkan kode berikut ke `FollowService`:

```php
/**
 * Checks if a follow request between two users has already been accepted.
 *
 * @param  \App\Models\User  $loggedInUser  The user who logged in
 * @param  \App\Models\User  $follower      The user who is potentially following.
 * @return bool  Returns true if the follow request has already been accepted, otherwise false.
 */
public static function isFollowRequestAlreadyAccepted(User $loggedInUser, User $follower): bool
{
    $following = self::findFollowingRelationship($loggedInUser, $follower);

    return $following?->is_accepted ?? false;
}
```


#### Mengubah Kode Pengcekan Permintaan Follow pada `AcceptController`

Karena kode yang tadi sudah dipindahkan ke `FollowController`, kita tinggal mengubah kode Pengecekan Permintaan Follow kita menjadi:

```php
if (FollowService::isFollowRequestAlreadyAccepted($request->user(), $user)) {
    return response()->json([
        'message' => 'Follow request is already accepted',
    ], 422);
}
```

Response yang diterima User pada saat User B (user yang login) menerima permintaan Follow User A (user yang memberikan permintaan Follow ke User B) adalah sebagai berikut:

```json
{
    "message": "Follow request is already accepted"
}
```


### Menerima Permintaan Follow

Setelah kedua pengecekan sudah dibuat, saatnya kita membuat kode yang digunakan untuk menerima permintaan Follow dari User A (user yang meminta follow ke User B) ke User B (user yang login).

Seperti biasa kita gunakan blok `try-catch`:

```php
try {
    $following = self::findFollowingRelationship($request->user(), $user);

    $following->update([
        'is_accepted' => true,
    ]);
} catch (\Throwable $th) {
    return response()->json([
        'message' => 'Accepting follow request failed: ' . $th->getMessage(),
    ], 500);
}

return response()->json([
    'message' => 'Follow request accepted',
]);
```


#### Memindahkan Kode Penerimaan Permintaan Follow ke `FollowService`

Pindahkan kode yang ada di blok `try` ke fungsi `accept` dalam `FollowService`, kodenya adalah sebagai berikut:

```php
/**
 * Accepts a follow request between two users.
 *
 * @param  \App\Models\User  $loggedInUser  The user who logged in
 * @param  \App\Models\User  $follower      The user who is potentially following.
 * @return bool  Returns true if the follow request is successfully accepted, otherwise false.
 */
public static function accept(User $loggedInUser, User $follower): bool
{
    $following = self::findFollowingRelationship($loggedInUser, $follower);

    return $following->update([
        'is_accepted' => true,
    ]);
}
```


#### Mengubah Kode Penerimaan pada `AcceptController`

Setelah memindahkan Kode Penerimaan Permintaan Follow ke `FollowService`, kita harus mengubah kode yang ada di blok `try` menjadi seperti ini:

```php
FollowService::accept($request->user(), $user);
```

Kode lengkap `AcceptController` adalah kurang lebih seperti ini:

<details>
    <summary>Spoiler: Kode lengkap <code>AcceptController</code></summary>

```php
<?php

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\FollowService;
use Illuminate\Http\Request;

class AcceptController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user)
    {
        if (FollowService::isUserNotFollowing($request->user(), $user)) {
            return response()->json([
                'message' => 'The user is not following you',
            ], 422);
        }

        if (FollowService::isFollowRequestAlreadyAccepted($request->user(), $user)) {
            return response()->json([
                'message' => 'Follow request is already accepted',
            ], 422);
        }

        try {
            FollowService::accept($request->user(), $user);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Accepting follow request failed: ' . $th->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => 'Follow request accepted',
        ]);
    }
}
```
</details>


### Mendaftarkan Rute Penerimaan Permintaan Follow

Controller yang sudah kita buat masih belum dapat digunakan oleh User, karena itu kita harus membuat Rutenya di `routes/api.php`. Tambahkan kode berikut di Rute Grup Middleware `auth:sanctum` dalam prefix `user`:

```php
Route::put('/{user:username}/accept', \App\Http\Controllers\Api\v1\User\AcceptController::class)
    ->missing(function () {
        return response()->json([
            'message' => 'User not found',
        ]);
    });
```

Kode lengkap `routes/api.php` saat ini adalah seperti ini:

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
            Route::put('/{user:username}/accept', \App\Http\Controllers\Api\v1\User\AcceptController::class)
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


## Melihat Seluruh Follower dari Seorang User

Pada tahap ini, kita akan membuat fitur untuk melihat seluruh Follower dari seorang User.


### Membuat Invokable Controller `Api/v1/User/FollowerController`

Kita jalankan perintah berikut pada command line:

`php artisan make:controller Api/v1/User/FollowerController --invokable`


### Membuat Fungsi `followers` di `FollowingService`

Karena tujuan dari kode yang akan kita buat kurang lebih sama dengan fungsi `following` yang sudah ada dalam `FollowingService`, kita hanya butuh mencopasnya ke dalam fungsi baru yang bernama `followers`. Selain itu, alih-alih menggunakan atribut `followings`, kita akan gunakan atribut `followers`.

```php
/**
 * Retrieves the users who are following the given user.
 *
 * @param  \App\Models\User  $user The user whose followers are to be retrieved.
 * @return \Illuminate\Suppoer\Collection  Returns a collection of users who are following the given user.
 */
public static function followers(User $user): Collection
{
    /** @var \Illuminate\Database\Eloquent\Collection */
    $followers = $user->followers;

    return $followers
        ->map(function (Follow $follow) use ($user) {
            $userData = $follow->follower;

            $userData['is_requested'] = self::isRequested($follow->follower, $user);

            return $userData;
        })
        ->values();
}
```


### Mengimplementasikan Kode `FollowService::followers` ke `FollowerController`

Implementasikan kode berikut ke fungsi `__invoke` di `FollowController`:

```php
return response()->json([
    'followers' => FollowService::followers($user),
]);
```

Yap betul, kita tidak perlu kode yang terlalu panjang untuk `FollowController`, cukup 3 baris saja untuk mendapatkan data Follower dari seseorang, kurang lebih Responsenya adalah sebagai berikut:

```json
{
    "followers": [
        {
            "id": 1,
            "full_name": "Aghits Nidallah",
            "username": "irlnidallah",
            "bio": "Seorang full-stack developer, mahasiswa, dan {manusia,robot} yang hidup dengan menikmati kopi ☕️.",
            "is_private": false,
            "created_at": "2024-05-03T21:36:32.000000Z",
            "updated_at": "2024-05-03T21:36:32.000000Z",
            "is_requested": true
        }
    ]
}
```


### Mendaftarkan Rute Follower

Seperti biasa, Controller yang sudah kita buat harus diimplementasikan di `routes/api.php`. Tambahkan kode berikut di Rute Grup Middleware `auth:sanctum` dalam prefix `user`:

```php
Route::get('/{user:username}/followers', \App\Http\Controllers\Api\v1\User\FollowerController::class)
    ->missing(function () {
        return response()->json([
            'message' => 'User not found',
        ]);
    });
```

Kode lengkap `routes/api.php` saat ini adalah seperti ini:

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
    });
});
```
</details>


## Akhir Kata

Begitulah kode yang digunakan untuk mengimplementasikan Penerimaan Permintaan Follow dan Melihat seluruh Follower dari seorang User untuk saat ini. Kali ini artikelnya lumayan singkat, jadi bisa bernafas lega dulu untuk sementara. Jangan lupa untuk minum air, lakukan peregangan, dan jaga kesehatan.

Jumpa lagi di tutorial selanjutnya!

[Kode lengkap](https://github.com/NikarashiHatsu/lks-modul-3-be/tree/follower).