import { format } from "date-fns";

export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(value || 0);
}

export function formatDateDDMMYYYY(value: string): string {
  return format(new Date(value), "dd/MM/yyyy");
}
