---
title: "Standarisasi CI4 - Routing"
date: 2022-07-02T03:39:21+07:00
tags: ["article", "codeigniter", "php"]
draft: false
series: ["Standarisasi CI4"]
series_order: 1
---

CodeIgniter, siapa yang tidak kenal dengan salah satu *framework* PHP ini? Mungkin bagi teman-teman yang baru masuk ke dunia PHP, *framework* ini sering dibicarakan sebagai salah satu *framework* yang *beginner-friendly*. Bagaimana tidak? Kodenya yang *native-like*, kode yang mirip sekali dengan kode PHP *Native*, sehingga semua orang bisa memahaminya.

Namun ada salah satu hal, yang tidak Saya sukai tentang CodeIgniter ini. **Tidak adanya standarisasi di setiap kodenya**, bahkan dokumentasinya terlalu acak, sehingga dari banyaknya *tutorial* di luar sana, tidak ada satupun yang sama. Hampir dari seluruh *tutorial* CodeIgniter yang pernah Saya ikuti berbeda. Entah itu berdasarkan *code of conduct*nya, standar kodenya, semua mengikuti preferensi sendiri-sendiri. Sehingga tiba pada saatnya di sebuah projek CodeIgniter besar yang membutuhkan tim untuk mengerjakannya, kode menjadi acak-acakan dan tidak beraturan.

Karena itu, di seri "Standarisasi CodeIgniter" ini, saya akan mencoba untuk memperbaiki, serta menstandarisasi beberapa hal, sehingga kode yang ditulis menjadi lebih rapi. Tentu saja ini adalah tulisan berdasarkan opini pribadi, sehingga teman-teman bisa mengkritisi, menyarankan, atau bahkan menyanggah opini Saya di kolom komentar.

## Routing
Routing adalah suatu aspek paling penting yang ada di sebuah *Framework* yang berbasis MVC (*Model*, *View*, *Controller*). Beberapa hal yang Saya **benci** dari hal ini adalah segmentasi URL. Banyak dari *tutorial* yang Saya ikuti, menggunakan `getSegment()` untuk mendapatkan sebuah segmentasi dari URL. Menurut Saya, hal ini dapat dipersingkat.

Satu hal yang pasti, sebelum memulai ini, **nonaktifkan fitur Auto-routing pada CI4**, menurut dokumentasi pada file `app/Config/Routes.php`: *The Auto Routing (legacy) is very dangerous. It is easy to create vulnerable apps where controller filters or CSRF are bypassed.* *Uncomment* baris 28 pada `app/Config/Routes.php` untuk menonaktifkan fitur Auto-routing.

Anggaplah pada suatu tutorial, ada salah satu rute seperti ini:
```php
<?php
// app/Config/Routes.php
$routes->get('/users/(:num)/edit', 'UserController::edit');
```

dan, pada `app/Controllers/UserController.php@edit`, berisi:
```php
<?php
// app/Controllers/UserController.php
public function edit()
{
    $uri = current_url(true);
    $user_id = $uri->getSegment(3);

    echo $user_id;
}
```

Saya akui, fungsi segmentasi URL adalah suatu layanan CI4 yang sangat kuat, namun hal ini akan berpengaruh sangat besar, ketika Anda menggunakan fitur *Route resource* CI4. Kita akan coba perbaiki kode di atas menjadi seperti berikut: 
```php
<?php
// app/Config/Routes.php
$routes->get('/users/(:num)/edit', 'UserController::edit/$1');
```

Kode di atas, kurang lebih sama, namun CI4 akan segmentasi `:num` sebagai *parameter* pertama pada metode `edit()`.
```php
<?php
// app/Controllers/UserController.php
public function edit($user_id)
{
    echo $user_id;
}
```

Dengan kode yang lebih singkat, kita bisa melakukan semua hal yang terkait dengan segmentasi menjadi efisien, bahkan ketika ada perubahan skema *routing* terjadi
```php
<?php
// app/Config/Routes.php
$routes->get('/users/edit_user/(:num)', 'UserController::edit/$1');
```

`UserController` masih akan bisa menerima *parameter* pertama dengan normal:
```php
<?php
// app/Controllers/UserController.php
public function edit($user_id)
{
    echo $user_id;
}
```

