---
title: "Manual Book Pugugo"
date: 2024-03-06T06:40:00+07:00
tags: ["tutorial", "pugugo", "akatekno"]
draft: true
---

Pugugo adalah suatu sistem yang dapat digunakan oleh Korporat sebagai media pembagian lowongan kerja, serta dapat digunakan oleh Pelamar untuk melamar suatu pekerjaan pada suatu korporat / perusahaan. Aplikasi ini memiliki beberapa modul yang masing-masing akan dijelaskan pada bagiannya tersendiri.


## Autentikasi

Autentikasi adalah proses untuk memverifikasi identitas pengguna atau sistem. Dalam bahasa yang lebih sederhana, autentikasi bertujuan untuk memastikan bahwa pengguna yang mencoba mengakses sesuatu adalah orang yang berhak melakukannya.

Mirip dengan verifikasi identitas di dunia nyata, misalnya saat penjagaan keamanan meminta kartu identitas pengunjung, autentikasi digital berfungsi untuk meminimalisir akses yang tidak sah ke informasi atau sistem sensitif. Proses ini menjadi langkah awal yang krusial dalam menjaga keamanan data dan mencegah penyalahgunaan informasi.


### Login / Masuk

![](./auth/login.png)

Modul ini memungkinkan pengguna yang sudah terdaftar untuk dapat masuk ke aplikasi dengan memberikan data Email dan Kata Sandi. Pada halaman ini terdapat beberapa pintasan untuk dapat masuk melalui akun Google, atau GitHub; serta terdapat juga pintasan untuk mengakses halaman Lupa Kata Sandi jika suatu saat pengguna melupakan kata sandinya.


### Daftar / Registrasi

Registrasi mengacu pada proses verifikasi identitas pengguna baru yang ingin mendaftarkan akun di aplikasi. Proses ini melibatkan beberapa langkah dan terbagi menjadi dua:

#### **Daftar Sebagai Pelamar**

![](./auth/register-pelamar.png)

Untuk dapat mendaftar sebagai pelamar, akan terdapat beberapa inputan yang harus diisi yaitu:
1. Nama Lengkap - diisi dengan nama lengkap pengguna.
2. Email - diisi dengan email yang valid karena akan digunakan untuk verifikasi.
3. Kata Sandi - diisi dengan Kata Sandi yang aman, kuat, serta mudah diingat.
4. Konfirmasi Kata Sandi - diisi persis dengan inputan Kata Sandi.
5. Referral Code (opsional) - diisi dengan kode referral pengguna lain yang memiliki Premium Plan.

Setelah mengisi seluruh data, pengguna akan dapat mengakses sistem, namun akan terdapat pesan untuk segera memverifikasikan emailnya.
![](./auth/app-state-unverified.png)

Pengguna yang belum memverifikasikan emailnya akan memiliki akses terbatas seperti:
1. Tidak dapat melamar pekerjaan.
2. Tidak dapat mencari lowongan secara lengkap.
3. Tidak dapat melihat detail perusahaan.

Tampilan email yang akan diterima oleh pengguna dapat dilihat seperti berikut:
![](./auth/user-email-verif.png)

Setelah email diverifikasi oleh pengguna, maka pengguna tersebut dapat mengakses seluruh modul sistem yang tersedia tanpa adanya limitasi.

#### **Daftar Sebagai Korporat**

![](./auth/register-korporat-1.png)

Untuk dapat mendaftar sebagai korporat, akan terdapat dua langkah yang masing-masing memiliki beberapa inputan:

