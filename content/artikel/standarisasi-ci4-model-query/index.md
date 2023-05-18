---
title: "Standarisasi CI4 - Model Query"
date: 2022-07-04T12:15:32+07:00
tags: ["article", "codeigniter", "php"]
draft: false
series: ["Standarisasi CI4"]
series_order: 2
---

Hai, kembali lagi di seri tulisan "Standarisasi CI4". Kali ini kita akan membahas tentang *query builder* yang terdapat pada CI4. Selama ini, Saya melihat penggunaan model pada CI4 ini tidak terarah. Ada yang pakai *native SQL* di *class model*-nya, ada yang nge-*query* secara *native* di *Controller*, wah banyak deh yang bisa bikin Model ini acak-acakan.

Berikut adalah cuplikan kode dari sebuah *project legacy* yang Saya *maintain*:
```php
<?php
// app/Models/SebuahModel.php
class SebuahModel extends Model {
    public function daftarData($id) {
        $sql = "SELECT * FROM table WHERE id = ? ORDER BY col1, col2";
        return $this->db->query($sql, $id);
    }
}
```

Setelah ngeliat kode di atas, secara spontan Saya langsung *hadeh, kebiasaan*. Tapi gimana lagi ya, Saya punya standar kode tersendiri untuk setiap *Framework*, dan CI4 bukanlah pengecualian. Jadi, ayo kita ulik apa yang salah, dan kembali ke kaidah per-CI-an yang benar dan lurus.

## Naming Convention
Seperti halnya *controller* serta modul-modul lain, *model* juga memerlukan *suffix*. *Suffix* di CI4 ini ibarat sebuah identitas untuk menyatakan bahwa *class* ini adalah bagian dari sebuah modul. Contohnya, `BlogController` adalah sebuah *controller* yang bernama Blog, lalu `AuthenticationFilter` adalah sebuah *filter* yang digunakan untuk autentikasi.

Sama halnya dengan modul lain, Model haruslah memiliki sebuah *suffix* untuk membedakan bahwa ia adalah sebuah *model*, bukan sebuah *controller* ataupun *filter*.

Untuk membuat sebuah model dengan *suffix* `Model`, teman-teman memiliki 2 opsi:
1. Dengan menuliskan nama secara eksplisit, seperti contoh `php spark make:model UserModel`; atau
2. Dengan menggunakan *flag* `--suffix`, seperti contoh `php spark make:model User --suffix`.

Keduanya adalah perintah yang valid untuk membuat sebuah model bernama `UserModel`.

## Gunakan *Command* untuk men-*generate* Model.
Jujur, Saya kurang suka ketika pada suatu projek CI4, pengembang tidak menggunakan *Spark* untuk membuat `filter`, `migration`, `controller`, bahkan di kasus ini `model` pun sampai dibikin manual. Mungkin karena terbawa suasana CI3 yang serba manual ya? Atau tidak mengetahui fitur `spark` ini?

Berhubung teman-teman udah ada disini, yuk sekalian kita belajar cara membuat model dengan menggunakan `Spark`. Untuk membuat sebuah model, kita jalankan `php spark make:model NamaModel`, sebagai contoh:
```bash
php spark make:model User --suffix

CodeIgniter v4.2.1 Command Line Tool - Server Time: 2022-07-02 03:38:01 UTC-05:00

File created: APPPATH/Models/UserModel.php
```

Nah, perintah di atas akan membuat satu model bernamakan User, ayo kita cek apa isi di dalamnya:
```php
<?php
// app/Models/UserModel.php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'users';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];
}
```

"Buset, Ghits, kok banyak banget isinya? Kita sih nggak perlu kode-kode ini kali," iya, tapi bentar dulu Saya jelasin sedikit, biar temen-temen juga paham. Kita akan pakai model ini sebagai contoh. Akan Saya hapus beberapa kode yang tidak diperlukan untuk demo ini.

Untuk  kali ini, kita tidak membutuhkan *section* *Callback*, dan *Dates*. Jadi akan kita hapus kedua *section* tersebut untuk mempersingkat kode. Juga, akan Saya hapus beberapa property yang secara otomatis diatur oleh CI4, jadi kurang lebih seperti ini hasilnya:
```php
<?php
// app/Models/UserModel.php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table                = 'users';
    protected $returnType           = 'array';
    protected $allowedFields        = [];
    protected $validationRules      = [];
    protected $validationMessages   = [];
}
```

