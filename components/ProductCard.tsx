import { Product } from "@/data/products";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card data-testid="product-card" className="overflow-hidden flex flex-col justify-between">
      <div>
        <div className="relative">
          <img
            data-testid="product-image"
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2">
            <FavoriteButton productId={product.id} />
          </div>
        </div>
        <CardHeader>
          <CardTitle data-testid="product-name" className="line-clamp-1">
            <Link
              data-testid="link-detail"
              href={`/products/${product.id}`}
              className="hover:underline"
            >
              {product.name}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p
            data-testid="product-description"
            className="text-sm text-muted-foreground line-clamp-2"
          >
            {product.description}
          </p>
          <p
            data-testid="product-price"
            className="text-lg font-bold text-primary"
          >
            ${product.price.toFixed(2)}
          </p>
        </CardContent>
      </div>
      <div className="p-4 pt-0">
        <Link
          data-testid="link-detail"
          href={`/products/${product.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View Details &rarr;
        </Link>
      </div>
    </Card>
  );
}
