# Perpustakaan Loan API

REST API sederhana untuk **pencatatan peminjaman buku perpustakaan**, dibangun dengan Node.js, Express.js, dan Supabase (PostgreSQL). Dibuat sebagai Responsi Modul 1 Pemrograman Perangkat Bergerak (PPB).

## Tujuan Proyek

Mencatat siapa anggota yang meminjam buku apa, kapan jatuh temponya, dan bagaimana statusnya. API menyediakan operasi CRUD untuk peminjaman (`loans`), anggota (`members`), dan buku (`books`), serta filter query seperti `GET /api/loans?status=Terlambat`.

- **Stack:** Node.js, Express.js, `@supabase/supabase-js`
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **Arsitektur:** model – controller – router

## Link Deployment

**Base URL:** `https://GANTI-DENGAN-URL-VERCEL.vercel.app`

> Ganti dengan URL publik dari Vercel setelah deploy.

## Struktur Data / Schema

SQL lengkap ada di [`schema.sql`](schema.sql).

**members**

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid (PK) | otomatis |
| name | text | wajib |
| email | text | unik |
| phone | text | |

**books**

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid (PK) | otomatis |
| isbn | text | unik |
| title | text | wajib |
| author | text | |
| stock | integer | default 1 |

**loans**

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid (PK) | otomatis |
| member_id | uuid (FK → members.id) | wajib |
| book_id | uuid (FK → books.id) | wajib |
| loan_date | date | default hari ini |
| due_date | date | wajib |
| return_date | date | null jika belum kembali |
| status | text | `Dipinjam` (default), `Dikembalikan`, atau `Terlambat` |

## Endpoint

| Method | Path | Fungsi |
|---|---|---|
| GET | `/api/loans` | Daftar peminjaman (mendukung filter) |
| GET | `/api/loans/:id` | Detail satu peminjaman |
| POST | `/api/loans` | Tambah peminjaman |
| PUT | `/api/loans/:id` | Ubah peminjaman |
| DELETE | `/api/loans/:id` | Hapus peminjaman |
| GET/POST | `/api/members` | Daftar / tambah anggota |
| GET/PUT/DELETE | `/api/members/:id` | Detail / ubah / hapus anggota |
| GET/POST | `/api/books` | Daftar / tambah buku |
| GET/PUT/DELETE | `/api/books/:id` | Detail / ubah / hapus buku |

**Filter query pada `GET /api/loans`:**

| Parameter | Contoh | Keterangan |
|---|---|---|
| status | `?status=Terlambat` | `Dipinjam`, `Dikembalikan`, atau `Terlambat`. Nilai lain mengembalikan 400 |
| member_id | `?member_id=<uuid>` | Peminjaman milik satu anggota |
| book_id | `?book_id=<uuid>` | Peminjaman satu buku |

Filter dapat digabung, misalnya `?status=Dipinjam&member_id=<uuid>`.

## Contoh Request dan Response

### POST /api/members

```json
{ "name": "Budi Santoso", "email": "budi@email.com", "phone": "08123456789" }
```

Response `201 Created`:

```json
{
  "id": "a99b9ccf-18ba-4d80-a26a-71397bc608e1",
  "name": "Budi Santoso",
  "email": "budi@email.com",
  "phone": "08123456789"
}
```

### POST /api/books

```json
{ "isbn": "9786020332956", "title": "Bumi", "author": "Tere Liye", "stock": 3 }
```

Response `201 Created`:

```json
{
  "id": "3f1c1b0e-6d0a-4a54-9f53-1d2f6a8b7c10",
  "isbn": "9786020332956",
  "title": "Bumi",
  "author": "Tere Liye",
  "stock": 3
}
```

### POST /api/loans

```json
{
  "member_id": "a99b9ccf-18ba-4d80-a26a-71397bc608e1",
  "book_id": "3f1c1b0e-6d0a-4a54-9f53-1d2f6a8b7c10",
  "loan_date": "2026-10-01",
  "due_date": "2026-10-08"
}
```