## Route Resource
*Route resource* adalah sebuah fitur yang ada pada CI4 yang berguna untuk mempersingkat CRUD. Mengapa demikian? Bayangkan teman-teman memiliki beberapa rute seperti ini:
```php
<?php
// app/Config/Routes.php
$routes->get('/user', 'UserController::index');
$routes->get('/user/new', 'UserController::new');
$routes->get('/user/(:num)/edit', 'UserController::edit/$1');
$routes->get('/user/(:num)', 'UserController::show/$1');
$routes->post('/user', 'UserController::create');
$routes->patch('/user/(:num)', 'UserController::update/$1'); // Gunakan Patch atau Put, sama saja.
$routes->put('/user/(:num)', 'UserController::update/$1');
$routes->delete('/user/(:num)', 'UserController::delete/$1');
```

Tentunya me-*manage* rute di atas sangatlah tidak efisien, selain memperbanyak file *Routes*, file *Routes* juga sulit dibaca karena banyaknya kode, hanya untuk **1 modul CRUD**. Solusinya? **Route Resource**!

```php
// app/Config/Routes.php
$routes->resource('user', [
    'controller' => 'UserController',
]);
```
CI4 akan mengintruksikan *routing* dengan URI `user` menggunakan `UserController` sebagai *Controller Resource*. Jika kita jalankan `php spark routes` pada terminal, maka kita akan dapatkan *response* sebagai berikut:

``` bash
php spark routes

+--------+----------------+--------------------------------------------+----------------+---------------+
| Method | Route          | Handler                                    | Before Filters | After Filters |
+--------+----------------+--------------------------------------------+----------------+---------------+
| GET    | user           | \App\Controllers\UserController::index     |                | toolbar       |
| GET    | user/new       | \App\Controllers\UserController::new       |                | toolbar       |
| GET    | user/(.*)/edit | \App\Controllers\UserController::edit/$1   |                | toolbar       |
| GET    | user/(.*)      | \App\Controllers\UserController::show/$1   |                | toolbar       |
| POST   | user           | \App\Controllers\UserController::create    |                | toolbar       |
| PATCH  | user/(.*)      | \App\Controllers\UserController::update/$1 |                | toolbar       |
| PUT    | user/(.*)      | \App\Controllers\UserController::update/$1 |                | toolbar       |
| DELETE | user/(.*)      | \App\Controllers\UserController::delete/$1 |                | toolbar       |
| CLI    | ci(.*)         | \CodeIgniter\CLI\CommandRunner::index/$1   |                |               |
+--------+----------------+--------------------------------------------+----------------+---------------+
```

Referensi *Route Resource* lengkap adalah sebagai berikut:
```php
<?php
// app/Config/Routes.php
$routes->resource('uri', $options);
```

`$options` yang *Route Resource* CI4 terima adalah sebagai berikut:
1. `controller`, mengatur *Controller* apa yang akan digunakan.
    
    Anda bisa menggunakan opsi ini seperti:
    ```php
    <?php
    // app/Config/Routes.php
    $routes->resource('user', ['controller' => 'UserController']);
    $routes->resource('blog', ['controller' => 'BlogController']);
    $routes->resource('comments', ['controllers' => 'Blog/CommentsController']);
    ```

