# 🏗️ Architecture Overview

Panduan teknis tentang struktur dan arsitektur aplikasi Simple Finance Tracker.

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  BROWSER (Client-Side)                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React Components                                      │  │
│  │  - TransactionForm (UI untuk input)                   │  │
│  │  - TransactionList (UI untuk menampilkan data)        │  │
│  │  - Summary (UI untuk statistik)                       │  │
│  │  - Home/Page (Main component)                         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP Requests/Responses
                            │
┌─────────────────────────────────────────────────────────────┐
│              SERVER (Next.js Backend)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  API Routes (src/app/api/)                            │  │
│  │  ├── GET  /api/transactions (fetch all)              │  │
│  │  ├── POST /api/transactions (create new)             │  │
│  │  └── DELETE /api/transactions/[id] (delete)          │  │
│  │                                                        │  │
│  │  Libraries:                                           │  │
│  │  - Prisma Client (ORM)                               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                    SQL Queries
                            │
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (MySQL)                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  transactions table                                    │  │
│  │  ├── id (INT, PRIMARY KEY)                            │  │
│  │  ├── title (VARCHAR)                                  │  │
│  │  ├── amount (FLOAT)                                   │  │
│  │  ├── type (ENUM: 'income', 'expense')                 │  │
│  │  ├── createdAt (DATETIME)                             │  │
│  │  └── updatedAt (DATETIME)                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📂 Directory Structure

### `/src/app/` - Main Application

```
app/
├── api/                          # API Routes
│   └── transactions/
│       ├── route.ts              # GET, POST /api/transactions
│       └── [id]/
│           └── route.ts          # DELETE /api/transactions/[id]
├── globals.css                   # Global styles & Tailwind directives
├── layout.tsx                    # Root layout (metadata, providers)
└── page.tsx                      # Home page (main UI)
```

### `/src/components/` - React Components

```
components/
├── TransactionForm.tsx           # Form untuk input transaksi
│   └── Handles: validation, form state, submit
│
├── TransactionList.tsx           # Tabel menampilkan transaksi
│   └── Handles: formatting, delete actions, display logic
│
└── Summary.tsx                   # Statistik income/expense/balance
    └── Handles: calculations, formatting, display
```

### `/src/lib/` - Utilities & Libraries

```
lib/
└── prisma.ts                     # Prisma Client singleton
    └── Prevents: multiple PrismaClient instances
    └── Improves: HMR compatibility
```

### `/prisma/` - Database Configuration

```
prisma/
└── schema.prisma                 # Database schema definition
    ├── Generator configuration
    ├── Datasource configuration
    └── Model definitions
```

## 🔄 Data Flow

### CREATE Transaction (POST)

```
User Input
    ↓
Form Validation (client)
    ↓
HTTP POST /api/transactions
    ↓
Server Validation
    ↓
Prisma.transaction.create()
    ↓
MySQL INSERT
    ↓
Return created transaction
    ↓
Update state + UI re-render
```

### READ Transactions (GET)

```
Page Load / Component Mount
    ↓
useEffect hook triggers
    ↓
HTTP GET /api/transactions
    ↓
Prisma.transaction.findMany()
    ↓
MySQL SELECT * ORDER BY createdAt DESC
    ↓
Return array of transactions
    ↓
Set state + UI re-render
```

### DELETE Transaction (DELETE)

```
User clicks delete icon
    ↓
Confirm dialog
    ↓
HTTP DELETE /api/transactions/[id]
    ↓
Server validates ID
    ↓
Prisma.transaction.delete()
    ↓
MySQL DELETE WHERE id = ?
    ↓
Return success message
    ↓
Update state + UI re-render
```

## 🧩 Component Relationships

```
page.tsx (Home)
│
├─── useEffect ──── fetch /api/transactions
│
├─── state management
│    ├── transactions[]
│    ├── isLoading
│    └── isSubmitting
│
├─── handlers
│    ├── handleAddTransaction
│    │   └── POST /api/transactions
│    └── handleDeleteTransaction
│        └── DELETE /api/transactions/[id]
│
└─── render
     ├── <Summary transactions={data} />
     │   ├── calculate totalIncome
     │   ├── calculate totalExpense
     │   └── calculate balance
     │
     ├── <TransactionForm onSubmit={handler} />
     │   └── emit new transaction
     │
     └── <TransactionList transactions={data} onDelete={handler} />
         └── display all transactions + delete button
```

## 🛡️ Type Safety

Semua komponen memiliki TypeScript interfaces untuk type safety:

```typescript
// API Route Handler
export async function POST(request: NextRequest): Promise<NextResponse>

// React Component Props
interface TransactionFormProps {
  onSubmit: (data: { title: string; amount: number; type: string }) => void;
  isLoading?: boolean;
}

// Data Models
interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  createdAt: string;
}
```

## ⚡ Performance Optimizations

1. **Prisma Client Singleton** - Reuse connection untuk dev mode
2. **Client-side State** - Optimistic updates tanpa wait untuk server
3. **Conditional Rendering** - Load states & empty states
4. **CSS-in-JS** - Tailwind utility classes (no CSS overhead)
5. **SPA Navigation** - No full page reloads

## 🔐 Security Features

1. **Server-side Validation** - Check semua input di API routes
2. **Type Validation** - TypeScript prevents type mismatches
3. **SQL Injection Prevention** - Prisma parameterized queries
4. **Input Sanitization** - Trim dan validate di form
5. **Error Handling** - Proper HTTP status codes

## 🎨 Styling Architecture

```
globals.css (Tailwind directives)
    ↓
tailwind.config.ts (configuration)
    ↓
Utility classes (applied in components)
    ↓
Example: className="bg-green-100 text-green-600"
```

### Tailwind Classes Used

- **Spacing**: `p-6`, `mb-4`, `gap-4`
- **Colors**: `bg-green-100`, `text-red-600`, `hover:bg-blue-600`
- **Layout**: `grid`, `flex`, `flex-col`, `lg:col-span-2`
- **Responsive**: `md:grid-cols-2`, `lg:col-span-3`
- **States**: `hover:`, `disabled:`, `focus:`

## 📊 State Management

### Global State (in page.tsx)

```typescript
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [isSubmitting, setIsSubmitting] = useState(false);
```

### Local Component State

**TransactionForm:**
- title, amount, type (form inputs)

**TransactionList:**
- Pure functional - no internal state

**Summary:**
- Pure functional - calculations only

## 🔄 API Error Handling

### Standard Error Responses

```typescript
// 400 Bad Request
{ error: 'Missing required fields' }

// 404 Not Found
{ error: 'Transaction not found' }

// 500 Server Error
{ error: 'Failed to delete transaction' }
```

### Client Error Handling

```typescript
try {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  // Process response
} catch (error) {
  // Show error to user
  alert(error.message);
}
```

## 📈 Scaling Considerations

Jika aplikasi perlu di-scale:

1. **Database**: Add indexes untuk frequently queried columns
2. **Caching**: Implement Redis untuk caching transactions
3. **Pagination**: Add limit/offset untuk large datasets
4. **Authentication**: Add user authentication & authorization
5. **Search/Filter**: Add search dan filter functionality
6. **Audit Logs**: Track siapa yang membuat/menghapus transaksi

## 🚀 Deployment Architecture

```
Local Development
    ↓
GitHub Repository
    ↓
Vercel / Railway / Heroku
    ↓
Production MySQL Database
    ↓
Live Application
```

---

**Architecture: Clean, Scalable, Type-Safe** ✨
