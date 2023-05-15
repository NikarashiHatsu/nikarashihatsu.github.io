---
title: "Mengenal Testing Automation Pyramid"
date: 2023-02-10T17:46:07+07:00
tags: ["blog", "tech"]
draft: false
---

Pyramid Automation Testing, dilansir dari buku The Clean Coder yang ditulis oleh
Robert C. Martin, adalah sebuah gambaran tentang jenis-jenis Test yang
dibutuhkan oleh organisasi pengembang profesional.

Ada 5 bagian dari piramid ini yang masing-masing membutuhkan _setidaknya_
persentase _coverage_ dari setiap Test. Berikut adalah daftarnya:
1. Exploratory Test - 5%
1. System Test - 10%
1. Integration Test - 20%
1. Component Test - 50%
1. Unit Test - 100%

## Unit Test

Pada bagian ini, Test dengan bahasa pemrograman yang digunakan untuk membangun
sistem ditulis oleh programmer, dan kembali untuk programmer. Test yang ditulis
harus bisa menspesifikasikan kebutuhan kode pada level yang paling rendah, jika
memungkinkan pada level abstraksi.

Unit Test ini biasanya ditulis terlebih dahulu sebelum membuat kode production
yang nantinya akan dijalankan secara otomatis oleh Continuous Integration
sebelum dikirimkan ke production.

Unit Test harus mengcover keseluruhan sistem paling sedikit 90%. Robert
mengatakan bahwa 100% adalah hal yng mustahil, namun setidaknya kita mencapai
titik asimptotik mendekati 100%.

## Component Test

Component Test adalah Test yang ditulis oleh Quality Assurance dan Business
Analyst, dengan bantuan programmer. Test ini harus bisa dimengerti oleh seluruh
Stakeholder, QA, BA, serta programmer yang menulis Test atau yang tidak
menulisnya.

Test ini setidaknya meng-_cover_ 50% dari sistem. Sifat dari Test ini lebih
mencerminkan pada _happy-path_ daripada _unhappy-path_.

_Happy path_ => Mencerminkan bagaimana komponen itu berfungsi selayaknya,
biasanya ditulis oleh BA atau Stakeholder yang menginginkan bagaimana komponen
itu berjalan sesuai keinginan.

_Un-happy path_ => Skenario-skenario terburuk yang mungkin terjadi pada
komponen yang akan ditest, contohnya kemungkinan error yang akan terjadi,
Exception yang akan dilempar. _Un-happy path_ biasanya digunakan pada
Test-Driven Development dan Behavioural-Driven Development.

## Integration Test

Integration Test adalah tipe Test yang akan sangat berarti pada sistem yang
lebih besar, yang memiliki banyak komponen. Testing ini akan menghimpun
beberapa kopmonen sekaligus, dan mengecek kesesuaian komunikasi antar komponen.
Test ini biasanya ditulis oleh System Architect atau Lead Designer.

Test ini sering disebut juga sebagai Choreography Test, karena menggambarkan
"bagaimana setiap komponen berdansa seirama dengan komponen lainnya".

Test ini tidak mengetes alur bisnis sama sekali, hanya mengetes komunikasi antar
komponen. Biasanya, Integration Test tidak akan dijalankan bersamaan dengan CI,
namun dijalankan setiap malam, atau mingguan karena cukup memakan waktu yang
lama. Pada level ini, kita mengetes performa dan throughput dari sistem.

## System Test

Test tipe ini adalah tipe test yang terotomatisasi yang mengecek seluruh sistem
secara terintegrasi. Test tipe ini tidak mengecek alur bisnis secara langsung,
namun mengetes apakah sistem sudah disambung bersamaan dengan benar. Kita
mengetest performa dan throughput dari sistem.

Test ini ditulis oleh System Architect dan Technical Lead, yang biasanya ditulis
dengan bahasa dan environment yang sama dengan Integration Test untuk UI. Test
ini jarang dijalankan, karena durasi testingnya yang lama.

System Test setidaknya meng-_cover_ 10% dari sistem. Tujuan dari Test ini hanya
memastikan susunan sistemnya, bukan perilaku sistemnya. Asumsimnya adalah
testing perilaku sudah dipastikan ada pada Unit Test dan Component Test.

## Manual Exploratory Test

Disini adalah bagian dimana manusia atau pengguna terlibat langsung. Karena
kita sebagai pengembang tidak bisa menulis Test untuk keseluruhan sistem
secara sempurna, maka dibutuhkanlah peran manusia.

Manusia adalah makhluk hidup kreatif yang akan selalu berfikir untuk merusak
sebuah sistem yang dirancang secara sistematis. Kreatifitas manusia inilah yang
akan digunakan untuk menjelajahi bagaimana perilaku sistem yang "seharusnya"
terjadi, sesuai dengan ekspektasi mereka.

Bagian ini bukanlah Test yang diotomasi, namun lebih ke diskenariokan, yang
dieksekusi secara manual, oleh masing-masing individu dengan gaya penggunaan
yang unik. Secara spesifik, pekerjaan pada bidang ini adalah Bug Hunter.

Seluruh bug yang ditemukan pada level ini akan ditulis kembali pada Unit Test,
Component Test, serta Integration Test untuk memastikan bug yang sudah ditemukan
tidak akan terjadi lagi di kemudian hari.
