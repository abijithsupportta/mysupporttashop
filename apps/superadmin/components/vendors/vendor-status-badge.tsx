import { Badge } from "@/components/ui/badge";

interface VendorStatusBadgeProps {
  is_active: boolean;
}

export function VendorStatusBadge({ is_active }: VendorStatusBadgeProps) {
  if (is_active) {
    return <Badge className="bg-green-100 text-green-700">Active</Badge>;
  }

  return <Badge className="bg-red-100 text-red-700">Suspended</Badge>;
}
