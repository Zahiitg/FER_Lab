"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  productId: number;
  className?: string;
}

export default function FavoriteButton({ productId, className = "" }: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();

  const favorite = isFavorite(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    await toggleFavorite(productId);
  };

  return (
    <button
      type="button"
      data-testid="btn-favorite"
      aria-pressed={favorite}
      onClick={handleClick}
      className={`rounded-full p-2 transition-colors hover:bg-muted ${
        favorite ? "text-red-500 fill-red-500" : "text-muted-foreground"
      } ${className}`}
      title={favorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={`h-5 w-5 ${favorite ? "fill-current" : ""}`} />
      <span className="sr-only">Toggle favorite</span>
    </button>
  );
}
