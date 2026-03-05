import { cn } from "@/lib/utils";

export function Table(props: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table {...props} className={cn("w-full text-sm", props.className)} />;
}

export function TableHead(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={cn("bg-[#fafafa] px-3 py-2 text-left font-medium", props.className)}
    />
  );
}

export function TableCell(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className={cn("px-3 py-2", props.className)} />;
}
