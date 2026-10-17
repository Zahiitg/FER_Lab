import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q = "", category = "" } = await searchParams;
  const query = q.toLowerCase().trim();
  const cat = category.toLowerCase().trim();

  // Get unique categories for select
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Filter products server-side
  let filtered = [...products];

  if (query) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  if (cat) {
    filtered = filtered.filter((p) => p.category.toLowerCase() === cat);
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Featured Products</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Explore our tech gadgets and accessories
            </p>
          </div>

          {/* Search & Filter Form (Traditional GET, no client state) */}
          <form method="get" action="/" className="flex flex-wrap items-center gap-2">
            <Input
              data-testid="search-input"
              name="q"
              placeholder="Search products..."
              defaultValue={q}
              className="w-48 sm:w-64"
            />

            <select
              data-testid="category-select"
              name="category"
              defaultValue={category}
              className="flex h-9 w-36 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <Button data-testid="btn-search" type="submit" size="sm">
              Search
            </Button>
          </form>
        </div>

        {/* Product Listing or No Results */}
        {filtered.length === 0 ? (
          <div
            data-testid="no-results"
            className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
          >
            <h3 className="text-lg font-semibold">No products found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search query or filter to find what you&apos;re looking for.
            </p>
          </div>
        ) : (
          <div
            data-testid="product-list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
