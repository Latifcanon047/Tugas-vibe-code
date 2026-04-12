import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// DELETE: Remove a transaction by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const transactionId = parseInt(id);

    if (isNaN(transactionId)) {
      return NextResponse.json(
        { error: "Invalid transaction ID" },
        { status: 400 },
      );
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    if (transaction.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    return NextResponse.json(
      { message: "Transaction deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/transactions/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 },
    );
  }
}
