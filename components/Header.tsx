"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight">TechStore</Link>
        <nav className="flex items-center gap-3">
          {!loading && user ? (
            <>
              <span data-testid="user-email" className="text-sm font-medium">
                {user.email}
              </span>
              <Button variant="outline" data-testid="btn-logout" onClick={signOut}>
                Logout
              </Button>
            </>
          ) : !loading && !user ? (
            <>
              <Link href="/login" data-testid="btn-login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register" data-testid="btn-register">
                <Button>Register</Button>
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
