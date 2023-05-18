---
title: "Standarisasi CI4 - Controller"
date: 2022-07-03T10:09:55+07:00
tags: ["article", "codeigniter", "php"]
draft: false
series: ["Standarisasi CI4"]
series_order: 4
---

Halo semua, kembali lagi di seri "Standarisasi CI4". Kali ini kita akan membahas *Controller*, sebuah aspek dari MVC yang berguna untuk memanipulasi data.

Di tulisan ini, kita akan mengupas tentang:
1. *Naming convention*, bagaimana sebuah penamaan mempengaruhi kode.
2. *Bare Controller*, sebuah *controller* kosong.
3. *Restful Controller*, sebuah *controller* dengan beberapa metode yang sudah*pre-generated*.

## *Naming Convention*
Pada saat inisiasi sebuah projek CI4, mereka sendiri secara *default* tidak menamakan *Controller Home* sebagai *HomeController*, namun hanya *Home* saja. Untuk Saya, CI4 sendiri kesannya tidak ingin mengimplementasikan sebuah standar penamaan, tapi lebih kepada kebebasan penamaan.

Secara teknis, anggaplah jika *controller Home* yang sudah ada sebagai bawaan CI4 ini adalah suatu *controller* di aplikasi besar. Secara nama, bagaimana kita mengidentifikasikan bahwa *Home* ini adalah sebuah *controller*?
1. Dari *namespace* yang terdapat pada file *controller* tersebut.
2. Dengan melihat struktur folder dimana file itu berada.
3. Dengan menggunakan *Intellisense.*

Oke, ketiga poin di atas masuk akal. Tapi, apakah kita bisa menyimpulkan bahwa file tersebut adalah sebuah *controller*? Tentunya tidak. Karena itu, *suffix* dari sebuah *controller* sangatlah dibutuhkan. Bukan hanya *controller*, namun hampir dari semua modul seperti *migration*, *seeder*, *filter*, *entity*, dll. Sebab, *suffix* bisa merepresentasikan sebuah file, tanpa kita harus membuka apa isi dari file tersebut.

Untuk membuat sebuah *controller* yang ber-*suffix*, kita jalankan:

`php spark make:controller Home --suffix`

Perintah di atas akan secara otomatis menambahkan tambahan *Controller* di akhir nama. Perintah di atas akan membuat sebuah file baru bernama `HomeController`. Berikut contoh lainnya:

```bash
# 1
php spark make:controller User --suffix

CodeIgniter v4.2.1 Command Line Tool - Server Time: 2022-07-03 06:05:44 UTC-05:00

File created: APPPATH/Controllers/UserController.php

# 2
php spark make:controller Master/Mahasiswa --suffix

CodeIgniter v4.2.1 Command Line Tool - Server Time: 2022-07-03 06:06:39 UTC-05:00

File created: APPPATH/Controllers/Master/MahasiswaController.php
```

Flag `--suffix` akan membantu kita membuat sebuah *controller* tanpa harus mengetikkan "Controller" secara eksplisit ke parameter nama.

## *Bare Controller*
*Bare Controller* adalah sebuah *controller* kosong, teman-teman bisa mengisi metode dari *controller* ini sesuka hati. **Gunakan *Bare Controller* jika teman-teman tidak menggunakan *service* atau *helpers* tambahan secara *default***.

Kenapa? Karena ada perbedaan secara fundamental dari *controller* yang dibuat dengan *flag* `--bare` dan tanpa `--bare`. Apa perbedaannya? Mari kita lihat.

```php
<?php

// Dibuat dengan perintah `php spark make:controller ABare --bare --suffix`
namespace App\Controllers;

use CodeIgniter\Controller;

class ABareController extends Controller
{
    public function index()
    {
        //
    }
}

```

Lalu
```php
<?php
// Dibuat dengan perintah `php spark make:controller WithoutBareFlag --suffix`
namespace App\Controllers;

use App\Controllers\BaseController;

class WithoutBareFlagController extends BaseController
{
    public function index()
    {
        //
    }
}
```

Perbedaan dari kedua *controller* di atas adalah penggunaan ekstensi dari *Parent Controller*. *Controller* yang menggunakan *flag* `--bare` akan menggunakan *controller* bawaan dari CI4 yaitu `CodeIgniter\Controller`, sementara *controller* yang tidak menggunakan flag `--bare` akan menggunakan `App\Controllers\BaseController`.