Yuk kita bahas satu-per-satu tentang *property-property* yang ada:
1. `$table` mengatur nama tabel yang dipakai oleh model.
2. `$returnType` mengatur tipe keluaran pada saat kita menggunakan fungsi `find()` atau `findAll()`. Bisa diisi dengan `array` atau `object`.
3. `$allowedFields` mengatur kolom-kolom apa saja yang boleh digunakan untuk diinput ke dalam tabel `users`.
4. `$validationRules` mengatur validasi terhadap kolom-kolom yang digunakan.
5. `$validationMessages` mengatur pesan-pesan ketika terjadi *error* pada saat memvalidasi data yang diinput.

*Fair enough* ya? Yuk kita mulai gimana cara ngeimplementasiin kode ini, mengikuti standar yang Saya pakai.

## Atur *property* `$returnType` ke 'object'
Gunanya adalah, supaya kita bisa menggunakan *arrow function* karena data yang di-*return* adalah berbentuk objek, bukan array. Bagi yang belum tahu, kode penggunaan *arrow function* adalah seperti ini:
```php
<?php
// Objek
echo $user->name;

// Array
echo $user['name'];
```

Secara pribadi, penggunaan *arrow function* ini lebih menghemat kode, karena untuk mengakses suatu data, kita hanya perlu menggunakan `->property`, bukan `['property']`. Lumayan lah, ngehemat 2 karakter juga. Kita akan coba implementasikan penggunaan model ini menjadi lebih singkat.

Jadi, pada model yang kita buat tadi, kita atur:
```php
<?php
// app/Models/UserModel.php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table                = 'users';
    protected $returnType           = 'object';
    protected $allowedFields        = [];
    protected $validationRules      = [];
    protected $validationMessages   = [];
}
```

Kita akan bahas *property* `$allowedFields`, `$validationRules`, dan `$validationMessages` lebih lanjut nanti.

