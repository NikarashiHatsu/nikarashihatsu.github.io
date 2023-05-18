---
title: "TL:DR Standarisasi CI4 Part 1 s/d Part 4"
date: 2022-07-02T03:39:21+07:00
tags: ["article", "codeigniter", "php"]
draft: false
series: ["Standarisasi CI4"]
series_order: 5
---
Hai, nggak kerasa udah 4 artikel yang sudah Saya tulis di seri "Standarisasi CI4". Karena mungkin banyak dari teman-teman yang butuh rangkuman cepatnya, akan Saya kutip sesuai urutan *flow* pembuatan CRUD. *Tapi jangan lupa untuk baca artikelnya satu-per-satu ya, karena banyak penjelasan yang cukup penting juga demi pemahaman teman-teman*.

## *Environment*
1. `CI_ENVIRONMENT` digunakan untuk mengatur CI apakah *error handling* akan ditampilkan atau tidak. Konstanta ini merepresentasikan apakah aplikasi berada di lingkungan `development` atau `production`.
2. `app_baseURL` digunakan untuk mengatur URL *default* aplikasi.
3. `database.default.database` digunakan untuk mengatur *database* mana yang akan digunakan.
4. `database.default.username` digunakan untuk mengatur *username* yang akan digunakan untuk mengakses *database*.
5. `database.default.password` digunakan untuk mengatur *password* dari *user* yang akan digunakan untuk mengakses *database*.

## *Routing*
1. *Single-method*, digunakan jika suatu modul hanya memiliki sedikit metode; alternatif jika `$routes->resource()` ataupun `$routes->presenter()` dianggap mubazir.
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
2. *Restful routing*, digunakan jika suatu modul adalah bagian dari CRUD atau RESTful API.
    ```php
    <?php
    // app/Config/Routes.php
    $routes->resource('user', ['controller' => 'UserController']);
    $routes->presenter('blog', ['controller' => 'BlogController']);
    ```
3. *Option* pada *RESTful routing*:
    ```php
    <?php
    // app/Config/Routes.php
    $routes->resource('user', [
        'controller' => 'UserController',    // Nama Controller yang digunakan
        'placeholder' => ':num',             // Mengatur regex yang digunakan controller untuk penerimaan parameter
        'websafe' => true,                   // Mengatur versi yang aman untuk HTTP (hanya berlaku untuk resource, bukan presenter)
        'only' => ['method1', 'method2'],    // Mengatur metode apa saja yang bisa dipakai
        'except' => ['method3', 'method4'],  // Mengatur metode apa saja yang akan dibuang
    ]);
    ```


## *Controller*
1. *Controller* biasa.
    - Penggunaan: digunakan jika modul tersebut digunakan untuk **komputasi**, dan bukan untuk CRUD. Bisa juga digunakan sebagai **modul ekstensi** dari sebuah modul CRUD.
    - *Command*: `php spark make:controller Nama --suffix`
2. *Bare Controller*.
    - Penggunaan: digunakan jika seluruh *controller* **tidak** memiliki fungsi atau *helper* yang di-*load* secara *default*.
    - *Command*: `php spark make:controller Nama --suffix --bare`
3. *Resource Controller*.
    - Penggunaan: digunakan bersamaan dengan `$routes->resource()` pada konfigurasi rute. Biasanya digunakan dalam pembuatan RESTful API.
    - *Command*:  `php spark make:controller Nama --suffix --restful controller`
4. *Presenter Controller*.
    - Penggunaan: digunakan bersamaan dengan `$routes->presenter()` pada konfigurasi rute. Biasanya digunakan dalam pembuatan CRUD. **Gunakan opsi ini jika teman-teman ingin membuat modul CRUD dengan lebih cepat**.
    - *Command*: `php spark make:controller Nama --suffix --restful presenter`.


## *Model*
1. Buat model menggunakan *command line* dengan perintah `php spark make:model Nama --suffix`. Flag `--suffix` akan menambahkan kata *Model* di akhir nama secara otomatis.
2. Atur penggunaan tabel yang digunakan pada suatu *model* dengan mengatur *property* `$table`.
3. Atur bentuk balikan dari *model* dengan mengatur *property* `$returnType` ke `array` atau `object`.
4. Property `$allowedFields` digunakan untuk mengatur kolom-kolom apa saja yang bisa diisi.
5. Property `$validationRules` digunakan untuk mengatur validasi dari kolom-kolom yang ada di *property* `$allowedFields`.
6. Property `$validationMessages` digunakan untuk mengatur pesan *error* dari validasi yang tidak memenuhi kriteria `$validationRules`.
7. *Model Callback* berguna untuk memanipulasi data sebelum data tersebut diolah lebih lanjut.
8. Validasi *model* akan berjalan saat fungsi `insert()`, `update()`, atau `save()` dipanggil.

### Daftar Pustaka
- [Standarisasi CI4 - Routing](https://shiroyuki.dev/blog/standarisasi-ci4--routing) oleh Aghits Nidallah.
- [Standarisasi CI4 - Environment](https://shiroyuki.dev/blog/standarisasi-ci4--environment) oleh Aghits Nidallah.
- [Standarisasi CI4 - Controller](https://shiroyuki.dev/blog/standarisasi-ci4--controller) oleh Aghits Nidallah.
- [Standarisasi CI4 - Model Query](https://shiroyuki.dev/blog/standarisasi-ci4--model-query) oleh Aghits Nidallah.
