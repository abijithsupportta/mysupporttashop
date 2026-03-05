import { cn } from "@/lib/utils";

export function Skeleton(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn("animate-pulse rounded-md bg-[#f1f1f1]", props.className)}
    />
  );
}