1. Informasi Personal, yang mewajibkan korporat yang mendaftar untuk mengisi identitas PIC (HRD, Pimpinan Perusahaan, atau seseorang yang berhak untuk memegang akun Pugugo). Data-data yang harus diberikan adalah:
   1. Nama Lengkap PIC - diisi dengan nama lengkap PIC.
   2. Email PIC - diisi dengan email PIC yang valid.
   3. Jenis Kelamin - pilih salah satu dengan jenis kelamin PIC yang sesuai.
   4. Jabatan - diisi dengan jabatan orang yang mendaftarkan perusahaannya.
   5. Kata Sandi - diisi dengan Kata Sandi yang aman, kuat, serta mudah diingat.
   6. Konfirmasi Kata Sandi - diisi persis dengan inputan Kata Sandi.

![](./auth/register-korporat-2.png)

2. Informasi Korporat, dengan inputan sebagai berikut:
   1. Nama Perusahaan - diisi dengan nama Perusahaan.
   2. Surat Izin Usaha - unggah SIU Perusahaan, input unggahan yang menerima file berupa gambar (jpg, png) atau PDF.
   3. KTP PIC - unggah KTP PIC akun Pugugo, input unggahan yang menerima file berupa gambar (jpg, png) atau PDF.

![](./auth/registration-verification.png)

Setelah mengisi seluruh data dengan lengkap, seperti halnya verifikasi akun pelamar, korporat akan melihat halaman verifikasi terlebih dahulu untuk dapat mengakses sistem. Akun korporat harus melakukan beberapa langkah-langkah yang terkirim pada email PIC dan memverifikasikan akunnya secara bersamaan.

![](./auth/corporate-email-verif.png)

Walaupun korporat sudah memverifikasikan emailnya secara mandiri, namun diperlukan proses verifikasi pembayaran awal, verifikasi SIU, serta pencocokan identitas KTP dengan identitas PIC yang didaftarkan ke sistem.

![](./auth/app-state-unverified-corporate.png)

Setelah Admin Pugugo sudah memverifikasikan data identitas perusahaan dan PIC secara manual, maka akun korporat tersebut dapat menerbitkan lowongan kerja yang ada di perusahaannya.

![](./auth/corporate-verified.png)

{{< alert >}}
**Penting!** Pastikan Anda bersungguh-sungguh untuk menggunakan fitur pendaftaran korporat. Ketidaksesuaian data akan berakibat pada tidak terverifikasinya akun korporat dan dapat berujung pada *blacklist* sistem kami. Kami tidak menyediakan opsi *refund* untuk pembayaran awal administratif korporat.
{{< /alert >}}

### Lupa Kata Sandi

Lupa kata sandi merujuk pada situasi di mana pengguna tidak dapat mengingat kata sandi yang digunakan untuk login ke akun mereka. Hal ini bisa terjadi karena berbagai alasan, seperti:

1. Pengguna lupa kata sandi yang sebenarnya.
2. Pengguna salah mengetikkan kata sandi.
3. Pengguna belum pernah membuat akun dan menggunakan kata sandi "default" yang diberikan oleh aplikasi.

Sebagian besar aplikasi web yang mengharuskan login menyediakan fitur "lupa kata sandi" untuk membantu pengguna yang mengalami situasi tersebut. Fitur ini biasanya berupa tautan atau tombol yang terletak di halaman login.

![](./auth/forgot-password.png)

Untuk mengatur ulang kata sandi, Anda harus memasukkan alamat email yang pernah Anda daftarkan melalui sistem. Sistem akan mengirimkan sebuah tautan yang dapat membantu Anda untuk mengatur ulang kata sandi.

![](./auth/reset-email.png)

Setelah Anda mengakses tautan yang dikirimkan ke email, Anda akan melihat sebuah halaman yang berisikan 3 inputan yaitu:
1. Email - terisi otomatis, tidak dapat diubah
2. Kata Sandi - diisi dengan kata sandi yang baru.
3. Konfirmasi Kata Sandi - diisi persis dengan inputan Kata Sandi.

![](./auth/reset-password.png)

Setelah Anda menekan tombol `Perbarui Kata Sandi`, Anda akan dialihkan kembali ke halaman Login untuk masuk ke sistem Pugugo.