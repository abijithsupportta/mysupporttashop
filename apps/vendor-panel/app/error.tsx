"use client";

export default function Error({ error }: { error: Error }) {
  return <div>Error: {error.message}</div>;
}
