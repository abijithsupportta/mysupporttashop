"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
      <p>{error.message}</p>
      <Button className="mt-2" onClick={reset}>
        Retry
      </Button>
    </div>
  );
}
