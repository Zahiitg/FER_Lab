import { Product } from "@/data/products";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card data-testid="product-card" className="overflow-hidden">
      <img
        data-testid="product-image"
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <CardHeader>
        <CardTitle data-testid="product-name">{product.name}</CardTitle>
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
    </Card>
  );
}
