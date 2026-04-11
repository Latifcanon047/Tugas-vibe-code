# 📖 Code Walkthrough

Penjelasan detail tentang setiap bagian penting dari kode.

## 🔵 Backend - API Routes

### `/src/app/api/transactions/route.ts`

Endpoint untuk GET (fetch) dan POST (create) transaksi.

```typescript
// GET: Retrieve all transactions
export async function GET() {
  try {
    // Query database untuk semua transaksi
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },  // Sorted by terbaru
    });
    return NextResponse.json(transactions);  // Return JSON
  } catch (error) {
    // Handle error
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
```

**Penjelasan:**
- `prisma.transaction.findMany()` = SELECT * FROM transactions
- `orderBy: { createdAt: 'desc' }` = ORDER BY createdAt DESC
- `NextResponse.json()` = Return JSON response
- `catch (error)` = Handle database errors

```typescript
// POST: Create a new transaction
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { title, amount, type } = body;

    // Validation
    if (!title || amount === undefined || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create in database
    const transaction = await prisma.transaction.create({
      data: { title, amount, type },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
```

**Penjelasan:**
- `request.json()` = Parse JSON dari request body
- Validasi input sebelum create
- `prisma.transaction.create()` = INSERT INTO database
- `status: 201` = Created successfully

### `/src/app/api/transactions/[id]/route.ts`

Endpoint untuk DELETE transaksi berdasarkan ID.

```typescript
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Parse ID dari URL
    const { id } = await params;
    const transactionId = parseInt(id);

    // Validate ID
    if (isNaN(transactionId)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    // Check if transaction exists
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Delete from database
    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    return NextResponse.json(
      { message: 'Transaction deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
```

**Penjelasan:**
- `[id]` = Dynamic route parameter
- `parseInt(id)` = Convert string ke number
- `findUnique()` = Check jika record ada
- `delete()` = DELETE FROM database
- Return 404 jika tidak ditemukan

---

## 🟡 Database - Prisma Schema