2. `placeholder`, mengatur regex yang digunakan oleh *Router*. Secara *default*, CI4 menerima (:any) atau (.*) yang berarti menerima seluruh bentuk parameter, entah itu numerik, huruf, atau simbol.

    ```php
    <?php
    // app/Config/Routes.php
    $routes->resource('user', [
        'controller' => 'UserController',
        'placeholder' => ':num',
    ]);
    ```
    
    Opsi ini akan mengintruksikan Router untuk menerima **hanya numerik** sebagai parameter. Jika kita jalankan `php spark routes` pada terminal, maka ini yang akan ditampilkan:

    ```bash
    php spark routes
    
    +--------+--------------------+--------------------------------------------+----------------+---------------+
    | Method | Route              | Handler                                    | Before Filters | After Filters |
    +--------+--------------------+--------------------------------------------+----------------+---------------+
    | GET    | user               | \App\Controllers\UserController::index     |                | toolbar       |
    | GET    | user/new           | \App\Controllers\UserController::new       |                | toolbar       |
    | GET    | user/([0-9]+)/edit | \App\Controllers\UserController::edit/$1   |                | toolbar       |
    | GET    | user/([0-9]+)      | \App\Controllers\UserController::show/$1   |                | toolbar       |
    | POST   | user               | \App\Controllers\UserController::create    |                | toolbar       |
    | PATCH  | user/([0-9]+)      | \App\Controllers\UserController::update/$1 |                | toolbar       |
    | PUT    | user/([0-9]+)      | \App\Controllers\UserController::update/$1 |                | toolbar       |
    | DELETE | user/([0-9]+)      | \App\Controllers\UserController::delete/$1 |                | toolbar       |
    | CLI    | ci(.*)             | \CodeIgniter\CLI\CommandRunner::index/$1   |                |               |
    +--------+--------------------+--------------------------------------------+----------------+---------------+
    ```
    
3. `websafe`, jika Anda mengetahui bahwa protokol HTTP tidak dapat menggunakan metode seperti PATCH, PUT, atau DELETE, maka inilah solusinya.

    ```php
    <?php
    // app/Config/Routes.php
    $routes->resource('user', [
        'controller' => 'UserController',
        'placeholder' => ':num',
        'websafe' => true,
    ]);
    ```
    
    Kode di atas akan menghasilkan rute seperti ini:
    ```bash
    php spark routes
    +--------+----------------------+--------------------------------------------+----------------+---------------+
    | Method | Route                | Handler                                    | Before Filters | After Filters |
    +--------+----------------------+--------------------------------------------+----------------+---------------+
    | GET    | user                 | \App\Controllers\UserController::index     |                | toolbar       |
    | GET    | user/new             | \App\Controllers\UserController::new       |                | toolbar       |
    | GET    | user/([0-9]+)/edit   | \App\Controllers\UserController::edit/$1   |                | toolbar       |
    | GET    | user/([0-9]+)        | \App\Controllers\UserController::show/$1   |                | toolbar       |
    | POST   | user                 | \App\Controllers\UserController::create    |                | toolbar       |
    | POST   | user/([0-9]+)/delete | \App\Controllers\UserController::delete/$1 |                | toolbar       |
    | POST   | user/([0-9]+)        | \App\Controllers\UserController::update/$1 |                | toolbar       |
    | PATCH  | user/([0-9]+)        | \App\Controllers\UserController::update/$1 |                | toolbar       |
    | PUT    | user/([0-9]+)        | \App\Controllers\UserController::update/$1 |                | toolbar       |
    | DELETE | user/([0-9]+)        | \App\Controllers\UserController::delete/$1 |                | toolbar       |
    | CLI    | ci(.*)               | \CodeIgniter\CLI\CommandRunner::index/$1   |                |               |
    +--------+----------------------+--------------------------------------------+----------------+---------------+
    ```
    
    Seperti yang teman-teman bisa lihat, ada 2 metode baru yang dibuat dari opsi `websafe` ini, keduanya dapat membantu teman-teman untuk menghapus (DELETE), serta memperbarui data (UPDATE).
    ```bash
    +--------+----------------------+--------------------------------------------+----------------+---------------+
    | Method | Route                | Handler                                    | Before Filters | After Filters |
    +--------+----------------------+--------------------------------------------+----------------+---------------+
    | POST   | user/([0-9]+)/delete | \App\Controllers\UserController::delete/$1 |                | toolbar       |
    | POST   | user/([0-9]+)        | \App\Controllers\UserController::update/$1 |                | toolbar       |
    ```
    
