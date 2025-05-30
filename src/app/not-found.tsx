import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon, TriangleAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <TriangleAlert className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight mt-6">
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">
          Page not found
        </h2>

        <p className="mt-4 text-lg text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. The
          page might have been removed, had its name changed, or is temporarily
          unavailable.
        </p>

        <div className="mt-8">
          <Link href="/">
            <Button className="inline-flex items-center px-4 py-2 bg-primary">
              <HomeIcon className="mr-2 h-4 w-4" />
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