`member_id`, `book_id`, dan `due_date` wajib diisi. Response `201 Created`:

```json
{
  "id": "7b2e9d1a-0c44-4f0e-a1a5-52d1c1f4e9aa",
  "member_id": "a99b9ccf-18ba-4d80-a26a-71397bc608e1",
  "book_id": "3f1c1b0e-6d0a-4a54-9f53-1d2f6a8b7c10",
  "loan_date": "2026-10-01",
  "due_date": "2026-10-08",
  "return_date": null,
  "status": "Dipinjam"
}
```

### GET /api/loans?status=Terlambat

Response `200 OK`:

```json
[
  {
    "id": "7b2e9d1a-0c44-4f0e-a1a5-52d1c1f4e9aa",
    "member_id": "a99b9ccf-18ba-4d80-a26a-71397bc608e1",
    "book_id": "3f1c1b0e-6d0a-4a54-9f53-1d2f6a8b7c10",
    "loan_date": "2026-10-01",
    "due_date": "2026-10-08",
    "return_date": null,
    "status": "Terlambat",
    "members": { "id": "a99b9ccf-18ba-4d80-a26a-71397bc608e1", "name": "Budi Santoso" },
    "books": { "id": "3f1c1b0e-6d0a-4a54-9f53-1d2f6a8b7c10", "title": "Bumi" }
  }
]
```

### PUT /api/loans/:id (pengembalian buku)

```json
{ "status": "Dikembalikan", "return_date": "2026-10-09" }
```

Response `200 OK`: objek peminjaman yang sudah diperbarui.

### DELETE /api/loans/:id

Response `200 OK`:

```json
{ "message": "Loan deleted successfully" }
```

### Contoh error

```json
{ "error": "status harus salah satu dari: Dipinjam, Dikembalikan, Terlambat" }
```

| Kode | Arti |
|---|---|
| 200 | Berhasil |
| 201 | Data berhasil dibuat |
| 400 | Input tidak valid / operasi gagal |
| 404 | Data tidak ditemukan |
| 500 | Kesalahan server |

## Instalasi dan Menjalankan Lokal

1. **Clone repository**

   ```bash
   git clone <URL-REPOSITORY-INI>
   cd <nama-folder>
   npm install
   ```

2. **Siapkan database Supabase**
   - Buat project baru di [supabase.com](https://supabase.com/).
   - Buka **SQL Editor** → **New query**, tempel isi [`schema.sql`](schema.sql), lalu klik **Run**.
   - Ambil **Project URL** dan **anon public key** dari **Project Settings → Data API / API Keys**.

3. **Buat file `.env`** (salin dari `.env.example`)

   ```env
   SUPABASE_URL=https://xxxxxxxx.supabase.co
   SUPABASE_KEY=<anon public key>
   PORT=3000
   ```

4. **Jalankan server**

   ```bash
   npm run dev     # dengan nodemon
   npm start       # tanpa nodemon
   ```

   Server berjalan di `http://localhost:3000`.

5. **Uji dengan Postman atau curl**

   ```bash
   curl "http://localhost:3000/api/loans?status=Terlambat"
   ```

## Deployment ke Vercel

1. Push proyek ke GitHub (file `.env` tidak ikut karena ada di `.gitignore`).
2. Di [vercel.com](https://vercel.com/) pilih **Add New → Project**, lalu import repository ini.
3. Tambahkan **Environment Variables** `SUPABASE_URL` dan `SUPABASE_KEY`.
4. Klik **Deploy**. Konfigurasi routing ada di [`vercel.json`](vercel.json).

## Struktur Folder

```
src/
├── config/supabaseClient.js
├── models/        (member, book, loan)
├── controllers/   (member, book, loan)
├── routes/        (member, book, loan)
└── index.js
schema.sql
vercel.json
.env.example
```