### `/prisma/schema.prisma`

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Transaction {
  id        Int       @id @default(autoincrement())  // Primary Key
  title     String    @db.VarChar(255)               // String, max 255 char
  amount    Float                                     // Decimal number
  type      String    @db.Enum("income", "expense")  // Only 2 values
  createdAt DateTime  @default(now())                // Auto current time
  updatedAt DateTime  @updatedAt                     // Auto update time
}
```

**Penjelasan:**
- `@id` = Primary key (unique identifier)
- `@default(autoincrement())` = Auto increment number
- `@db.VarChar(255)` = String column, max 255 chars
- `@db.Enum()` = Only allow specific values
- `@default(now())` = Set current timestamp saat create
- `@updatedAt` = Auto-update timestamp saat record diubah

---

## 🟢 Frontend - React Components

### `/src/components/Summary.tsx`

Menampilkan total income, expense, dan balance.

```typescript
export default function Summary({ transactions }: SummaryProps) {
  // Calculate total income
  const totalIncome = transactions
    .filter(t => t.type === 'income')    // Filter hanya income
    .reduce((sum, t) => sum + t.amount, 0);  // Jumlahkan

  // Calculate total expense
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate balance
  const balance = totalIncome - totalExpense;

  // Format as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Card 1: Total Income */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
        <h3>Total Income</h3>
        <p>{formatCurrency(totalIncome)}</p>
      </div>

      {/* Card 2: Total Expense */}
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6">
        <h3>Total Expense</h3>
        <p>{formatCurrency(totalExpense)}</p>
      </div>

      {/* Card 3: Balance */}
      <div className={balance >= 0 ? '...green...' : '...orange...'}>
        <h3>Balance</h3>
        <p>{formatCurrency(balance)}</p>
      </div>
    </div>
  );
}
```

**Penjelasan:**
- `.filter()` = Pilih hanya tertentu
- `.reduce()` = Jumlahkan semua values
- `Intl.NumberFormat()` = Format number sebagai currency
- Ternary operator `?` untuk conditional styling

### `/src/components/TransactionForm.tsx`

Form untuk menambahkan transaksi baru.

```typescript
export default function TransactionForm({ onSubmit, isLoading }) {
  const [title, setTitle] = useState('');      // State untuk title
  const [amount, setAmount] = useState('');    // State untuk amount
  const [type, setType] = useState('expense'); // State untuk type

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();  // Prevent page reload

    // Validation
    if (!title.trim() || !amount.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Call parent function
    onSubmit({
      title: title.trim(),
      amount: parseFloat(amount),
      type,
    });

    // Clear form
    setTitle('');
    setAmount('');
    setType('expense');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Salary"
      />

      {/* Input Amount */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
      />

      {/* Radio: Income or Expense */}
      <label>
        <input
          type="radio"
          value="income"
          checked={type === 'income'}
          onChange={(e) => setType(e.target.value)}
        />
        Income
      </label>

      {/* Submit Button */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  );
}
```

**Penjelasan:**
- `useState()` = React hooks untuk state management
- `handleSubmit` = Callback saat form submitted
- `e.preventDefault()` = Prevent default form submission
- `onChange` = Update state saat user input
- `disabled={isLoading}` = Disable tombol saat loading

### `/src/components/TransactionList.tsx`

Tabel yang menampilkan semua transaksi.

```typescript
export default function TransactionList({
  transactions,
  onDelete,
  isLoading,
}) {
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle empty state
  if (transactions.length === 0) {
    return <div>No transactions yet!</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {/* Loop setiap transaction */}
        {transactions.map((transaction) => (
          <tr key={transaction.id}>
            <td>{transaction.title}</td>
            <td>
              <span className={
                transaction.type === 'income'
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }>
                {transaction.type}
              </span>
            </td>
            <td className={
              transaction.type === 'income'
                ? 'text-green-600'
                : 'text-red-600'
            }>
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </td>
            <td>{formatDate(transaction.createdAt)}</td>
            <td>
              <button onClick={() => onDelete(transaction.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

**Penjelasan:**
- `map()` = Loop setiap transaction
- `key={transaction.id}` = Unique identifier untuk React
- Conditional styling `? true : false`
- `onClick` = Delete button handler

### `/src/app/page.tsx`

Main component yang mengatur semua components.

```typescript
export default function Home() {
  // State management
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data saat component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/transactions');
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        alert('Failed to fetch transactions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Handle add transaction
  const handleAddTransaction = async (data) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error();

      const newTransaction = await response.json();
      // Update state dengan transaction baru
      setTransactions([newTransaction, ...transactions]);
    } catch (error) {
      alert('Failed to add transaction');
    }
  };

  // Handle delete transaction
  const handleDeleteTransaction = async (id: number) => {
    if (!confirm('Delete this transaction?')) return;

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error();

      // Remove dari state
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      alert('Failed to delete transaction');
    }
  };

  return (
    <main>
      <h1>💰 Simple Finance Tracker</h1>

      {/* Pass transactions dan handlers ke components */}
      <Summary transactions={transactions} />
      <TransactionForm onSubmit={handleAddTransaction} />
      <TransactionList
        transactions={transactions}
        onDelete={handleDeleteTransaction}
      />
    </main>
  );
}
```

**Penjelasan:**
- `useEffect()` = Run function saat component mount
- `fetch()` = HTTP request ke API
- `setTransactions()` = Update state
- Props drilling = Pass data dan functions ke child components

---

## 🔗 Request/Response Flow

### Add Transaction Flow:

```
User fills form
    ↓
Click "Add Transaction"
    ↓
handleAddTransaction() called
    ↓
fetch('/api/transactions', { method: 'POST', body: {...} })
    ↓
Server POST /api/transactions
    ↓
prisma.transaction.create()
    ↓
MySQL INSERT (buat row baru)
    ↓
Return { id, title, amount, type, createdAt, ... }
    ↓
setTransactions([newTx, ...oldTx])
    ↓
Component re-render dengan UI baru
```

### Delete Transaction Flow:

```
User clicks delete icon
    ↓
confirm() dialog
    ↓
handleDeleteTransaction(id)
    ↓
fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    ↓
Server DELETE /api/transactions/[id]
    ↓
prisma.transaction.delete({ where: { id } })
    ↓
MySQL DELETE (hapus row)
    ↓
Return { message: 'deleted' }
    ↓
setTransactions(transactions.filter(t => t.id !== id))
    ↓
Component re-render tanpa transaction itu
```

---

## ✨ Key Concepts

### 1. Prisma (ORM)
```typescript
// Instead of raw SQL:
SELECT * FROM transactions WHERE id = 1;

// Prisma:
prisma.transaction.findUnique({ where: { id: 1 } });

// Advantages:
// - Type-safe
// - Prevents SQL injection
// - Cross-database compatible
```

### 2. React Hooks

**useState** - Manage state:
```typescript
const [count, setCount] = useState(0);
setCount(count + 1);
```

**useEffect** - Side effects:
```typescript
useEffect(() => {
  // Run saat component mount
  fetchData();
}, []); // Empty dependency = mount only
```

### 3. Tailwind CSS

```typescript
// Tailwind utility classes:
className="bg-green-100 text-green-600 p-4 rounded-lg hover:bg-green-200"

// Equivalent to:
.element {
  background-color: #dcfce7;      /* bg-green-100 */
  color: #16a34a;                 /* text-green-600 */
  padding: 1rem;                  /* p-4 */
  border-radius: 0.5rem;          /* rounded-lg */
}
.element:hover {
  background-color: #bbf7d0;      /* hover:bg-green-200 */
}
```

---

**Happy Learning! 🎓**
