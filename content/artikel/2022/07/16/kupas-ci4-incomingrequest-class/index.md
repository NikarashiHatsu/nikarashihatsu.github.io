---
title: "Kupas CI4: IncomingRequest Class"
date: 2022-07-16T17:56:17+07:00
tags: ["article", "codeigniter", "php"]
draft: false
---

Halo semua, lama tidak berjumpa. Akhirnya bisa nulis lagi setelah sibuk di projek lain. Kali ini Saya ingin membahas salah satu *class* yang sering digunakan di CodeIgniter. Entah apakah teman-teman sadar atau tidak, kita sering berinteraksi dengan suatu *class* bernama `IncomingRequest`. Yuk kenalan lebih dalam.

## Apa itu `IncomingRequest` *class*?
*Class* ini adalah suatu representatif berbentuk objek yang didapat dari sebuah *HTTP Request* yang dikirim dari sebuah *client*, seperti *browser* contohnya. Atau saat kalian membuat RESTful API, maka mungkin teman-teman menggunakan Postman sebagai *client*-nya. `IncomingRequest` berisi metode-metode dari `\CodeIgniter\HTTP\Request` serta `CodeIgniter\HTTP\Message`.

## Bagaimana cara menggunakan `IncomingRequest`?
Sebenarnya kita secara tidak sadar sering menggunakan *class* ini di sebuah *Controller*, dengan cara memanggil `$this->request`. Nah, *property request* ini sebenarnya sudah terinstansiasi pada `CodeIgniter\Controller`, jadi secara universal bisa diakses dari *controller* apapun.

Namun jika teman-teman bukan berada pada sebuah *controller* dan ingin mengakses isi dari `request`, contoh kasus seperti pada saat membuat suatu *service*, teman-teman bisa menggunakan kode ini:
```php
<?php

$request = \Config\Services::request();
```

## Cara menentukan tipe *request* apa yang dipakai
Asal *request* bisa dibagi menjadi beberapa tipe, diantaranya melalui AJAX atau CLI. *Request* dari kedua tipe *request* tersebut bisa dicek menggunakan metode `isAJAX()` atau `isCLI()`, keduanya me-*return boolean*.
```php
<?php

// Check for AJAX request.
if ($request->isAJAX()) {
    // ...
}

// Check for CLI Request
if ($request->isCLI()) {
    // ...
}
```

> Metode `isAJAX()` sangat bergantung pada *header* `X-Requested-With`, yang sementara tidak dikirim secara *default* oleh XHR JavaScript (contoh: fungsi `fetch`). Teman-teman bisa menambahkan *header* ini secara *manual*.

Teman-teman juga bisa mengecek metode yang dikirim dari HTTP dengan menggunakan metode `getMethod()`.
```php
<?php

// Returns 'post'
$method = $request->getMethod();
```

Secara *default*, metode ini selalu mengirimkan *value* berbentuk *lowercase*, jadi jika teman-teman butuh versi *uppercase*-nya, bisa di-*wrap* dengan metode `strtoupper`
```php
<?php

// Returns 'GET'
$method = strtoupper($request->getMethod());
```

## Mengambil data dari *Input*
Nah, ada beberapa kontroversi di komunitas CodeIgniter. Ada yang bilang bahwa "mengambil input harus dengan `getVar()` atau harus dengan `getPost`", menurut Saya pribadi, teman-teman bebas bisa menggunakan apapun yang teman-teman suka asalkan sesuai konteksnya.

Maksudnya sesuai konteks gimana? Pada suatu metode di suatu *controller*, jika metode tersebut berfokus pada *request* yang menggunakan `GET`, maka gunakanlah `$request->getGet()`. Jika terfokus pada `POST`, maka gunakanlah `$request->getPost()`.

"Semisal Saya sedang membuat RESTful API dan dari kedua metode tersebut tidak cocok seperti `PUT` atau `PATCH`, itu gimana?" gunakanlah `$request->getRawInput()`.

>Ini adalah bagian dari standarisasi kode Saya, dimana tentu saja penggunaan metode dari sebuah *class* haruslah spesifik menurut konteks. Teman-teman tetap bebas menggunakan metode manapun karena tulisan ini hanya berisi opini pribadi.

Jadi, kurang lebih perbedaannya seperti ini:

| Metode HTTP | Metode Request |
| --- | --- |
| `GET` | `$request->getGet()` |
| `POST` | `$request->getPost()` |
| `PUT/PATCH` | `$request->getRawInput()` |

Sebagai tambahan, ada beberapa kasus dimana teman-teman mengirim *request* dari kedua HTTP *method* seperti `GET` dan `POST` secara bersamaan. Bagaimana cara mengecek apakah salah satu *value* ini ada di setiap *method*? Gunakan `getGetPost()` atau `getPostGet()`:


| Metode | Keterangan |
| --- | --- |
| `$request->getGetPost()` | Mengecek `GET` dulu, lalu `POST` |
| `$request->getPostGet()` | Mengecek `POST` dulu, lalu `GET` |

### Mengambil sebuah *value* atau banyak *value*?
Tergantung pemakaian, sebagai contoh Saya biasa menggunakan *mass-insert*, jadi Saya nggak perlu capek-capek ngambil setiap data yang ada di *request*, terus diinput ke *model*:
```php
<?php
// app/Controllers/BlogController.php

class BlogController extends BaseController {
    public function store()
    {
        try {
            $data = $this->request->getPost([
                'kolom_a',
                'kolom_b',
                'kolom_c',
            ]);
            $blog = new \App\Models\BlogModel;
            
            if (!$blog->insert($data)) {
                return redirect()
                    ->back()
                    ->with('errors', $blog->errors())
                    ->withInput();
            }
        } catch (\Throwable $th) {
            return redirect()
                ->back()
                ->with('error', 'Gagal membuat blog: ' . $th->getMessage());
        }
        
        return redirect()
            ->back()
            ->with('success', 'Berhasil membuat blog');
    }
}
```

Nah, jika asumsinya nama-nama field yang ada pada *view* adalah **SAMA PERSIS** dengan kolom-kolom yang ada di tabel, maka teman-teman bisa langsung ambil datanya dari *request*. Di atas adalah contoh kasus mengambil banyak *value*, lantas bagaimana kasusnya jika ingin mengambil satu value?

Dari kasus di atas, Saya akan ambil kasus dimana Saya ingin menambahkan *thumbnail* untuk blog Saya:
```php
<?php
// app/Controllers/BlogController.php

class BlogController extends BaseController {
    public function store()
    {
        try {
            $data = $this->request->getPost([
                'kolom_a',
                'kolom_b',
                'kolom_c',
            ]);
            $blog = new \App\Models\BlogModel;

            if (!$blog->insert($data)) {
                return redirect()
                    ->back()
                    ->with('errors', $blog->errors())
                    ->withInput();
            }

            $thumbnail = $this->request->getFile('thumbnail');

            if ($thumbnail != null && $thumbnail->isValid()) {
                $blog->thumbnail = $thumbnail->store();
                $blog->save();
            }
        } catch (\Throwable $th) {
            return redirect()
                ->back()
                ->with('error', 'Gagal membuat blog: ' . $th->getMessage());
        }

        return redirect()
            ->back()
            ->with('success', 'Berhasil membuat blog');
    }
}
```

Itu saja yang bisa Saya sampaikan dalam tulisan singkat ini, untuk referensi lebih lengkap silahkan kunjungi [Dokumentasi CI4 - IncomingRequest](https://www.codeigniter.com/user_guide/incoming/incomingrequest.html). Sampai jumpa di kesempatan lain 👋.
