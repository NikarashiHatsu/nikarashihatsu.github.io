---
title: "Cara Mengatasi Could Not Resolve Hostname Github Com Pada Linux"
date: 2023-02-23T12:00:20+07:00
tags: ["linux", "tips"]
draft: false
---

Situasi ini dimulai ketika saya berencana untuk melakukan `git pull` pada sebuah
proyek di server CentOS 7. Namun, berbeda dengan pengalaman saya sebelumnya,
respon yang muncul adalah sebagai berikut:

```
ssh: Could not resolve hostname github.com: Temporary failure in name resolution fatal: Could not read from remote repository.
Please make sure you have the correct access rights
and the repository exists.
```

Sangat mengherankan, karena sebelumnya saya selalu bisa melakukan pull tanpa
masalah apapun. Setelah berkonsultasi dengan seseorang yang ahli dalam menangani
Server, solusinya cukup sederhana, yaitu dengan mengedit file `/etc/resolv.conf`
dan menambahkan dua baris berikut:

```
nameserver 8.8.8.8
nameserver 8.8.4.4
```

Jika Anda masih baru dalam menggunakan Linux, Anda dapat menggunakan perintah
`nano /etc/resolv.conf` atau `vi /etc/resolv.conf` untuk mengedit file tersebut.
Namun, perlu diingat bahwa cara penggunaan kedua text editor tersebut berbeda.

Sebagai tambahan informasi, jika Anda tidak memiliki akses untuk mengedit file
tersebut, Anda bisa menambahkan perintah `pkexec` sebelum perintah `nano` atau
`vi`. Dalam hal ini, Anda akan diminta untuk memasukkan password *root* untuk
dapat mengedit file `resolv.conf`.

Sekian tutorial singkat sekaligus catatan pengembangan saya, semoga bermanfaat
dan membantu teman-teman sekalian.

Thumbnail oleh <a href='https://unsplash.com/@introspectivedsgn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText'>Erik Mclean</a> dari <a href='https://unsplash.com/photos/sxiSod0tyYQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText'>Unsplash</a>
