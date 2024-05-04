---
title: "Prinsip SOLID #1: Single Responsibility - Brainstorming"
date: 2022-10-20T19:23:45+07:00
tags: ["article", "coding", "tech"]
draft: false
series: ["Prinsip SOLID"]
series_order: 1
---

Single responsibility berarti, suatu metode haruslah memiliki satu tanggung jawab. Tidak boleh lebih dari satu. Dikutip dari SOLID, Single Responsibility berarti sebuah kelas harus memiliki satu, dan hanya satu alasan untuk diubah.

## Studi kasus.

Anggaplah kita membuat suatu aplikasi POS, **********************Bapak Harry********************** menginginkan sebuah laporan penjualan yang akan di-export ke bentuk CSV. Simpel saja, kita buat seperti ini:

```php
<?php

namespace App\Reports;

use Illuminate\Support\Facades\DB;

class SaleReport
{
	public function export(): string
	{
		$sales = DB::table('sales')->latest()->get();

		return 'CSV format';
	}
}
```

Tapi, pak Harry ingin data bisa di-export pada rentang tanggal waktu tertentu, bukan data terakhir saja. Yah, karena permintaan client bisa berubah sewaktu-waktu, kita lakukan perubahan menjadi seperti ini:

```php
<?php

namespace App\Reports;

use Illuminate\Support\Facades\DB;

class SaleReport
{
	public function export(
		string $dateStart,
		string $dateEnd
	): string {
		$sales = DB::table('sales')
			->whereBetween('created_at', [$dateStart, $dateEnd])
			->get();

		return 'CSV format';
	}
}
```

Revisi di-acc, dan kita bisa istirahat untuk hari ini. Keesokan harinya, setelah bangun tidur, cek notifikasi “Eh, tambahin bentuk export untuk format lain ya. Usahakan bisa PDF, Excel, dan JSON”. Waduh nambah kompleks dong kelas `SaleReport` kita. Ya sudahlah gak apa-apa, kita ngoding lagi:

```php
<?php

namespace App\Reports;

use Illuminate\Support\Facades\DB;

class SaleReport
{
	public function export(
		string $dateStart,
		string $dateEnd,
		string $format = 'csv'
	): string {
		$sales = DB::table('sales')
			->whereBetween('created_at', [$dateStart, $dateEnd])
			->get();

		if ($format == 'pdf') {
			return 'PDF format';
		}

		if ($format == 'xls') {
			return 'XLS format';
		}

		if ($format == 'json') {
			return 'JSON format';
		}

		return 'CSV format';
	}
}
```

Lho he? Kok jadi panjang banget kelas `SaleReport` kita? Apalagi metode `export()` kita punya banyak tanggung jawab, mulai dari mengabil data `sales`, ngambil data berdasarkan tanggal, nge-export data pula. Ada 3 tanggung jawab yang metode `export()` miliki. Kita harus refaktor kode ini biar jadi rapih.

### Prinsip [S]ingle Responsibility. Satu kelas atau metode hanya memiliki satu tanggung jawab.

Kita bagi menjadi dua kategori kelas:

- Kelas untuk mengambil data, `SaleReport`
- Kelas untuk meng-eksport data, `xExport`

Pertama, kita mulai dengan memindahkan script untuk meng-export data ke masing-masing file berbeda:

```php
<?php

namespace App\Reports;

use Illuminate\Support\Collection;

class PdfExport
{
	public function export(Collection $saleData): string
	{
		return 'PDF export';
	}
}
```

```php
<?php

namespace App\Reports;

use Illuminate\Support\Collection;

class XlsExport
{
	public function export(Collection $saleData): string
	{
		return 'XLS export';
	}
}
```

```php
<?php

namespace App\Reports;

use Illuminate\Support\Collection;

class JsonExport
{
	public function export(Collection $saleData): string
	{
		return 'JSON export';
	}
}
```

```php
<?php

namespace App\Reports;

use Illuminate\Support\Collection;

class CsvExport
{
	public function export(Collection $saleData): string
	{
		return 'CSV export';
	}
}
```

Kedua, kita refaktor kelas `SaleReport` menjadi seperti ini:

```php
<?php

namespace App\Reports;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SaleReport
{
	public function between(
		string $dateStart,
		string $dateEnd
	): Collection {
		return DB::table('sales')
			->whereBetween('created_at', [$dateStart, $dateEnd])
			->get();
	}
}
```

Lihat perubahan metode `export` menjadi `between`. Karena kelas `SaleReport` bertanggung jawab untuk mengambil data saja, maka “mengambil data dari rentang waktu sekian hingga sekian” adalah salah satu tanggung jawab yang benar.

> Tapi, apakah satu kelas hanya boleh memiliki satu metode saja?
> 

Tentu saja tidak. Kita bisa menambahkan beberapa metode lain, **NAMUN** tetap memiliki tanggung jawab sebagai “mengambil data”. Contohnya bagaimana? Anggap saja pak Harry menginginkan data berdasarkan Bulan, dan Tahun secara spesifik.

```php
<?php

namespace App\Reports;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SaleReport
{
	public function between(
		string $dateStart,
		string $dateEnd
	): Collection {
		return DB::table('sales')
			->whereBetween('created_at', [$dateStart, $dateEnd])
			->get();
	}

	public function forYear(int $year): Collection {
		return DB::table('sales')
			->whereYear('created_at', $year)
			->get();
	}

	public function forMonth(int $month): Collection {
		return DB::table('sales')
			->whereMonth('created_at', $month)
			->get();
	}
}
```

Sekarang kita memiliki beberapa file sebagai berikut:

```php
🗂 app/
└── 🗂 Reports/
    ├── 📁 SaleReport.php/
    │   ├── #between(string $dateStart, string $dateEnd): Collection
    │   ├── #forYear(int $year): Collection
    │   └── #forMonth(int $month): Collection
    ├── 📁 PdfExport.php/
    │   └── #export(Collection $saleData): string
    ├── 📁 XlsExport.php/
    │   └── #export(Collection $saleData): string
    ├── 📁 JsonExport.php/
    │   └── #export(Collection $saleData): string
    └── 📁 CsvExport.php/
        └── #export(Collection $saleData): string
```

Nah, sekarang kita memiliki kelas `SaleReport` yang memiliki tanggung jawab **********HANYA********** mengambil data penjualan. Lalu bagaimana kita mengaplikasikan kode yang telah kita tulis?

### Pengaplikasian prinsip [S]ingle Responsibility

Anggap saja kode kita berjalan pada suatu route:

```php
<?php

use App\Reports\SaleReport;
use App\Reports\CsvExport;
use Carbon\Carbon;
use Illuminate\Support\Facades\Route;

Route::get('/', function() {
	$saleReport = new SaleReport();
	$csvExport = new CsvExport();

	return $csvExport->export([
		$saleReport->between([
			Carbon::now()->subYear(),
			Carbon::now()
		])
	); // returns: 'CSV export'
});
```

Bisa dilihat kode kita jauh lebih rapi dibandingkan dengan kode yang kita tulis sebelum refaktor.

### Daftar Pustaka
Thumbnail oleh [Mitchell Luo](https://unsplash.com/@mitchel3uo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) dari [Unsplash](https://unsplash.com/s/photos/code?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
