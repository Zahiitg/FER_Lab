import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      data-testid="not-found"
      className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center"
    >
      <h1 className="text-4xl font-extrabold tracking-tight">404 - Not Found</h1>
      <p className="mt-2 text-muted-foreground">
        The requested product or page could not be found.
      </p>
      <Link href="/" className={buttonVariants({ className: "mt-6" })}>
        Back to Home
      </Link>
    </main>
  );
}