4. `only` dan `except`. Sebuah opsi untuk "hanya gunakan" atau "kecuali". Dari kedua opsi ini, teman-teman hanya bisa menggunakan salah satu, keduanya tidak bisa dipakai secara bersamaan. Hal ini berguna jika teman-teman tidak ingin menggunakan beberapa, atau hanya menggunakan salah satu dari sebuah rute. `only` dan `except` hanya menerima array yang berisi metode yang digunakan.

    ```php
    <?php
    // app/Config/Routes.php
    $routes->resource('user', [
        'controller' => 'UserController',
        'placeholder' => ':num',
        'websafe' => true,
        'only' => ['index', 'create', 'show'],
    ]);
    ```
    
    Kode di atas menghasilkan rute sebagai berikut
    ```bash
    php spark routes
    
    +--------+---------------+------------------------------------------+----------------+---------------+
    | Method | Route         | Handler                                  | Before Filters | After Filters |
    +--------+---------------+------------------------------------------+----------------+---------------+
    | GET    | user          | \App\Controllers\UserController::index   |                | toolbar       |
    | GET    | user/([0-9]+) | \App\Controllers\UserController::show/$1 |                | toolbar       |
    | POST   | user          | \App\Controllers\UserController::create  |                | toolbar       |
    | CLI    | ci(.*)        | \CodeIgniter\CLI\CommandRunner::index/$1 |                |               |
    +--------+---------------+------------------------------------------+----------------+---------------+
    ```
    
    Bisa dilihat, bahwa hanya metode `index`, `show`, serta `create` yang digunakan. Metode lain akan dikecualikan, dan tidak bisa digunakan. Sekarang kita akan mencoba opsi `except`

    ```php
    <?php
    // app/Config/Routes.php
    $routes->resource('user', [
        'controller' => 'UserController',
        'placeholder' => ':num',
        'websafe' => true,
        'except' => ['index', 'create', 'show'],
    ]);
    ```
    
    Kode di atas akan menghasilkan
    ```bash
    php spark routes
    
    +--------+----------------------+--------------------------------------------+----------------+---------------+
    | Method | Route                | Handler                                    | Before Filters | After Filters |
    +--------+----------------------+--------------------------------------------+----------------+---------------+
    | GET    | user/new             | \App\Controllers\UserController::new       |                | toolbar       |
    | GET    | user/([0-9]+)/edit   | \App\Controllers\UserController::edit/$1   |                | toolbar       |
    | POST   | user/([0-9]+)/delete | \App\Controllers\UserController::delete/$1 |                | toolbar       |
    | POST   | user/([0-9]+)        | \App\Controllers\UserController::update/$1 |                | toolbar       |
    | PATCH  | user/([0-9]+)        | \App\Controllers\UserController::update/$1 |                | toolbar       |
    | PUT    | user/([0-9]+)        | \App\Controllers\UserController::update/$1 |                | toolbar       |
    | DELETE | user/([0-9]+)        | \App\Controllers\UserController::delete/$1 |                | toolbar       |
    | CLI    | ci(.*)               | \CodeIgniter\CLI\CommandRunner::index/$1   |                |               |
    +--------+----------------------+--------------------------------------------+----------------+---------------+
    ```
    
    Bisa teman-teman lihat bahwa metode `index`, `show`, serta `create` tidak ditemukan dalam daftar rute.

## Route Presenter
*Route Presenter* adalah versi HTTP-*safe* dari *Route Resource*. Bisa dibilang secara singkat dari penggunaan keduanya sedikit berbeda, perbedaannya Saya buat seperti di bawah:


| *Use case* | *Route Resource* | *Route Presenter* |
| --- | --- | --- |
| Penamaan *routing* | Lebih cocok untuk API | Lebih contoh untuk HTTP |
| Metode yang dihasilkan | `GET`. `POST`, `PUT`, `PATCH`, `DELETE` | `GET`, `POST` |
| Opsi yang tersedia untuk parameter `$option` | `controller`, `websafe`, `placeholder` | `controller`, `placeholder` |

Sekarang, bagaimana caranya menerapkan *Route Presenter* ini?
```php
<?php
// app/Config/Routes.php
$routes->presenter('user', [
    'controller' => 'UserController',
]);
```