## Implementasi Model pada Controller
Nah, jika teman-teman baca tulisan kemarin Saya yang berjudul [Standarisasi CI4 - Routing](https://shiroyuki.dev/blog/standarisasi-ci4--routing) dan [Standarisasi CI4 - Controller](https://shiroyuki.dev/blog/standarisasi-ci4--controller), teman-teman pasti menyadari bahwa `$route->presenter` akan sedara otomatis meng-*assign* 8 metode (7 metode untuk `$route->resource`) yang digunakan pada Controller kan? Jika lupa, berikut metode-metode yang diassign:
1. GET `index`
2. GET `show/$1`
3. GET `new`
4. POST `create`, atau bisa juga pakai POST `/`
5. GET `edit/$1`
6. POST `update/$1`
7. GET `remove/$1` (tidak ada di `$route->resource`)
8. POST `delete/$1`

Kita akan mencoba mengimplementasikan *best-pratice* dari model yang telah kita buat ke masing-masing metode di controller tersebut. **Implementasi *query builder* pada *controller* menurut Saya adalah *best practice* dari CI4. Penggunaan bisa bervariasi tergantung masing-masing pengembang**.

### Implementasi pada `index()`
Metode `index()` pada sebuah *controller*, biasanya mengembalikan sebuah *view* yang berisi seluruh data yang tersedia pada sebuah tabel.
```php
<?php
// app/Controllers/UserController.php
namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourcePresenter;

class UserController extends ResourcePresenter
{
    public function index() {
        return view('users/index', [
            'users' => (new UserModel())->findAll(),
        ]);
    }
}
```

Agak asing? Atau sudah pernah pakai? Intinya, seluruh *query* dilakukan langsung di *controller*, bukan di dalam *model*. Nanti kita akan bahas kenapa kita juga butuh *query* di dalam model di akhir artikel.

### Implementasi pada `show()`
Metode `show()` biasanya menampilkan sebuah detail dari suatu model. Jika `index()` hanya menampilkan seluruh data secara singkat, makan `show()` ini digunakan untuk menampilkan **salah satu data** secara detail.

Berikut adalah implementasinya:
```php
<?php
// app/Controllers/UserController.php
namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class UserController extends ResourceController
{
    public function show($id = null) {
        if ((new UserModel())->find($id) === null) return "Data tidak ditemukan";

        return view('users/show', [
            'user' => (new UserModel())->find($id),
        ]);
    }
}
```

Karena *model* pada CI4 tidak memiliki metode `findOrFail()` secara default, maka simpelnya, kita butuh mengecek dulu apakah data tersebut ada di *database*, jika tidak ada maka tampilkan pesan "Data tidak ditemukan". Contoh di atas adalah contoh kasar, implementasi kode mungkin berbeda untuk tiap projek.

### Implementasi pada `new()`
Sebenarnya tidak ada yang perlu diimplementasi pada metode ini selain kita hanya butuh mereturn *instance* dari `view()`. Namun ada kalanya kita ingin menampilkan beberapa data untuk sebuah *dropdown* atau pilihan
```php
<?php
// app/Controllers/UserController.php
namespace App\Controllers;

use App\Models\ProvinceModel;
use App\Models\UserModel;
use CodeIgniter\RESTful\ResourcePresenter;

class UserController extends ResourcePresenter
{
    public function new() {
        return view('users/new', [
            'provinces' => (new ProvinceModel)->findAll(),
        ]);
    }
}
```

### Implementasi pada `create()`
Nah disinilah dimana beberapa akan diimplementasi. Pertama kita akan mengatur `$allowedFields`, `$validationRules` dan `$validationMessages` pada *model*, lalu kita akan menggunakan *try-catch block* pada saat menyimpan data.

Anggap saja pada tabel *users* kita memiliki kolom sebagai berikut:
```bash
mysql> describe users;
+------------+--------------+------+-----+-------------------+-------------------+
| Field      | Type         | Null | Key | Default           | Extra             |
+------------+--------------+------+-----+-------------------+-------------------+
| id         | int          | NO   | PRI | NULL              | auto_increment    |
| email      | varchar(255) | NO   | UNI | NULL              |                   |
| name       | varchar(255) | NO   |     | NULL              |                   |
| password   | varchar(255) | NO   |     | NULL              |                   |
| created_at | timestamp    | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at | timestamp    | YES  |     | NULL              |                   |
+------------+--------------+------+-----+-------------------+-------------------+
6 rows in set (0.03 sec)
```

Kita akan atur `$allowedFields` terlebih dahulu pada `UserModel`, kurang lebih seperti ini:
```php
<?php
// app/Models/UserModel.php
namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    // ...
    protected $allowedFields = [
        'email',
        'name',
        'password',
    ];
    // ...
}
```

Lalu, kita atur `$validationRules` dan `$validationMessages` seperti ini:
```php
<?php
// app/Models/UserModel.php
namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    // ...
    protected $validationRules = [
        'email'                 => 'required|valid_email|is_unique[users.email,id,{id}]',
        'name'                  => 'required|alpha_numeric_space|min_length[3]',
        'password'              => 'required|min_length[8]',
        'password_confirmation' => 'required_with[password]|matches[password]',
    ];
    protected $validationMessages = [
        'email' => [
            'valid_email'   => 'Email harus memiliki format yang valid.',
            'is_unique'     => 'Maaf, email sudah terdaftar. Silahkan coba menggunakan email lain.',
        ],
        'name' => [
            'min_length'    => 'Panjang minimal untuk nama adalah {param} karakter.',
        ],
        'password' => [
            'min_length'    => 'Panjang minimal untuk password adalah {param} karakter.',
        ],
        'password_confirmation' => [
            'matches'       => 'Password tidak sama.',
        ],
    ];
    // ...
}
```

Pelajari lebih lengkap tentang *validation* di dokumentasi CI4 bagian [Validation](https://codeigniter4.github.io/CodeIgniter4/libraries/validation.html).

Nah setelah mengatur semua itu pada model, langsung saja kita implementasikan pada *controller*, berikut kodenya:
```php
<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourcePresenter;

class UserController extends ResourcePresenter
{
    public function create() {
        try {
            $user = new UserModel();
            $data = $this->request->getPost(['name', 'email', 'password', 'password_confirmation']);

            if ($user->insert($data) === false) {
                return redirect()->back()->with('errors', $user->errors());
            }
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Gagal menambahkan data: ' . $th->getMessage());
        }

        return redirect()->back()->with('success', 'Berhasil menambahkan data');
    }
}
```

Ya, akan ada 3 *return* yang diskenariokan.
1. *Return* ketika *model* gagal menyimpan data karena validasi gagal. Validasi akan dijalankan secara otomatis pada saat menjalankan fungsi `insert()`, `update()`, atau `save()`.
2. *Return* ketika terjadi *error* pada server atau secara *syntax* pada bagian blok `catch`.
3. *Return* ketika *model* berhasil menyimpan data.

**Catatan: kode di atas bukanlah kode terbaik untuk menyimpan User, karena *password* akan disimpan secara *plaintext*. Untuk menyimpan *password* yang secara otomatis ter-enkripsi, teman-teman perlu mengatur bagian *callback* pada model.**

```php
<?php
// app/Models/UserModel.php
namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    // ...
    protected $allowCallbacks = true;
    protected $beforeInsert   = ['hash_password'];
    protected $beforeUpdate   = ['hash_password'];

    protected function hash_password(array $properties)
    {
        if (!isset($properties['data']['password'])) {
            return $properties;
        }

        $properties['data']['password'] = password_hash($properties['data']['password'], PASSWORD_DEFAULT);

        return $properties;
    }
    // ...
}
```

Kode di atas akan mengenkripsi *password* pada saat **menambahkan** dan **memperbarui** data.

### Implementasi pada `edit()`
Sama halnya seperti `new()`, hanya saja disini kita harus mengambil data model terlebih dulu. Disini gabungkan kode dari `show()` serta `new()`. Pertama kita harus mengecek dulu apakah model dengan id yang dicari tersedia atau tidak, jika tersedia, maka *return* sebuah *view*.
```php
<?php
// app/Controllers/UserController.php
namespace App\Controllers;

use App\Models\ProvinceModel;
use App\Models\UserModel;
use CodeIgniter\RESTful\ResourcePresenter;

class UserController extends ResourcePresenter
{
    public function edit($id = null) {
        if ((new UserModel())->find($id) === null) return "Data tidak ditemukan";

        return view('users/new', [
            'provinces' => (new ProvinceModel())->findAll(),
            'user' => (new UserModel())->find($id),
        ]);
    }
}
```

### Implementasi pada `update()`
Untuk kode `update`, ini lumayan panjang karena ada beberapa lapisan yang harus divalidasi.
```php
<?php
// app/Controllers/UserController.php
namespace App\Controllers;

use App\Models\ProvinceModel;
use App\Models\UserModel;
use CodeIgniter\RESTful\ResourcePresenter;

class UserController extends ResourcePresenter
{
    public function update($id = null) {
        if ((new UserModel())->find($id) === null) return "Data tidak ditemukan";

        try {
            $user = new UserModel();
            $data = $this->request->getPost(['name', 'email']);
            $data['id'] = $id;

            // Memperbarui password
            if (
                $this->request->getPost('password') !== ""
                && $user->update($id, $this->request->getPost(['password', 'password_confirmation'])) === false
            ) {
                return redirect()->back()->with('errors', $user->errors());
            }

            // Memperbarui data
            if ($user->update($id, $data) === false) {
                return redirect()->back()->with('errors', $user->errors());
            }
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Gagal memperbarui data: ' . $th->getMessage());
        }

        return redirect()->back()->with('success', 'Berhasil memperbarui data');
    }
}
```

Kode di atas jika dijelaskan kurang lebih seperti ini:
1. Mengecek apakah data ada pada *database*;
2. Meng-*assign* data yang ada pada `$this->request` ke variabel `$data`, lalu memasukkan `id` untuk menghindari *error* pada saat *unique validation*. Bisa teman-teman baca terkait ini di bagian [Validation Placeholder](https://codeigniter4.github.io/userguide/libraries/validation.html#validation-placeholders).
3. Memperbarui *password* jika kolom *password* diisi ada.
4. Memperbarui data *user*.

### Implementasi pada `remove()`
Kurang lebih sama seperti `show()`, implementasi *view* `remove()` kurang lebih hanya menampilkan *form* pesan konfirmasi seperti *Apakah Anda yakin ingin menghapus User atas nama {n}?*.
```php
<?php
// app/Controllers/UserController.php
namespace App\Controllers;

use App\Models\ProvinceModel;
use App\Models\UserModel;
use CodeIgniter\RESTful\ResourcePresenter;

class UserController extends ResourcePresenter
{
    public function remove($id = null) {
        if ((new UserModel())->find($id) === null) return "Data tidak ditemukan";

        return view('users/remove', [
            'user' => (new UserModel())->find($id),
        ]);
    }
*
```

### Implementasi pada `delete()`
Metode ini digunakan untuk menghapus data. Sangat *straightforward*
```php
<?php
// app/Controllers/UserController.php
namespace App\Controllers;

use App\Models\ProvinceModel;
use App\Models\UserModel;
use CodeIgniter\RESTful\ResourcePresenter;

class UserController extends ResourcePresenter
{
    public function delete($id = null) {
        if ((new UserModel())->find($id) === null) return "Data tidak ditemukan";

        try {
            (new UserModel())->delete($id);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Gagal menghapus data: ' . $th->getMessage());
        }

        return redirect()->back()->with('success', 'Berhasil menghapus data');
    }
}
```

daaan selesai! Kita sudah berada di akhir artikel. Terima kasih untuk teman-teman yang sudah membaca seri "Menstandarisasi CI4". Masih ada beberapa tulisan di seri ini untuk kedepannya, dan tentunya akan lebih menarik lagi.

*Spoiler: modul yang akan dibahas adalah Migration, Seeder, serta Filter 👀. Stay tuned ya!*

#### Daftar Pustaka:
- Dokumentasi CI4, [Validation](https://codeigniter4.github.io/CodeIgniter4/libraries/validation.html)
- Dokumentasi CI4, [Defining Callbacks](https://codeigniter.com/user_guide/models/model.html)
