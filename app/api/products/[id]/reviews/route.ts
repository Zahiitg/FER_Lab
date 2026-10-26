import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { getReviews } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = /^\d+$/.test(id) ? Number(id) : NaN;

  if (!products.some((p) => p.id === productId)) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  try {
    return NextResponse.json(await getReviews(productId));
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load reviews" },
      { status: 500 }
    );
  }
}
