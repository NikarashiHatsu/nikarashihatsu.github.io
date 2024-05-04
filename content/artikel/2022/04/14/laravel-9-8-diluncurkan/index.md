---
title: "Laravel 9 8 Diluncurkan"
date: 2022-04-14T04:35:09+07:00
tags: ["article", "laravel", "php"]
draft: false
---

Tim Laravel telah meluncurkan v9.8, dengan fitur pengaksesan form data dari
model Eloquent, log level yang bisa dikustomisasi per-tipe eksekusi, komponen
anonim pada path custom, dll.

## Form helper "old" sekarang bisa menerima model
[Andrew Arscott](https://github.com/Drewdan) mengubah helper `old()` sehingga
bisa menerima model sebagai argumen keduanya.
```blade
{{-- Dulu --}}
<input type="text" name="name" value="{{ old('name', $user->name) }}"

{{-- Sekarang --}}
<input type="text" name="name" value="{{ old('name', $user) }}
```

## Mengizinkan Penyesuaian Tingkat Log pada Exception Handling
[Tom Witkowski](https://github.com/Gummibeer) mengkontribusikan fitur
penyesuaian tingkat log untuk Exception yang dilaporkan pada Exception Handler.
```php
use PDOException;
use Psr\Log\LogLevel;

/**
 * A list of exception types with their corresponding custom log level
 *
 * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
 */
protected $levels = [
    PDOException::class => LogLevel::CRITICAL
];
```

Lihat [Pull Request #41925](https://github.com/laravel/framework/pull/41925)
untuk detail implementasi.

## Menemukan Komponen Blade Anonim di Jalur Tambahan
[Ralph J. Smit](https://github.com/ralphjsmit) berkontribusi kemampuan untuk
menemukan komponen Blade anonim di jalur tambahan:
```php
// AppServiceProvider.php
public function boot()
{
    Blade::anonymousComponentNamespace('flights.bookings', 'flights');
}
```

Contoh penggunaan komponen:
`<x-flights::panel :flight="$flight" />`

## Metode `Set` pada Factory
[Ralph J. Smit](https://github.com/ralphjsmit) mengkontribusikan sebuah metode
`set()` kepada *model factory* untuk mengatur satu attribut pada model:
```php
// Sebelum:
EloquentModel::factory()
    ->create(['name' => 'foo']);
    
// Setelah:
EloquentModel::factory()
    ->set('name', 'foo')
    ->create();
    
// Sebelum
EloquentModel::factory()
    ->someMethod()
    ->create(['country' => 'NL']);
    
// Setelah
EloquentModel::factory()
    ->someMethod()
    ->set('country', 'NL')
    ->create();
```

## Catatan Peluncuran
Anda bisa melihat daftar fitur baru, perubahan, dan komparasi dari
[9.7.0 dan 9.8.0](https://github.com/laravel/framework/compare/v9.7.0...v9.8.0)
pada GitHub.

*Berita diambil dan diterjemahkan dari [Laravel News](https://laravel-news.com/laravel-9-8-0).*