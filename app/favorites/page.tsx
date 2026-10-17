"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { products } from "@/data/products";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import { buttonVariants } from "@/components/ui/button";

export default function FavoritesPage() {
  const { user, loading } = useAuth();
  const { favorites } = useFavorites();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div
          data-testid="loading"
          className="flex min-h-[60vh] items-center justify-center"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </main>
    );
  }

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div data-testid="favorites-page">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Your Favorites</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your saved products
            </p>
          </div>

          {favoriteProducts.length === 0 ? (
            <div
              data-testid="favorites-empty"
              className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
            >
              <h3 className="text-lg font-semibold">No favorites yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You haven&apos;t saved any products to your favorites list.
              </p>
              <Link
                href="/"
                className={buttonVariants({ size: "sm", className: "mt-6" })}
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteProducts.map((product) => (
                <div
                  key={product.id}
                  data-testid="favorite-item"
                  className="flex flex-col justify-between overflow-hidden rounded-lg border bg-card p-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <Link
                        href={`/products/${product.id}`}
                        className="font-semibold text-foreground hover:underline line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        {product.category}
                      </span>
                      <span className="mt-1 font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View Details &rarr;
                    </Link>
                    <FavoriteButton productId={product.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
