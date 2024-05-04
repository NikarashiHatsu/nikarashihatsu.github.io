---
title: "Prinsip SOLID #1: Single Responsibility - Laravel Example"
date: 2022-10-20T19:26:40+07:00
tags: ["article", "coding", "laravel", "tech"]
draft: false
series: ["Prinsip SOLID"]
series_order: 2
---

Oke, kita sudah belajar bagaimana prinsip Single Responsibilty secara abstrak. Sekarang kita coba implementasikan ke framework PHP tercinta, Laravel.

## Studi Kasus

Anggaplah kita memiliki sebuah controller `PostController`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PostController
{
	public function store(Request $request): Response
	{
		$request->validate([
			'title' => ['required', 'min:20', 'max:100'],
			'body' => ['required'],
		]);

		Post::create($request->only('title', 'body'));

		return redirect()
			->route('post.index')
			->withMessage('Post created successfully');
	}
}
```

Awalnya, controller ini sangatlah simpel, sehingga metode `store()` memiliki 3 tanggung jawab: memvalidasi data, menyimpan data, dan mengirimkan umpan balik berupa redirect dengan pesan.

Namun bagaimana jika kita juga harus mengirimkan notifikasi kepada pengguna yang sudah berlangganan kepada aplikasi yang kita buat? Bagaimana jika kita butuh menyimpan gambar juga? Jika kedua tanggung jawab itu berada pada suatu metode `store()`, maka secara langsung metode ini memiliki 5 tanggung jawab.

Lalu bagaimana kita memisahkan meringankan tanggung jawab metode `store()` ini?

### Langkah 1: Memisahkan Validator ke Request class

Laravel memiliki sebuah namespace class khusus yang digunakan sebagai Validator. Yaitu `Request` class. Kita bisa membuatnya dengan cara menjalankan command Artisan `php artisan make:request StorePostRequest`.

Naming convention yang digunakan Laravel untuk `Request` class adalah `[Method][Model]Request`. Contoh lain jika kita ingin melakukan update, maka `Request` class yang akan kita bangun adalah `UpdatePostRequest`.

Kita pindahkan fungsi validasi yang ada di `PostController#store` ke `StorePostRequest#rules`. Hasilnya adalah seperti berikut:

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
	/**
	 * Determine if user is authorized to make this request.
	 *
	 * @return bool
   */
	public function authorize()
	{
		return false;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		return [
			'title' => ['required', 'min:20', 'max:100'],
			'body' => ['required'],
		];
	}
}
```

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Http\Requests\StorePostRequest;
use Illuminate\Http\Response;

class PostController
{
	// `Request $request` berubah menjadi `StorePostRequest $request`
	public function store(StorePostRequest $request): Response
	{
		Post::create($request->only('title', 'body'));

		// Blok kode menyimpan gambar

		// Blok kode mengirimkan email kepada pelanggan

		return redirect()
			->route('post.index')
			->withMessage('Post created successfully');
	}
}
```

Nah, kita telah meringankan sedikit beban metode `store()`. Selanjutnya adalah…

### Langkah 2: Membuat class Service (layanan) untuk model Post

Terminologi Service disini adalah suatu class yang berfungsi untuk mengolah data yang masuk melalui `Request`. Tidak ada naming convention untuk Service pada Laravel, jadi kita buat manual saja di `\App\Services\PostService.php`.

```php
<?php

namespace App\Services;

class PostService
{
	public static function store(array $data): void
	{
		Post::create($data);

		// Blok kode menyimpan gambar

		// Blok kode mengirimkan email kepada pelanggan
	}
}
```

Karena metode `store` dari `PostService` adalah metode statis, maka kita bisa langsung memanggilnya pada `PostController` sebagai berikut:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Http\Requests\StorePostRequest;
use App\Services\PostService;
use Illuminate\Http\Response;

class PostController
{
	public function store(StorePostRequest $request): Response
	{
		PostService::create($request->only('title', 'body'));

		return redirect()
			->route('post.index')
			->withMessage('Post created successfully');
	}
}
```

Nah sekarang, metode `store` dari `PostController` memiliki 1 tanggung jawab. Ia hanya bertanggung jawab untuk me-redirect ke rute `post.index`. Anda juga bisa menambahkan `try-catch` untuk mengantisipasi error yang akan ada.

Namun, metode `store` dari `PostService` memiliki 3 tanggung jawab. Secara prinsip SOLID, blok kode “Menyimpan Gambar” serta blok kode “Mengirim email kepada pelanggan” harus dipisah ke file tersendiri.

Saya tidak akan menjelaskan secara lengkap kode dari kedua Service yang akan dipisah, namun kurang lebih struktur barunya adalah sebagai berikut:

```php
🗂 app/
├── 🗂 Http/
│   └── 🗂 Controllers/
│       └── 📁 PostController/
│           └── #store(StorePostRequest $request): Response
├── 🗂 Notifications/
│   └── 📁 NewPostNotification/
│       ├── #__construct(): void
│       ├── #via(mixed $notifiable): array
│       ├── #toMail(mixed $notifiable): MailMessage
│       └── #toArray(mixed $notifiable): array
└── 🗂 Services/
    ├── 📁 PostService/
    │   └── #::create(array $data): void
    └── 📁 ImageService/
        └── #::upload(UploadedFile $file): void
```

Begitulah kurang lebih penerapan prinsip SOLID yang pertama yaitu Single Responsibility. Terima kasih sudah membaca!

### Daftar Pustaka
Thumbnail oleh [Mitchell Luo](https://unsplash.com/@mitchel3uo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) dari [Unsplash](https://unsplash.com/s/photos/code?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
