// THIRD PARTY
import { Link } from "react-router-dom";
import { SearchX, ArrowLeft } from "lucide-react";

// THIRD PARTY COMPONENTS
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <SearchX className="h-8 w-8 text-primary" />
        </div>

        <h1 className="text-5xl font-bold">404</h1>

        <h2 className="mt-2 text-xl font-semibold">Page Not Found</h2>

        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Button className="mt-8 w-full" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
