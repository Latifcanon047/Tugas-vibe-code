import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET: Retrieve all transactions or current user's transactions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode"); // 'month' or 'year'
    const month = searchParams.get("month"); // 1-12
    const year = searchParams.get("year"); // YYYY

    let whereClause: any = {
      userId: session.user.id,
    };

    if (mode === "month" && month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 1);
      whereClause.date = {
        gte: startDate,
        lt: endDate,
      };
    } else if (mode === "year" && year) {
      const startDate = new Date(parseInt(year), 0, 1);
      const endDate = new Date(parseInt(year) + 1, 0, 1);
      whereClause.date = {
        gte: startDate,
        lt: endDate,
      };
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("GET /api/transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}

// POST: Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, amount, type, date } = body;

    // Validation
    if (!title || amount === undefined || !type || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!["income", "expense"].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either "income" or "expense"' },
        { status: 400 },
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 },
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount,
        type,
        date: new Date(date),
        userId: session.user.id,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("POST /api/transactions error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 },
    );
  }
}
