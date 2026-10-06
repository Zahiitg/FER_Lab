import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Product Listing */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">
          Featured Products
        </h2>

        <div
          data-testid="product-list"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