Lalu apa perbedaannya? Perbedaannya adalah, `CodeIgniter\Controller` adalah *class* utama *controller* di CI4, sementara `App\Controllers\BaseController` adalah *class* yang meng-*extends* `CodeIgniter\Controller`.

Jadi secara *default*, tidak ada perbedaan yang mendasar. Namun akan terdapat perbedaan jika Anda ingin "menerapkan sebuah *helper* atau *service* secara *default* di semua *controller*". Seperti contoh jika teman-teman ingin menggunakan *helper* `html` dan `text` secara di seluruh *controller*:

```php
<?php
// app/Controllers/BaseController.php
namespace App\Controllers;

use CodeIgniter\Controller;

abstract class BaseController extends Controller
{
    // ...    

    protected $helpers = ['html', 'text'];

    // ...
```

Atau contoh lain jika teman-teman ingin membuat sebuah *property* `session` yang bisa diakses secara umum di semua *controller*:

```php
<?php
// app/Controllers/BaseController.php
namespace App\Controllers;

use CodeIgniter\Controller;

abstract class BaseController extends Controller
{
    // ...

    /**
     * @var \CodeIgniter\Session\Session;
     */
    protected $session;

    public function initController(/* ... */)
    {
        // Do Not Edit This Line
        parent::initController($request, $response, $logger);

        $this->session = \Config\Services::session();
    }
}
```

Catatan: **Jangan pernah mengedit file yang ada pada folder *system* bawaan CI4, jika ingin merubah *behaviour* dari sebuah *class*, buatlah sebuah *child class* yang meng-*extends* class tersebut. Biarkan *script* murni tanpa adanya modifikasi**.

## *Restful Controller*
*Restful Controller* adalah sebuah *controller* yang didalamnya sudah terdapat berbagai macam metode yang bisa langsung digunakan untuk rute `resource` atau `presenter` (silahkan baca tulisan sebelumnya yang berjudul [Standarisasi CI4 - Routing](https://shiroyuki.dev/blog/standarisasi-ci4--routing) untuk detail lebih lanjut mengenai rute `resource` atau `presenter`).

Ada 2 tipe *Restful Controller*, *Resource Controller* dan *Presenter Controller*

### *Resource Controller*
*Resource Controller* lebih cocok digunakan untuk pengembang yang sedang membuat REST API karena adanya kesesuaian metode-metode yang di-*generate* dengan `$routes->resource()`.

Cara membuat *Resource Controller* adalah `php spark make:controller User --suffix --restful controller`. Secara otomatis, perintah ini akan membuat sebuah *controller* yang meng-*extends* `CodeIgniter\RESTful\ResourceConroller`:
```php
<?php
// app/Controllers/UserController
namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class UserController extends ResourceController
{
    public function index() { }

    public function show($id = null) { }

    public function new() { }

    public function create() { }

    public function edit($id = null) { }

    public function update($id = null) { }

    public function delete($id = null) { }
}

```

### *Presenter Controller*
*Presenter Controller* lebih cocok digunakan untuk pengembang yang sedang membuat fitur CRUD pada sebuah modul melalui website karena *controller* ini sesuai dengan metode-metode yang diimplementasikan oleh `$routes->presenter()`.

Cara membuat sebuah *Presenter Controller* adalah dengan menjalankan perintah `php spark make:controller User --suffix --restful presenter`. Secara otomatis, perintah ini akan membuat sebuah *controller* yang meng-*extends* `CodeIgniter\RESTful\ResourcePresenter`:

```php
<?php
// app/Controllers/UserController
namespace App\Controllers;

use CodeIgniter\RESTful\ResourcePresenter;

class UserController extends ResourcePresenter
{
    public function index() { }

    public function show($id = null) { }

    public function new() { }

    public function create() { }

    public function edit($id = null) { }

    public function update($id = null) { }

    public function remove($id = null) { }

    public function delete($id = null) { }
}
```

#### Daftar Pustaka
- *Extending the Controllers* dari [Dokumentasi CI4](https://codeigniter4.github.io/CodeIgniter4/extending/basecontroller.html).
- Pengalaman menggunakan CI4 selama 6 bulan.
