---
title: "Catatan Belajar Juara Android 2023 - #6 Emulator"
date: 2023-10-13T02:00:00+07:00
tags: ["article", "android", "google", "belajar", "juara android", "kotlin", "android studio", "emulator"]
draft: false
series: ["Juara Android 2023"]
series_order: 6
---

Hai! Kembali lagi di artikel #JuaraAndroid2023. Kali ini kita akan membahas tentang Emulator. Emulator ini bekerja sebagai perangkat disimulasikan pada mesin kita, jadi walaupun kita tidak memiliki HP Android, kita bisa menjalankan aplikasi yang kita bangun di PC kita langsung.

Perlu diperhatikan bahwa Emulator akan memakan resource yang cukup besar, jadi wajar jika teman-teman merasakan sebuah "Lag" atau bahkan "Stutter", jadi harap bersabar ketika menjalankan emulator karena performanya tidak akan sama dengan memiliki HP Android secara langsung.


## Menambahkan Emulator

1. Pada aplikasi Android Studio, klik dropdown yang ada di sebelah kiri tombol play, lalu klik Device Manager

![](./Screenshot%202023-10-13%20at%2002.04.22.png)

Device Manager akan muncul panel di sebelah kanan. Panel ini akan menunjukkan beberapa Virtual Device yang sudah dibuat, karena saya belum membuat satupun, jadi kosong.

![](./Screenshot%202023-10-13%20at%2002.06.06.png)

2. Untuk menambah Virtual Device baru, klik **Create virtual device**. Akan muncul sebuah dialog yang berisikan daftar-daftar device yang tersedia. Pilih device yang teman-teman inginkan, kali ini Saya ingin menggunakan Pixel 7 Pro. Setelah itu klik **Next**.

![](./Screenshot%202023-10-13%20at%2002.07.56.png)

3. Pilih juga API level yang diinginkan, kali ini Saya menggunakan API 34 (Android 13).

![](./Screenshot%202023-10-13%20at%2002.12.26.png)

Karena Saya belum memiliki imagenya, Saya harus mengunduh image dari API tersebut dengan cara mengklik tombol unduh yang berada di sebelah **Release Name** dari masing-masing API. Setelah menekan unduh, akan muncul popup yang berisi progress pengunduhan

![](./Screenshot%202023-10-13%20at%2002.13.44.png)

Setelah selesai mengunduh, klik **Finish** dan teman-teman akan diarahkan kembali ke dialog pertama. Klik API yang tadi diunduh, lalu klik **Next**

![](./Screenshot%202023-10-13%20at%2002.26.58.png)

4. Atur nama AVD sesuai yang diinginkan, lalu klik **Finish**

![](./Screenshot%202023-10-13%20at%2002.27.46.png)

Selamat, Anda telah membuat Android Virtual Device. Untuk menjalankan AVD, simpelnya, klik tombol play pada AVD di panel Device Manager.

Run pertama biasanya akan memakan waktu yang cukup lama, jadi bisalah saambil ngopi-ngopi dulu :coffee:

Nanti, akan muncul sebuah tampilan Android yang berada di panel kanan, persis di bawah Device Manager. Itulah AVD teman-teman.

![](./Screenshot%202023-10-13%20at%2002.30.38.png)


## Menjalankan aplikasi pada AVD

Untuk menjalankan aplikasi, klik tombol play yang ada di kanan atas. Pastikan AVD yang digunakan sudah sesuai dengan AVD mana yang ingin teman-teman pakai.

![](./Screenshot%202023-10-13%20at%2002.33.00.png)

Tunggu beberapa saat untuk Gradle Build dan *voila!*, aplikasi dijalankan!

![](./Screenshot%202023-10-13%20at%2002.37.39.png)