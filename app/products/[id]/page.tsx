import { getProduct, products } from "@/data/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";
import { buttonVariants } from "@/components/ui/button";
import { getReviews, type Review } from "@/lib/reviews";
import { ReviewsProvider } from "@/contexts/ReviewsContext";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import type { Metadata } from "next";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  return products.map((p) => ({
    id: String(p.id),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found | TechStore",
    };
  }

  return {
    title: `${product.name} | TechStore`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  let initialReviews: Review[] = [];
  try {
    const res = await getReviews(product.id);
    initialReviews = res.reviews;
  } catch (e) {
    console.error("Failed to load initial reviews:", e);
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            data-testid="link-back"
            href="/"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            &larr; Back to Products
          </Link>
        </div>

        <div
          data-testid="product-detail"
          className="grid grid-cols-1 gap-8 md:grid-cols-2 rounded-lg border bg-card p-6 shadow-sm"
        >
          <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <FavoriteButton
                productId={product.id}
                className="bg-background/80 backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <span
                data-testid="detail-category"
                className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
              >
                {product.category}
              </span>

              <h1
                data-testid="detail-name"
                className="text-3xl font-bold tracking-tight text-foreground"
              >
                {product.name}
              </h1>

              <p
                data-testid="detail-price"
                className="text-2xl font-bold text-primary"
              >
                ${product.price.toFixed(2)}
              </p>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Description
                </h3>
                <p
                  data-testid="detail-description"
                  className="mt-2 text-base leading-relaxed text-foreground"
                >
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section wrapped with ReviewsProvider */}
        <ReviewsProvider
          productId={product.id}
          initialReviews={initialReviews}
        >
          <ReviewsSection productId={product.id} />
        </ReviewsProvider>
      </div>
    </main>
  );
}
