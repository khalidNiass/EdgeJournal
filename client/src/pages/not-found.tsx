import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-orange-500/10 text-orange-500">
            <AlertTriangle className="w-12 h-12" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">404 Page Not Found</h1>
        <p className="text-muted-foreground text-lg">
          The page you're looking for doesn't seem to exist. It might have been moved or deleted.
        </p>
        <Link href="/">
          <Button size="lg" className="mt-4">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
