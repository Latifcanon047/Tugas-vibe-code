# ⚡ Quick Start Guide (5 Menit)

Panduan super cepat untuk menjalankan Simple Finance Tracker.

## 1️⃣ Prerequisites Check

Pastikan terinstal:
```bash
# Check Node.js
node --version    # Harus v18+

# Check npm
npm --version

# Check MySQL
mysql --version   # Atau buka MySQL Workbench
```

## 2️⃣ Database Setup (1 menit)

### Buka MySQL

**Windows/Mac/Linux:**
```bash
mysql -u root -p
# Masukkan password MySQL Anda
```

### Buat Database

```sql
CREATE DATABASE simple_finance_db;
EXIT;
```

## 3️⃣ Configure App (30 detik)

Edit file `.env.local` di folder project:

```env
DATABASE_URL="mysql://root:YOURPASSWORD@localhost:3306/simple_finance_db"
```

Ganti `YOURPASSWORD` dengan password MySQL Anda.

## 4️⃣ Initialize Database (1 menit)

```bash
npx prisma db push
```

Ketik `y` jika diminta konfirmasi.

## 5️⃣ Run Application (30 detik)

```bash
npm run dev
```

Buka browser ke: **http://localhost:3000**

## ✅ Done!

Aplikasi sudah berjalan! Mulai tambahkan transaksi Anda.

---

## 📝 Format Currency

Transaksi ditampilkan dalam IDR (Rupiah). Untuk mengubah currency:

Edit file `src/components/TransactionList.tsx` dan `src/components/Summary.tsx`

Cari: `'id-ID'` dan ganti dengan:
- `'en-US'` untuk USD
- `'ja-JP'` untuk JPY
- `'de-DE'` untuk EUR

## 🔗 Useful Links

- **Main App**: http://localhost:3000
- **Prisma Studio**: `npx prisma studio` (untuk manage database visually)

## ❌ Troubleshooting

### MySQL Connection Error?
```bash
# Pastikan MySQL service berjalan

# Windows: Buka Services dan cari MySQL
# Mac: brew services start mysql
# Linux: sudo systemctl start mysqld
```

### Port 3000 sudah terpakai?
```bash
npm run dev -- -p 3001
```

### Database schema error?
```bash
npx prisma db push --force-reset
```

⚠️ **Warning**: Ini akan hapus semua data!

---

**Need help? Lihat SETUP.md untuk dokumentasi lengkap.**
