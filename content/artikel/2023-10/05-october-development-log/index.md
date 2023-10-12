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

*More info will be added later*


### Hanjuan.net/simperkim

- [2023-10-04] change (guest layout): ubah penggunaan livewire filtering menjadi menggunakan menu secara langsung (#eef53f1)
- [2023-10-04] change (system): hapus gambar gedung (#bb68ae0)
- [2023-10-04] feat (map overview): custom warna poligon (#95c20aa)
- [2023-10-04] feat (map overview): custom warna icon (#edbdaa3)
- [2023-10-05] fix (point input): area can not be null (#eb2bc2a)
- [2023-10-05] fix (point input): latitude and longitude didn't persists on edit (#31567a5)


### Hanjuan.net/sikpkp

- [2023-10-11] chore (technical): ubah nama aplikasi ke Sidakan (Sistem Informasi Data Pembudidayaan Ikan)


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


### PT. Bengkel Web Indonesia/dumas-presisi

- [2023-10-07] fix (statistik grafik v2): satker pengelola masih sebagai satker terlapor (#6fcdb65)
- [2023-10-07] feat (backtrace summary): filtering periodik (#59eb794)
- [2023-10-07] chore (technical fix): jumlah tanggapan tidak sesuai dengan jumlah status penyelesaian
- [2023-10-07] revert #e0d1d97 (pengaduan selesai): laporan dengan status selesai diproses dikembalikan lagi ke halaman tindak lanjut status (#3496f3b)
- [2023-10-07] chore (technical): weekly backup


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


### PT. Quantum Teknologi Indonesia/kenangan-backend

*More info will be added later*


### PT. Quantum Teknologi Indonesia/meepo-backend

*More info will be added later*


### PT. Quantum Teknologi Indonesia/meepo-web

*More info will be added later*