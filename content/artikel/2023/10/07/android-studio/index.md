---
title: "Catatan Belajar Juara Android 2023 - #5 Android Studio"
date: 2023-10-07T16:35:00+07:00
tags: ["article", "android", "google", "belajar", "juara android", "kotlin", "android studio"]
draft: false
series: ["Juara Android 2023"]
series_order: 5
---

Akhirnya, yang ditunggu-tunggu, Android Studio! Setelah beberapa hari belajar dasar Kotlin, saatnya instalasi Android Studio. Tapi keknya nggak bakal langsung terjun bikin aplikasinya deh. :laughing:

Jadi, Android Studio ini IDE resmi untuk pembangunan aplikasi Android, yang dibangun dan didistribusikan oleh Google. IDE ini adalah alat yang digunakan buat mendesain, membangun, menjalankan, dan menguji coba sebuah perangkat lunak yang dibangun.

Android Studio menggunakan Intellij IDEA sebagai fondasinya dan plugin Android sudah termasuk didalamnya. Saya gak akan jelasin secara detail untuk instalasinya karena saya udah punya, jadi untuk yang mau download, silahkan download di [sini](https://developer.android.com/studio).


## Aplikasi Android Pertamaku

Untuk permulaan, kita akan membuat aplikasi Android menggunakan template **Empty Activity**.

1. Buka aplikasi Android Studio, karena Saya pakai Mac, jadi cari pakai Spotlight saja

![](./Screenshot%202023-10-07%20at%2016.52.50.png)

2. Pada dialog **Welcome to Android Studio**, klik **New Project**. Karena ada perbedaan versi, tampilan bisa jadi berbeda-beda pada setiap versinya, namun secara esensi, fungsi yang sama akan tetap ada di interfacenya.

![](./Screenshot%202023-10-07%20at%2016.53.30.png)

Setelah **New Project** diklik, akan muncul dialog dengan daftar template yang sudah disediakan oleh Android Studio

![](./Screenshot%202023-10-07%20at%2016.55.40.png)

Project Template ini adalah blueprint yang disediakan untuk tipe aplikasi tertentu. Template membuat struktur project yang dibutuhkan oleh Android Studio untuk membangun projek teman-teman, template yang dipilih akan memberikan kode yang dibutuhkan sebagai awalan, sehingga pengembangan awal bisa dilakukan lebih cepat.

3. Pastikan pilih tab **Phone and Tablet**

4. Klik template **Empty Activity**. Template ini akan membuat projek simpel yang bisa digunakan untuk membangun aplikasi Compose. Hanya memiliki satu halaman dan menampilkan teks `"Hello Android!"`.

5. Klik **Next**, lalu dialog **New Project** akan terbuka. Akan ada beberapa inputan yang perlu diatur

6. Atur projeknya seperti ini:

Inputan **Name** digunakan untuk nama dari project teman-teman, untuk ini gunakan "Greeting Card" saja.

Biarkan **Package Name** seperti yang sudah ada, karena akan secara otomatis mengikuti nama project.

Biarkan **Save Location** seperti yang sudah ada.

Pilih **API 24: Android 7.0 (Nougat)** dari pilihan **minimum SDK**.

![](./Screenshot%202023-10-07%20at%2017.00.39.png)

Setelah itu, klik **Finish**, disini yang bakal lama karena setup project, mengunduh / mengupgrade beberapa library, *Gradle Sync*, dll. Tunggu saja, proses ini berlangsung dari beberapa detik ke beberapa menit tergantung spek dan internet masing-masing.

Nah, disini ada yang sedikit berbeda dari pengalaman saya terakhir membuka aplikasi ini **2 tahun yang lalu**. Pertama, karena udah gak familiar ya, jadi asing banget tampilannya; Kedua, UInya overwhelming, banyak yang harus dipelajari.

![](./Screenshot%202023-10-08%20at%2002.25.14.png)

Disini kan ada 3 tampilan, kiri, tengah, dan kanan, nah menurut Google ini nama-nama tampilannya:
1. Project View (kiri) yang menampilkan folder dan file
2. Code View (tengah) dimana teman-teman mengedit kode
3. Design View (kanan) preview tentang bagaimana aplikasi akan terlihat


## Project File

Di bagian kiri pada Android Studio, terdapat Project Tab. Project Tab menunjukkan file dan folder dari suatu project. Nanti akan ada folder yang berbentuk seperti `com.example.greeting` tergantung nama project yang teman-teman berikan di awal-awal.

![](./Screenshot%202023-10-08%20at%2002.33.18.png)

Secara default, dropdown `Android` yang ada di bagian atas adalah tampilan default yang didesain untuk mempermudah navigasi teman-teman pada saat pengembangan. Namun tentunya hal ini akan berbeda jika dibuka oleh file explorer seperti Windows Explorer, Dolphin, atau Finder. Untuk mengubah hierarki folder seperti layaknya file explorer, ubah dropdown `Android` ke `Project Source File`.

![](./Screenshot%202023-10-08%20at%2002.36.13.png)

Untuk mengembalikan lagi ke hierarki semula, ubah ke `Android`.


## Mengubah Teks

Konteks mengubah teks kali ini bukanlah mengubah teks pada Kotlin, tapi bagaimana caranya memanipulasi teks pada aplikasi Android yang akan kita bangun.

Pertama-tama mari kita lihat kode yang ada pada file `MainActivity.kt`. Ada beberapa fungsi yang secara dibuat secara otomatis pada saat pembuatan projek kosong tadi. Kita ambil potongan kode dari kelas `MainActivity`:

```kt
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            GreetingTheme {
                // A surface container using the 'background' color from the theme
                Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
                    Greeting("Android")
                }
            }
        }
    }
}
```

Fungsi `onCreate()` adalah sebuah *entry point* dari aplikasi Android ini, yang akan memanggil fungsi-fungsi lainnya untuk membangun sebuah *user interface* yang solid. Perbedaannya dengan Kotlin, Kotlin menggunakan fungsi `main()` sebagai *entry point*nya.

Fungsi `setContent()` yang ada di dalam fungsi `onCreate()` digunakan untuk mendefinisikan tata letak fungsi *composable*. Semua fungsi yang ditandai dengan anotasi `@Composable` dapat dipanggil dari fungsi `setContent()` atau dari fungsi *Composable* lainnya. Anotasi tersebut akan menginstruksikan kompiler Kotlin bahwa fungsi ini digunakan oleh Jetpack Compose untuk membangun User Interface.

Selanjutnya, kita lihat fungsi `Greeting()` yang merupakan fungsi *Composable*, perhatikan adanya anotasi `@Composable` di atas fungsinya. Fungsi *Composable* ini mengambil beberapa input dan membuat tampilannya pada layar.

```kt
@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(text = "Hello $name!")
}
```

Sama saja seperti materi [Fungsi Pada Kotlin](../06-fungsi-pada-kotlin/), namun ada beberapa perbedaan:
- Ada anotasi `@Composable` sebelum penulisan fungsi;
- Nama fungsi `@Composable` menggunakan `PascalCase`;
- Fungsi `@Composable` tidak me-*return* apapun;

Saat ini, fungsi `Greeting()` membutuhkan `name` dan mengucapkan `Hello` ke orang tersebut. Kita akan ubah fungsi ini supaya menampilkan pesan yang lebih *friendly* dan akrab.

1. Ubah pesan dari fungsi `Greeting()` untuk memperkenalkan diri Anda sendiri, alih-alih mengatakan "Hello":

```kt
@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(text = "Hai, nama saya adalah $name!")
}
```

2. Preview Android akan secara otomatis memperbarui previewnya:

![](./Screenshot%202023-10-13%20at%2000.48.08.png)

Nah, lebih mantap sekarang. Tapi, bisa dilihat lagi preview yang digunakan ini bukan nama teman-teman. Jadi, saatnya kita mengubah nama "Android" menjadi namamu. Bukan nama sendiri juga gak masalah sih, yang penting nama hehe.

Fungsi `GreetingPreview()` yang ada di paling bawah script adalah sebuah fitur yang keren (pake banget) dimana teman-teman bisa melihat bagaimana *composable* teman-teman terlihat, tanpa harus membangun keseluruhan aplikasi. Untuk membuat sebuah preview, anotasikan fungsi tersebut menggunakan anotasi `@Composable` dan `@Preview`. Anotasi `@Preview` akan menginstruksikan Android Studio bahwa *composable* tersebut harus ditampilkan pada *Design View*.

```kt
@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    GreetingTheme {
        Greeting("Android")
    }
}
```

3. Kita perbarui fungsi `GreetingPreview()` menjadi nama selain Android. *Let's name it Shiroyuki*.

```kt
@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    GreetingCardTheme {
        Greeting("Shiroyuki")
   }
}
```

Jrenggggg, Greeting Preview akan secara otomatis diupdate!

![](./Screenshot%202023-10-13%20at%2000.58.38.png)


## Mengubah Background Color

Untuk mengatur warna latar (*background color*) yang berbeda, kita perlu mengelilingi `Text` menggunakan `Surface`. `Surafe` adalah sebuah kontainer yang merepresentasikan bagian dari sebuah UI, dimana kita dapat mengubah tampilannya, seperti warna latar atau pinggiran.

1. Untuk mengelilingi `Text` menggunakan sebuah Surface, klik baris yang ingin diubah, lalu tekan (`Alt+Enter` untuk Windows atau `Option+Enter` untuk Mac), lalu pilih **Surround with widget**.

![](./Screenshot%202023-10-13%20at%2001.24.32.png)

2. Pilih **Surround with Container**

![](./Screenshot%202023-10-13%20at%2001.24.40.png)

Secara default, Android Studio akan menggunakan `Box`, tapi kalian bisa mengubah ini ke tipe kontainer yang lain.

```kt
@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Box {
        Text(
            text = "Hai, nama saya adalah $name!",,
            modifier = modifier
        )
    }
}
```

3. Hapus `Box` dan ketikkan `Surface()`

```kt
@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Surface() {
        Text(
            text = "Hai, nama saya adalah $name!",,
            modifier = modifier
        )
    }
}
```

4. Pada kontainer `Surface`, tambahkan parameter `color`, atur valuenya ke `Color`.

```kt
@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Surface(color = Color) {
        Text(
            text = "Hai, nama saya adalah $name!",,
            modifier = modifier
        )
    }
}
```

5. Pada saat teman-teman mengetik `Color`, teman-teman akan melihat bahwa `Color` ini memiliki underline merah, yang artinya Android Studio tidak dapat memecahkan masalah ini. Untuk memecahkan masah ini, tekan (`Alt+Enter` untuk Windows atau `Option+Enter` untuk Mac), lalu pilih **Import**.

![](./Screenshot%202023-10-13%20at%2001.32.23.png)

Akan muncul beberapa opsi, gunakan `androidx.compose.ui.graphics`

![](./Screenshot%202023-10-13%20at%2001.33.14.png)

6. Perhatikan underline merah yang masih ada pada `Color`. Untuk memperbaiki ini, ketikkan titik (`.`) setelah `Color`, lalu pilih salah satu warna yang teman-teman inginkan.

![](./Screenshot%202023-10-13%20at%2001.36.37.png)

Saat ini, Saya ingin menggunakan warna merah (`Red`).

![](./Screenshot%202023-10-13%20at%2001.38.51.png)

7. Karena warnanya terlalu mencolok, Saya ubah warna tersebut menjadi warna tema Shiroyuki.dev, yaitu `#ef4444`:

```kt
@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Surface(color = Color(0xffef4444)) {
        Text(
            text = "Hai, nama saya adalah $name!",
            modifier = modifier
        )
    }
}
```

Format dari `Color` yang digunakan adalah ARGB (Alpha, Red, Green, Blue). Hasilnya adalah seperti berikut:

![](./Screenshot%202023-10-13%20at%2001.42.41.png)

Yey! Sekarang keliatan lebih natural! \\( ^^) /


## Menambahkan Padding

Sekarang, teks yang kita buat sudah memiliki warna latar, sekarang kita akan menambahkan padding di sekitar teks. Kita akan menggunakan `Modifier` kali ini.

Tambahkan padding ke `modifier` yang ada pada `Text` dengan ukuran `24.dp`:

```kt
@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Surface(color = Color(0xffef4444)) {
        Text(
            text = "Hai, nama saya adalah $name!",
            modifier = modifier.padding(24.dp)
        )
    }
}
```

Karena `dp` ini adalah unit yang tidak dikenal, maka teman-teman harus mengimportnya. Android Studio akan secara otomatis merekomendasikan `unit.dp`

![](./Screenshot%202023-10-13%20at%2001.49.12.png)

Hasilnya adalah sebagai berikut:

![](./Screenshot%202023-10-13%20at%2001.50.20.png)

Yey! Akhirnya kita berhasil menambahkan padding. Kelihatannya lebih luas ya? *Well, there you have it!*


## Kode Lengkap

<details>
    <summary>Klik untuk melihat kode lengkap</summary>

```kt
package com.example.greeting

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.greeting.ui.theme.GreetingTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            GreetingTheme {
                // A surface container using the 'background' color from the theme
                Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
                    Greeting("Android")
                }
            }
        }
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Surface(color = Color(0xffef4444)) {
        Text(
            text = "Hai, nama saya adalah $name!",
            modifier = modifier.padding(24.dp)
        )
    }
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    GreetingTheme {
        Greeting("Shiroyuki")
    }
}
```
</details>


## Ringkasan

- Untuk membuat projek baru: buka Android Studio, klik **New Project > Empty Activity > Next**, masukkan nama yang digunakan untuk projekmu, lalu konfigurasikan pengaturan yang ingin digunakan;
- Untuk melihat bagaimana tampilan dari aplikasimu, gunakan panel **Preview**;
- Fungsi Composable hampir sama dengan fungsi biasa, dengan beberapa perbedaan: nama fungsi menggunakan `PascalCase`, lalu tambahkan anotasi `@Composable` sebelum pendeklarasian fungsi, dan `@Composable` tidak me-*return* apapun;
- Sebuah **Modifier** digunakan untuk mendekorasi Composable;