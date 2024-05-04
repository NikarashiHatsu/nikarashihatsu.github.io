---
title: "Development Log - 2023 {Hack}toberfest"
date: 2023-10-05T18:57:00+07:00
tags: ["development", "log"]
draft: false
series: ["Development Log"]
series_order: 1
---

Yap, bulan Oktober, tentunya bulan Hacktoberfest! Suatu event tahunan dimana pengembang berlomba-lomba untuk memberikan kontribusinya ke open-source, baik itu melalui GitHub atau GitHub. Flexing sedikit ah hehehe:

![](./Screenshot%202023-10-05%20at%2018.45.45.png)

[![An image of @irlnidallah's Holopin badges, which is a link to view their full Holopin profile](https://holopin.me/irlnidallah)](https://holopin.io/@irlnidallah)

Yoi, Hacktoberfest Saya kelar di hari ke-5. A trully intensive yet fun experience. Ini pertama kalinya Saya serius di Hacktoberfest, tahun sebelumnya Saya cuma daftar, nggak ngikut sampai selesai karena kerjaan sama nggak tau mana repositori yang harus dicontribute, susah-susah soalnya wkwkwk :grinning_face_with_sweat:.

Anyway, selamat datang di Development Log. Development Log adalah suatu seri yang berisi tentang hal-hal apa saja yang telah Saya bangun, kembangkan, atau kontribusikan terhadap suatu project baik itu open-source atau closed-source. Kebanyakan dari kontribusi open-source akan Saya cantumkan tautan issue / PR-nya, namun untuk closed-source akan Saya sertakan short commit-hashnya saja.

Well, let's get coding.


## Open-source

{{< github repo="ozdemirburak/iris" >}}

- [[2023-10-04] feat: add CMYK](https://github.com/ozdemirburak/iris/pull/44)
- [[2023-10-04] feat: color clone](https://github.com/ozdemirburak/iris/pull/45)
- [[2023-10-05] feat: safe-alpha trait](https://github.com/ozdemirburak/iris/pull/46)
- [[2023-10-06] fix: rgba to hlsa and hexa to hsla](https://github.com/ozdemirburak/iris/pull/47)

{{< github repo="EbookFoundation/free-programming-books" >}}

- [[2023-10-04] Improves Repo's Code of Conducts, Contributing, and How-to Indonesian Grammars](https://github.com/EbookFoundation/free-programming-books/pull/9812)

{{< github repo="NikarashiHatsu/codeigniter4-kit" >}}

- [[2023-10-05] OPEN ISSUE: Upgrade CodeIgniter to v4.4.1](https://github.com/NikarashiHatsu/codeigniter4-kit/issues/1)
- [[2023-10-05] OPEN ISSUE: Upgrade DaisyUI to v3.9.1](https://github.com/NikarashiHatsu/codeigniter4-kit/issues/2)
- [[2023-10-05] OPEN ISSUE: Upgrade `package.json` and `composer.json` libraries' version`](https://github.com/NikarashiHatsu/codeigniter4-kit/issues/3)
- [[2023-10-05] OPEN ISSUE: Feature Request: Edit User Profile from the Dashboard](https://github.com/NikarashiHatsu/codeigniter4-kit/issues/4)
- [[2023-10-05] OPEN ISSUE: Hacktoberfest Issues](https://github.com/NikarashiHatsu/codeigniter4-kit/issues/5)


## Closed-source


### AkateknoID/Pugugo

- [2023-10-26] feat (corporate registration): siu and ktp pic attachment for corporat (#4c0ee97). Thanks for your help, shout out to [Fahdi Labib](https://github.com/Flabib)!


### Hanjuan.net/simperkim

- [2023-10-04] change (guest layout): ubah penggunaan livewire filtering menjadi menggunakan menu secara langsung (#eef53f1)
- [2023-10-04] change (system): hapus gambar gedung (#bb68ae0)
- [2023-10-04] feat (map overview): custom warna poligon (#95c20aa)
- [2023-10-04] feat (map overview): custom warna icon (#edbdaa3)
- [2023-10-05] fix (point input): area can not be null (#eb2bc2a)
- [2023-10-05] fix (point input): latitude and longitude didn't persists on edit (#31567a5)
- [2023-10-20] feat (rtlh): kolom kerusakan atap (#63d20abb)
- [2023-10-20] feat (rtlh): kolom pencahayaan, pengyhawaan, ada wc (#feef49b5)
- [2023-10-20] feat (rtlh): jumlah jiwa dalam kk (#e2da9809)
- [2023-10-20] feat (rtlh): import rtlh (#f28871a1)
- [2023-10-21] feat: crud jumlah rumah (#be8c19f4)
- [2023-10-21] feat: crud jumlah penduduk (#733c2e7f)
- [2023-10-21] feat: template import rtlh (#3ae5c68b)
- [2023-10-22] help (tech): import data rtlh terbaru
- [2023-10-22] feat (rtlh): hapus rtlh (53134d40)
- [2023-10-22] fix (map overview): rtlh not showing (#6e1dfdb6)
- [2023-10-22] feat (dashboard): menu map data rtlh
- [2023-10-23] feat (perumahan kumuh): import delineasi kumuh (#4e5a071)
- [2023-10-27] fix (rtlh): page tidak responsive pada mobile (#ab9c6800)
- [2023-10-27] change (map overview): ubah map ke satellite view (#b59484f3)
- [2023-10-27] change (map overview): ubah icon dan warna (#ceee2e6a)


### Hanjuan.net/sikpkp

- [2023-10-11] chore (technical): ubah nama aplikasi ke Sidakan (Sistem Informasi Data Pembudidayaan Ikan)
- [2023-10-13] change (logo): logo diubah bernuansa produksi ikan (#7c2ffce)
- [2023-10-13] fix (auth): memperbaiki texting dan gambar sesuai tema apliakasi (#57d767e)
- [2023-10-18] feat: homepage (#688fb16)
- [2023-10-18] feat: dokumen legalitas pokdakan (#c957bc7)
- [2023-10-18] change (label): ubah terminologi TPI ke Pokdakan di seluruh halaman (#33f5acb)
- [2023-10-18] fix (chart): label "Banyaknya Panen" seharusnya "Nilai Produksi" (#f6b4ef2)
- [2023-10-18] feat (homepage): memasukkan list Pokdakan pada homepage (#ee9cada)
- [2023-10-18] refactor (flow): mengubah dari per-tpi ke per-kecamatan (#04e7780)
- [2023-10-19] change (target): mengubah target bulanan menjadi target tahunan per kecamatan (#d57a6c9)
- [2023-10-19] feat (pokdakan): add kolom nama ketua (#4c22179)
- [2023-10-19] feat (pokdakan): add kolom nomor hp (#8ff427e)
- [2023-10-19] refactor (produksi): remove pokdakan dari produksi (#f6ab4bf)
- [2023-10-19] change (label): laporan per-pokdakan diganti per-kecamatan (#7811740)
- [2023-10-19] change (laporan): ubah seluruh laporan ke per-kecamatan instead of per-pokdakan (#6bffe56)
- [2023-10-19] change (print laporan): ubah seluruh print laporan ke per-kecamatan (#780e09f)
- [2023-10-19] chore (user): add user kecamatan seeder (#984886d)
- [2023-10-19] feat (user): cetak akun kecamatan (#f5d1b40)
- [2023-10-19] chore (auth): hide navbar & footer (#c03c5f2)
- [2023-10-19] feat (auth): login dengan data per-tahun (#8ae1701)
- [2023-10-19] feat (produksi): super admin bisa pilih kecamatan (#6c643d9)
- [2023-10-19] feat (pokdakan): kolom unique nomor registrasi pokdakan (#f57d6e7)
- [2023-10-19] feat (auth): rule input & filtering tahunan (#6a43dae)
- [2023-10-23] fix (berita): berita tidak bisa dibaca (#26d3c77)
- [2023-10-23] styling (berita): tambah margin untuk estetika (#9a7b2a9)
- [2023-10-25] chore (pokdakan): dokumen legalitas dibuat opsional (#7ad3b2d)
- [2023-10-26] feat (produksi): add jenis ikan on-demand (#270fa67)
- [2023-10-26] feat (produksi): multiple input ikan (#d62a293)


### Hanjuan.net/sikanda

- [2023-10-04] feat (menu): add available menus to be used (#209338e)
- [2023-10-04] chore (technical): merge dependabot bumps
- [2023-10-05] feat (dashboard): initial dashboard menus (#b2659c2)
- [2023-10-05] chore (dashboard): convert page to livewire (#f0ddc4b)
- [2023-10-05] feat (modal): mockup penerimaan perlengkapan (#123c52e)
- [2023-10-05] feat (modal): mockup distributor (#2598580)
- [2023-10-05] chore (dashboard): set distributor button to open distributor modal (#a77066a)
- [2023-10-05] fix (modal, distributor): label `penanggungjawab` overflow (#7be8e60)
- [2023-10-05] feat (modal): perlengkapan (#3deee02)
- [2023-10-05] fix (modal, perlengkapan): typo and wrong icon (#af99723)
- [2023-10-05] chore (system): install laravel sail `#4de5e5c`
- [2023-10-05] chore (technical): deploy
- [2023-10-05] fix (route): invalid livewire route action (#b209a9b8)
- [2023-10-05] fix (system): `\App\View\Components\Layout\App` didn't comply PSR-4 standard (#4e6700d)
- [2023-10-11] chore (technical): proses bisnis
- [2023-10-23] change (transaksi penerimaan): pindah field yang salah section (#2cb2f4c)
- [2023-10-23] feat (master): master kategori (#e047a85)
- [2023-10-23] feat (transaksi penerimaan): add kategori (#c171197)
- [2023-10-23] feat (master): master satuan barang (#7b10238)
- [2023-10-23] feat (master): master barang (#729ece0)
- [2023-10-24] feat (master): master distributor (#e87284f)
- [2023-10-24] feat (master): master rak penyimpanan (#8b35683)
- [2023-10-24] feat (master): master data item (#84735e3)
- [2023-10-25] feat (master): master instansi / SKPD (#60b49ee)
- [2023-10-25] feat (master): master unit / instalasi (#79194ec)
- [2023-10-25] feat (master): master penanggung jawab (#b92a4fc)
- [2023-10-25] feat (master): master sub-unit (#9d8f542)
- [2023-10-25] feat (dashboard): modal instalasi / skpd (#542969b)
- [2023-10-25] feat (dashboard): modal pengaturan (#8cc52ef)
- [2023-10-25] feat (dashboard): modal ubah kata sandi (#c946dbd)
- [2023-10-25] feat (dashboard): modal laporan (#9a09ec5)
- [2023-10-25] feat (dashboard): modal laporan rencana kebutuhan item (#1dec4a2)
- [2023-10-25] feat (dashboard): modal form input penerimaan (#69f77a7)


### PT. Bengkel Web Indonesia/dumas-presisi

- [2023-10-03] help (tech): resync laporan super app presisi yang tidak tersinkron
- [2023-10-07] fix (statistik grafik v2): satker pengelola masih sebagai satker terlapor (#6fcdb65)
- [2023-10-07] feat (backtrace summary): filtering periodik (#59eb794)
- [2023-10-07] chore (technical fix): jumlah tanggapan tidak sesuai dengan jumlah status penyelesaian
- [2023-10-07] revert #e0d1d97 (pengaduan selesai): laporan dengan status selesai diproses dikembalikan lagi ke halaman tindak lanjut status (#3496f3b)
- [2023-10-07] chore (technical): weekly backup
- [2023-10-15] feat (backtrace): backtrace filtering (#2beaa1f)
- [2023-10-15] feat (ai): AI Dumas Presisi (#01b9228)
- [2023-10-16] feat (laporan): memperbolehkan edit laporan sementara untuk admin instansi (#732b6e0)
- [2023-10-18] help (technical): fix beberapa laporan yang tidak bisa dikirim ulang ke satker pengelola
- [2023-10-19] feat (surat): hapus surat (#2035aaa)
- [2023-10-19] feat (disposisi surat): hapus disposisi surat (#d398210)
- [2023-10-19] change (backtrace): pindah satker `Itwasum`, `Itwasda`, dan `Siwas` ke bagian `Satker Pengelola APIP` (#fbec97c)
- [2023-10-19] change (REST): ubah pesan pengembalian laporan dari Yanduan ke Dumas (#ff46841)
- [2023-10-19] fix (tindak lanjut status): pengaduan selesai `Diproses` tidak berpindah ke halaman `Pengaduan Selesai` (#a91a0d7)
- [2023-10-19] fix (backtrace): backtrace direktorat `Bareskrim` tidak terakumulasi (#bf99817)
- [2023-10-19] change (backtrace): limit pangkat terlapor ke masing-masing tingkatan pengaduan (#e13134c)
- [2023-10-19] change (surat): fitur approval surat konvensional tidak perlu approval untuk dikirim ke satker (#e39608e)
- [2023-10-19] feat (statistik): ranking penyelesaian polda (#653ebdd)
- [2023-10-19] fix (pengaduan): laporan yang dikembalikan oleh Yanduan tidak bisa diedit (#a7a8f62)
- [2023-10-20] help (technical): generate user admin polda pimpinan (#9f1e7ae)
- [2023-10-20] fix (statistik): anev kata kunci tidak terkait ke masing-masing tingkatan (#5120a8a)
- [2023-10-20] fix (statistik): substansi permasalahan tidak terkait ke masing-masing tingkatan (#b47ce08)
- [2023-10-21] fix (statistik): demografi agama tidak terkait ke masing-masing tingkatan (#ab51dde)
- [2023-10-21] fix (statistik): demografi masyarakat tidak terkait ke masing-masing tingkatan (#d57e70)
- [2023-10-21] fix (statistik): demografi masyarakat pendidikan tidak terkait ke masing-masing tingkatan (#718a41c)
- [2023-10-21] fix (statistik): demografi masyarakat pekerjaan tidak terkait ke masing-masing tingkatan (#d46447a)
- [2023-10-21] fix (statistik): filtering mabes tampil pada akun polda pada halaman statistik harian (#48f21fa)
- [2023-10-21] fix (statistik): statistik feedback tidak terkait ke masing-masing tingkatan (#3d8e334)
- [2023-10-21] fix (statistik): statistik berkadar polda tidak fetch data polda (#21a0dc0)
- [2023-10-21] chore (statistik): hide menu statistik konsultasi v2 untuk polda (#8c3d28a)
- [2023-10-21] feat: backtrace polda (#66ff81d)
- [2023-10-21] feat: backtrace summary polda (#d9567d6)
- [2023-10-21] help (technical): generate user pimpinan polda
- [2023-10-21] help (technical): generate user pimpinan polda
- [2023-10-25] help (technical): generate user pimpinan polda
- [2023-10-25] technical: rapat dengan tim WA Yanduan


### PT. Bengkel Web Indonesia/surat-riau

- [2023-10-11] feat (flow polres): antar satker tingkat `si` (#5c6a8d1)
- [2023-10-11] feat (flow polres): tujuan polres lain (#ba75ae2)
- [2023-10-11] feat (flow polres): tujuan polda a.n kapolres / wakapolres (#ba75ae2)
- [2023-10-11] feat (flow polres): antar satker tingkat `bag` (#218010b)
- [2023-10-11] feat (flow polres): antar satker tingkat `sat` (#045fa4c)
- [2023-10-11] chore (technical): upsert user Polres Kep. Meranti, Rohil, Bengkalis
- [2023-10-11] feat (user role): role grouping (#c5afc4f)
- [2023-10-11] fix (flow polres): wakapolres tidak bisa ttd (#fa3eb8f)
- [2023-10-11] fix (flow polres): template surat tidak ngeload (#3af2091)
- [2023-10-11] fix (flow polres): surat polres ke polres tidak masuk melalui si um terlebih dahulu (#686ab8f)
- [2023-10-11] test (technical): test flow lengkap antar polres
- [2023-10-11] feat (user role): tambah user admin (#bed3bdd)
- [2023-10-11] fix (disposisi): disposisi tidak tampil pada user role kasatker (#32951ae, #f3d01d1)
- [2023-10-11] chore (seeder): user admin seeder (#8c6553a)
- [2023-10-12] fix (user): role group not defined (#ded3228)
- [2023-10-12] fix (surat): wakapolres tidak bisa ttd (#fa3eb8f)
- [2023-10-12] fix (surat): surat polda -> polres tidak masuk ke sium (#2373665)
- [2023-10-12] fix (surat): surat polres -> polres tidak masuk ke sium (#686ab8f)


### PT. Quantum Teknologi Indonesia/kenangan-backend

*More info will be added later*


### PT. Quantum Teknologi Indonesia/meepo-backend

*More info will be added later*


### PT. Quantum Teknologi Indonesia/meepo-web

*More info will be added later*