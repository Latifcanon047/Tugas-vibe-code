# 🚀 Simple Finance Tracker - Setup Guide

Panduan lengkap untuk setup dan menjalankan aplikasi Simple Finance Tracker.

## 📋 Prerequisites

Pastikan Anda sudah menginstal:
- **Node.js** (versi 18+) - [Download](https://nodejs.org/)
- **MySQL** (versi 5.7+) - [Download](https://www.mysql.com/downloads/)
- **npm** atau **yarn** (biasanya sudah termasuk dengan Node.js)

## 📁 Project Structure

```
aaaaaa/
├── prisma/
│   └── schema.prisma          # Database schema definition
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── transactions/
│   │   │       ├── route.ts            # GET, POST transactions
│   │   │       └── [id]/route.ts       # DELETE transaction
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main finance tracker page
│   ├── components/
│   │   ├── TransactionForm.tsx # Add transaction form
│   │   ├── TransactionList.tsx # Display transactions table
│   │   └── Summary.tsx         # Show balance summary
│   └── lib/
│       └── prisma.ts           # Prisma client singleton
├── .env.local                  # Database configuration (local)
├── package.json                # Dependencies
├── prisma/schema.prisma        # Database schema
└── tailwind.config.ts          # Tailwind CSS configuration
```

## 🔧 Step-by-Step Setup

### 1. Database Setup

#### A. Buat Database MySQL

Buka MySQL Command Line atau MySQL Workbench:

```sql
CREATE DATABASE simple_finance_db;
```

#### B. Update `.env.local` File

Edit file `.env.local` di root project dengan kredensial MySQL Anda:

```env
DATABASE_URL="mysql://root:password@localhost:3306/simple_finance_db"
```

**Ganti:**
- `root` = username MySQL Anda
- `password` = password MySQL Anda
- `localhost` = host MySQL (biasanya localhost)
- `3306` = port MySQL (default: 3306)
- `simple_finance_db` = nama database yang sudah dibuat

### 2. Push Schema ke Database

Jalankan command untuk membuat tabel di database:

```bash
npx prisma db push
```

### 3. (Optional) Prisma Studio

Untuk visualisasi dan manage data secara GUI:

```bash
npx prisma studio
```

Ini akan membuka interface web di `http://localhost:5555`

## 🎯 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 📝 API Endpoints

### GET /api/transactions
Mengambil semua transaksi

**Response:**
```json
[
  {
    "id": 1,
    "title": "Salary",
    "amount": 5000000,
    "type": "income",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### POST /api/transactions
Membuat transaksi baru

**Request Body:**
```json
{
  "title": "Groceries",
  "amount": 250000,
  "type": "expense"
}
```

### DELETE /api/transactions/[id]
Menghapus transaksi berdasarkan ID

**Example:** `DELETE /api/transactions/1`

## 🎨 Features

✅ **Tambah Transaksi**
- Input title, amount, dan type (income/expense)
- Validasi form sebelum submit

✅ **Hapus Transaksi**
- Klik tombol delete pada setiap transaksi
- Konfirmasi sebelum dihapus

✅ **Lihat Transaksi**
- Tabel berisi semua transaksi
- Sorted by tanggal terbaru

✅ **Perhitungan Otomatis**
- Total Income
- Total Expense
- Balance (Income - Expense)
- Ditampilkan dalam 3 card di atas

✅ **UI Modern**
- Tailwind CSS styling
- Responsive design (mobile-friendly)
- Gradien backgrounds
- Loading states

## 📊 Database Schema

```prisma
model Transaction {
  id        Int       @id @default(autoincrement())
  title     String    @db.VarChar(255)
  amount    Float
  type      String    @db.Enum("income", "expense")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

**Fields:**
- `id` - Primary key, auto increment
- `title` - Nama transaksi
- `amount` - Jumlah uang
- `type` - "income" atau "expense"
- `createdAt` - Waktu pembuatan transaksi
- `updatedAt` - Waktu update terakhir

## 🔌 Tech Stack

- **Frontend:** React + TypeScript
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Database:** MySQL
- **ORM:** Prisma
- **Icons:** Lucide React

## 🐛 Troubleshooting

### Error: "ECONNREFUSED" saat connect ke database

**Solusi:**
- Pastikan MySQL service sudah berjalan
- Cek kredensial di `.env.local`
- Pastikan database `simple_finance_db` sudah dibuat

### Error: "Prisma schema validation error"

**Solusi:**
```bash
npx prisma db push --skip-generate
```

### Port 3000 sudah terpakai

**Solusi:**
```bash
npm run dev -- -p 3001
```

(Ganti dengan port yang tersedia)

## 📦 Dependencies

Semua dependencies sudah terinstal. Jika perlu install ulang:

```bash
npm install
```

Untuk Prisma tools:
```bash
npm install -D prisma
npm install @prisma/client
```

## 💡 Tips & Best Practices

1. **Jangan commit `.env.local`** - Gunakan `.env.example` untuk template

2. **Regular Backups** - Backup database MySQL secara berkala

3. **Validation** - Server-side validation sudah diterapkan pada API

4. **Error Handling** - Error messages ditampilkan ke user dengan alert

5. **Type Safety** - TypeScript digunakan untuk type checking

## 🚢 Deployment (Optional)

Untuk deploy ke production (Vercel, Railway, dll):

1. Push kode ke GitHub
2. Connect repository ke platform hosting
3. Add `.env` variables di platform
4. Platform akan auto-build dan deploy

## 📞 Support

Jika ada pertanyaan atau error, cek:
- Console browser (F12) untuk frontend errors
- Terminal output untuk backend errors
- Prisma Studio untuk debug database

---

**Happy Tracking! 💰**
