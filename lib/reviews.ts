import { createClient } from "@supabase/supabase-js";

export type Review = {
  id: number;
  user_id: string;
  product_id: number;
  rating: number;
  comment: string;
  author: string;
  created_at: string;
};

export function calcAverage(reviews: { rating: number }[]) {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export async function getReviews(productId: number) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const { data, error } = await supabase
    .from("reviews")
    .select("id, user_id, product_id, rating, comment, author, created_at")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  const reviews = (data ?? []) as Review[];
  return { average: calcAverage(reviews), count: reviews.length, reviews };
}
