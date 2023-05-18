---
title: "Membuat Blog Dengan Laravel? Ketahui 2 Helper Berguna Ini"
date: 2022-07-19T06:43:30+07:00
tags: ["article", "laravel", "php"]
draft: false
---

Hai, Devs! Hari ini Saya ingin sharing tentang 2 *helper* yang sangat membantu untuk membuat sebuah blog. Langsung ke inti saja.

## Slug
Pembuatan *slug* selalu digunakan pada hampir semua blog. Dari beberapa opsi URI ke detail tulisan di internet, beberapa adalah pilihannya:
1. *Date-Slug*, biasanya ditulis dalam format YYYY-mm-dd-nama-blog. Biasanya digunakan oleh penulis yang menulis banyak artikel dalam satu hari.
2. *Date*, hanya ditulis dalam format YYYY-mm-dd. Digunakan oleh penulis yang menulis satu artikel dalam satu hari, jarang digunakan.
3. *Slug*, nama artikel ditulis dalam *lowercase*, serta menggunakan pemisah tanda strip sebagai pengganti spasi. Opsi ini paling banyak digunakan karena calon audiens bisa mengetahui sebagian isi konten hanya dengan melihat URL-nya saja.
4. ID, detail artikel diambil dalam bentuk angka urut sesuai dengan apa yang disimpan pada *database*. Jarang digunakan dan juga tidak dianjurkan karena *crawler* bisa melihat berapa artikel yang ada di website tersebut. Selain itu, jika tidak ada pengaman yang diatur dalam *controller*, maka website tersebut akan rawan terkena *SQL Injection*.

Kita ambil kasus pada saat kita akan menyimpan tulisan:
```php
<?php
// app/Http/Controllers/BlogController.php

use App\Models\Blog;
use Illuminate\Http\Request;

namespace App\Http\Controllers;

class BlogController {
    // ...
    public function store(Request $request)
    {
        // ...
        $blog = new Blog;
        $blog->title = $request->title;
        // Input: Laravel 9 impact for the developers around the world
        $blog->slug = strtolower(str_replace(' ', '-', $request->title));
        // dd($blog->slug); // laravel-9-impact-for-the-developers-around-the-world
        $blog->save();
        // ...
    }
    // ...
}
```

Kita bisa mempersimpel kode kita dengan menggunakan Fasad `Str` dari Laravel. Cara menggunakannya adalah sebagai berikut:
```php
<?php
// app/Http/Controllers/BlogController.php

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

namespace App\Http\Controllers;

class BlogController {
    // ...
    public function store(Request $request)
    {
        // ...
        $blog = new Blog;
        $blog->title = $request->title;
        // Input: Laravel 9 impact for the developers around the world
        $blog->slug = Str::slug($request->title);
        // dd($blog->slug); // laravel-9-impact-for-the-developers-around-the-world
        $blog->save();
        // ...
    }
    // ...
}
```

Lebih simpel bukan? Namun jika teman-teman lebih suka menggunakan *helper* ketimbang fasad, maka teman-teman bisa menggunakan kode berikut:
```php
<?php
// app/Http/Controllers/BlogController.php

use App\Models\Blog;
use Illuminate\Http\Request;

namespace App\Http\Controllers;

class BlogController {
    // ...
    public function store(Request $request)
    {
        // ...
        $blog = new Blog;
        $blog->title = $request->title;
        // Input: Laravel 9 impact for the developers around the world
        $blog->slug = str()->slug($request->title);
        // dd($blog->slug); // laravel-9-impact-for-the-developers-around-the-world
        $blog->save();
        // ...
    }
    // ...
}
```

Tidak suka simbol `-` di URL teman-teman? Jangan khawatir, teman-teman bisa menggunakan `_` dengan menambahkannya sebagai parameter ke-2:
```php
<?php
// app/Http/Controllers/BlogController.php

use App\Models\Blog;
use Illuminate\Http\Request;

namespace App\Http\Controllers;

class BlogController {
    // ...
    public function store(Request $request)
    {
        // ...
        $blog = new Blog;
        $blog->title = $request->title;
        // Input: Laravel 9 impact for the developers around the world
        $blog->slug = str()->slug($request->title, '_');
        // dd($blog->slug); // laravel_9_impact_for_the_developers_around_the_world
        $blog->save();
        // ...
    }
    // ...
}
```
Diambil dari dokumentasi [str Helper](https://laravel.com/docs/9.x/helpers#method-str) Laravel, fungsi `str()` me-*return* sebuah instans dari `Illuminate\Support\Stringable`. Fungsi ini ekuivalen dengan `Str::of`.

> Penggunaan helper `str()` hanya tersedia pada Laravel 9 ke atas. Jika teman-teman menggunakan Laravel 8 ke bawah, gunakanlah fasad `Str`.

## Headline
Jika teman-teman membuat blog berbahasa Inggris, teman-teman akan terbantu dengan *helper* ini. `str()->headline()` mengubah huruf kecil ke huruf besar pada setiap hurufnya secara otomatis. *Helper* ini juga menghapus simbol `-` dan `_`. Sangat berguna jika teman-teman hanya menyimpan *slug*, dan tidak mempunyai kolom *title*.

Berikut adalah contohnya:
```php
<?php
// app/Http/Controllers/BlogController.php

use App\Models\Blog;
use Illuminate\Http\Request;

namespace App\Http\Controllers;

class BlogController {
    // ...
    public function store(Request $request)
    {
        // ...
        $blog = new Blog;
        // Headline input: "Create an immersive-blog using Laravel"
        $blog->title = str()->headline($request->title);
        // dd($blog->title) // "Create An Immersive Blog Using Laravel"
        $blog->slug = str()->slug($request->title);
        $blog->save();
        // ...
    }
    // ...
}
```


Sekian informasi yang bisa saya tulis, semoga bermanfaat 👋.
Thumbnail oleh [Sincerely Media](https://unsplash.com/@sincerelymedia?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) dari [Unsplash](https://unsplash.com/s/photos/blog?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText).
