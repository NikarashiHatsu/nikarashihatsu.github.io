---
title: "Catatan Belajar Juara Android 2023 - #7 USB Debugging"
date: 2023-10-13T03:00:00+07:00
tags: ["article", "android", "google", "belajar", "juara android", "kotlin", "android studio", "usb", "debugging"]
draft: false
series: ["Juara Android 2023"]
series_order: 7
---

Karena keterbatasan spesifikasi PC yang kita miliki, sering kita tidak dapat menjalankan emulator dengan lancar. Disinial dimana USB Debugging sangat membantu!

Catatan: Cara untuk mengaktifkan USB debugging berbeda-beda pada setiap merk, pastikan teman-teman mencari tutorial yang tepat dengan menggunakan bantuan [Mbah Google](https://google.com)!


## Mengaktifkan USB Debugging

Kasus yang akan Saya contohkan kali ini adalah menggunakan HP Poco X3 NFC, jadi jika teman-teman memiliki HP dengan brand sejenis, mungkin bisa *follow-along*.

1. Buka pengaturan, lalu buka **About Phone**

![](./WhatsApp%20Image%202023-10-13%20at%202.47.13%20AM.jpeg)

2. Setelah itu, tekan **MIUI version (For POCO)** berkali-kali sampai dengan teman-teman lihat notifikasi "Now you are a developer". Karena Saya sudah mengaktifkan opsi ini, notifikasinya berubah menjadi "No need, you are already a developer."

![](./WhatsApp%20Image%202023-10-13%20at%202.47.14%20AM.jpeg)

3. Kembali ke menu pengaturan awal, scroll ke paling bawah, lalu buka **Additional settings**

![](./WhatsApp%20Image%202023-10-13%20at%202.47.14%20AM%20(1).jpeg)

4. Scroll ke bawah lagi, lalu buka **Developer options**

![](./WhatsApp%20Image%202023-10-13%20at%202.47.15%20AM.jpeg)

5. Scroll sedikit ke bawah, lalu perbolehkan **USB Debugging**

![](./WhatsApp%20Image%202023-10-13%20at%202.47.15%20AM%20(1).jpeg)


## Menjalankan aplikasi ke HP melalui USB Debugging

1. Colokkan kabel USB ke PC dan HP teman-teman, dan teman-teman akan melihat dialog seperti ini. Tekan OK.

![](./WhatsApp%20Image%202023-10-13%20at%202.55.48%20AM.jpeg)

2. Di Android Studio, pastikan teman-teman menggunakan device yang sesuai, lalu klik tombol play.

![](./Screenshot%202023-10-13%20at%2002.57.21.png)

3. Tunggu *Gradle Build*, lalu teman-teman akan melihat dialog seperti ini pada HP teman-teman. Tekan Install.

![](./WhatsApp%20Image%202023-10-13%20at%202.58.46%20AM.jpeg)

4. Tada! Aplikasi terinstal!

![](./WhatsApp%20Image%202023-10-13%20at%202.58.47%20AM.jpeg)

*There you have it! See you on the next article!*
