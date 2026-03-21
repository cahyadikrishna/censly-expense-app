# Censly

Aplikasi pencatatan keuangan pribadi untuk melacak pengeluaran dan pemasukan harian.

> "Jangan males, catet pengeluaran pke AI~"

## Fitur

- **Autentikasi** - Login dan daftar dengan email/password via Supabase Auth
- **Pencatatan Transaksi** - Tambah, edit, dan hapus transaksi pemasukan/pengeluaran
- **Kategori** - Kategori default dan kategori kustom pengguna
- **Ringkasan Keuangan** - Lihat saldo total, total pemasukan, dan total pengeluaran
- **Pemindaian Struk** - Pindai struk belanja dengan AI untuk auto-fill data transaksi
- **Riwayat Transaksi** - Lihat semua transaksi dengan filter berdasarkan tipe

## Tech Stack

- **Framework**: React Native (Expo SDK 55) dengan expo-router
- **Bahasa**: TypeScript (strict mode)
- **Styling**: NativeWind (Tailwind CSS untuk React Native)
- **State Management**: Zustand (auth), TanStack React Query (server state)
- **Backend**: Supabase (Postgres + Auth + Storage)
- **Animasi**: React Native Reanimated

## Struktur Proyek

```
censly/
├── app/                    # expo-router pages (file-based routing)
│   ├── (auth)/             # Auth group routes
│   ├── (tabs)/             # Tab group routes
│   └── transaction/        # Transaction detail/add routes
├── components/             # Komponen UI reusable
├── hooks/                  # Custom hooks
├── lib/                    # Utilities (supabase, currency)
├── stores/                 # Zustand stores
├── types/                  # Shared TypeScript types
├── supabase/               # DB schema dan migrations
└── assets/                 # Gambar, fonts, icons
```

## Setup

### Prerequisites

- Node.js 18+
- npm atau yarn
- Akun Supabase (supabase.com)
- iOS Simulator / Android Emulator / Expo Go

### Langkah Setup

1. **Clone dan install dependencies**

```bash
git clone <repository-url>
cd censly
npm install
```

2. **Setup Supabase**

- Buat project baru di https://app.supabase.com
- Jalankan SQL schema di `supabase/schema.sql` via SQL Editor
- Copy environment variables:

```bash
# Buat file .env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-anon-key
```

3. **Jalankan aplikasi**

```bash
# Development (akan prompt untuk pilih platform)
npm start

# iOS saja
npm run ios

# Android saja
npm run android
```

## Database Schema

### Tables

**categories_default** - Kategori sistem (read-only)
- Expense: Makan 🍜, Transport 🚗, Belanja 🛍️, Tagihan 💡, Kesehatan 💊, Hiburan 🎮, Lainnya 📦
- Income: Gaji 💰, Freelance 💻, Investasi 📈, Lainnya 📦

**categories_custom** - Kategori kustom pengguna

**transactions** - Record transaksi utama dengan soft delete pattern

### Storage

- Bucket `receipts` (private) untuk menyimpan foto struk

## Konvensi Kode

### TypeScript
- Strict mode enabled
- Gunakan `type` untuk object shapes
- Path aliases: `@components/*`, `@lib/*`, `@hooks/*`, `@types/*`

### State Management
- **Server state**: TanStack React Query hooks
- **Auth state**: Zustand store
- **UI state**: `useState`/`useReducer` dalam komponen

### Pattern Soft Delete
Transaksi dan kategori tidak dihapus permanen - gunakan flag `is_deleted: true`

## License

MIT
