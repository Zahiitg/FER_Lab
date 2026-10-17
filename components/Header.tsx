"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Heart } from "lucide-react";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const { favorites } = useFavorites();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight">
          TechStore
        </Link>
        <nav className="flex items-center gap-3">
          {!loading && user ? (
            <>
              <Link
                href="/favorites"
                data-testid="link-favorites"
                className="flex items-center gap-1.5 text-sm font-medium hover:text-primary"
              >
                <Heart className="h-4 w-4 fill-current text-red-500" />
                <span>Favorites</span>
                <span
                  data-testid="favorites-count"
                  className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold"
                >
                  {favorites.length}
                </span>
              </Link>
              <Link href="/account" className="text-sm font-medium hover:underline">
                <span data-testid="user-email">{user.email}</span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                data-testid="btn-logout"
                onClick={signOut}
              >
                Logout
              </Button>
            </>
          ) : !loading && !user ? (
            <>
              <Link href="/login" data-testid="btn-login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register" data-testid="btn-register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          ) : (
            <div className="h-9 w-32" />
          )}
        </nav>
      </div>
    </header>
  );
}
