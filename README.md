# 💰 Simple Finance Tracker

Aplikasi fullstack sederhana untuk melacak pendapatan (income) dan pengeluaran (expense) Anda. Dibangun dengan Next.js, Tailwind CSS, Prisma ORM, dan MySQL.

## ✨ Features

- ✅ **Tambah Transaksi** - Input income atau expense dengan mudah
- ✅ **Hapus Transaksi** - Hapus transaksi yang sudah tidak diperlukan
- ✅ **Lihat Semua Transaksi** - Tabel yang menampilkan semua transaksi
- ✅ **Perhitungan Otomatis** - Total income, total expense, dan balance
- ✅ **UI Modern** - Design responsif dengan Tailwind CSS
- ✅ **Validasi Data** - Validasi server-side untuk keamanan

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | React 19 + TypeScript |
| **Framework** | Next.js 15 (App Router) |
| **Styling** | Tailwind CSS |
| **Backend** | Next.js API Routes |
| **Database** | MySQL |
| **ORM** | Prisma |
| **Icons** | Lucide React |

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- MySQL 5.7+
- npm atau yarn

### 2. Setup Database
```bash
# Buat database MySQL
mysql -u root -p
CREATE DATABASE simple_finance_db;
```

### 3. Configure Environment
Edit `.env.local`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/simple_finance_db"
```

### 4. Initialize Database
```bash
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📖 Dokumentasi Lengkap

Untuk panduan setup dan troubleshooting detail, lihat [SETUP.md](./SETUP.md)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/transactions/           # API endpoints
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main page
├── components/
│   ├── TransactionForm.tsx         # Add transaction form
│   ├── TransactionList.tsx         # Transactions table
│   └── Summary.tsx                 # Balance summary cards
└── lib/
    └── prisma.ts                   # Prisma client
```

## 🔌 API Endpoints

```
GET    /api/transactions           # Get all transactions
POST   /api/transactions           # Create transaction
DELETE /api/transactions/[id]      # Delete transaction
```

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

## 🎯 How to Use

1. **Tambah Transaksi**
   - Isi Title (nama transaksi)
   - Isi Amount (jumlah uang)
   - Pilih Type (Income atau Expense)
   - Klik "Add Transaction"

2. **Lihat Summary**
   - Total Income ditampilkan di card hijau
   - Total Expense ditampilkan di card merah
   - Balance (sisa uang) ditampilkan di card biru

3. **Hapus Transaksi**
   - Klik icon trash pada transaksi yang ingin dihapus
   - Konfirmasi penghapusan

## 🧪 Running Tests & Build

```bash
# Build untuk production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Run ESLint
```

## 🎨 Customization

### Mengubah Currency
Edit [src/components/TransactionList.tsx](src/components/TransactionList.tsx) dan [src/components/Summary.tsx](src/components/Summary.tsx):
```typescript
// Ubah 'id-ID' dengan locale lain
'id-ID'  // Indonesia
'en-US' // US English
'ja-JP' // Japan
```

### Mengubah Colors
Edit component files dan ubah Tailwind classes (contoh: `bg-green-100` → `bg-blue-100`)

## 🤝 Contributing

Saran dan improvement welcome! Silakan fork dan buat pull request.

## 📄 License

MIT License - Bebas digunakan untuk personal dan commercial projects.

## 📞 Support

Jika ada masalah:
1. Cek [SETUP.md](./SETUP.md) - Troubleshooting section
2. Cek browser console (F12) untuk frontend errors
3. Cek terminal untuk backend errors

---

**Built with ❤️ using Next.js, Tailwind CSS, and Prisma**