Kode di atas akan menghasilkan daftar rute seperti ini:
```bash
php spark routes

+--------+------------------+--------------------------------------------+----------------+---------------+
| Method | Route            | Handler                                    | Before Filters | After Filters |
+--------+------------------+--------------------------------------------+----------------+---------------+
| GET    | user             | \App\Controllers\UserController::index     |                | toolbar       |
| GET    | user/show/(.*)   | \App\Controllers\UserController::show/$1   |                | toolbar       |
| GET    | user/new         | \App\Controllers\UserController::new       |                | toolbar       |
| GET    | user/edit/(.*)   | \App\Controllers\UserController::edit/$1   |                | toolbar       |
| GET    | user/remove/(.*) | \App\Controllers\UserController::remove/$1 |                | toolbar       |
| GET    | user/(.*)        | \App\Controllers\UserController::show/$1   |                | toolbar       |
| POST   | user/create      | \App\Controllers\UserController::create    |                | toolbar       |
| POST   | user/update/(.*) | \App\Controllers\UserController::update/$1 |                | toolbar       |
| POST   | user/delete/(.*) | \App\Controllers\UserController::delete/$1 |                | toolbar       |
| POST   | user             | \App\Controllers\UserController::create    |                | toolbar       |
| CLI    | ci(.*)           | \CodeIgniter\CLI\CommandRunner::index/$1   |                |               |
+--------+------------------+--------------------------------------------+----------------+---------------+
```

Bisa teman-teman lihat di atas, bahwa tidak ada sekalipun metode `PUT`, `PATCH`, atau `DELETE` yang digunakan. Maka bisa Saya simpulkan bahwa *Route Presenter* adalah HTTP-*safe*.

Perlu diingat, penggunaan `Route Resource` atau `Route Presenter` mewajibkan teman-teman untuk menggunakan standar penamaan metode yang ada di dalam Controller. Penamaan tersebut antara lain:


| Metode | *Route Resource* | *Route Presenter* |
| --- | --- | --- |
| `index` | Mengembalikan semua data, bisa juga berbentuk pagination | Halaman Index |
| `show` | Mengembalikan data spesifik | Halaman Detail |
| `new` | - | Halaman Form pembuatan data |
| `create` | Menyimpan data | Menyimpan data |
| `edit` | - | Halaman Form pengeditan data |
| `update` | Memperbarui data | Memperbarui data |
| `remove` | - | Halaman konfirmasi penghapusan data |
| `delete` | Menghapus data | Menghapus data |

## Pemanggilan *Route*
Entah kenapa CI4 tidak dapat mengimplementasikan `named route` seperti halnya Laravel. Padahal fungsi ini sangat membantu, karena, jika suatu saat ada suatu perubahan pada rute, teman-teman harus mengubah semua kode yang teman-teman panggil. Seperti contoh seperti ini:
```php
<?php
// app/Config/Routes.php
$routes->presenter('user', ['controller' => 'UserController']);
// diubah menjadi:
$routes->presenter('dashboard/user', ['controller' => 'UserController']);
```

Lalu bayangkan teman-teman memiliki kode seperti:
```php
// app/views/sebuah-view.php
<?= base_url('/user/' . $user->id); ?>

// Kode di atas akan menghasilkan:
// '/user/$id'
//
// Namun, setelah perubahan:
// '/user/$id' <- akan menghasilkan error 404 karena rute tidak ditemukan
```

di 12 file atau halaman yang berbeda. Menggantinya satu-per-satu merupakan sebuah aksi refaktor yang sangat melelahkan. Maka dari itu, kita akan gunakan fungsi `route_to` yang disediakan CI4. Fungsi ini sama saja seperti fungsi *named route* pada Laravel. Penggunaannya seperti ini:
```php
// app/views/sebuah-view.php
<?= base_url(route_to('UserController::show', $user->id)) ?>

// Kode di atas akan menghasilkan:
// '/user/$id'
//
// Setelah perubahan route:
// '/dashboard/user/$id'
```

Nah, sangat membantu kan teman-teman? Setiap perubahan apapun yang terjadi di dalam `app/Config/Routes.php`, CI4 akan secara otomatis mengkonversi rute lama ke rute baru. Fungsi ini akan membantu teman-teman untuk mengubah rute, tanpa adanya refaktor.

Terima kasih sudah membaca tulisan yang panjang ini, semoga bermanfaat!

### Daftar Pustaka
- Working with URLs, dokumentasi [CodeIgniter 4](https://codeigniter.com/user_guide/libraries/uri.html)
- URI routing, dokumentasi [CodeIgniter 4]('https://codeigniter4.github.io/CodeIgniter4/incoming/routing.html)
- Pengalaman pribadi menggunakan CI4 selama 6 bulan.
