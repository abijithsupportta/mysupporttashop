import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "blue" | "purple" | "green" | "orange" | "yellow";
  trend?: string;
}

const colorStyles = {
  blue: "bg-[#eff6ff] text-[#2563eb]",
  purple: "bg-[#f5f3ff] text-[#7c3aed]",
  green: "bg-[#f0fdf4] text-[#16a34a]",
  orange: "bg-[#fff7ed] text-[#ea580c]",
  yellow: "bg-[#fefce8] text-[#ca8a04]"
};

export function StatsCard({ title, value, icon, color, trend }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="mt-1 text-2xl font-bold text-[#0f0f0f]">{value}</p>
          {trend ? <p className="mt-1 text-xs text-gray-500">{trend}</p> : null}
        </div>
        <div className={`rounded-lg p-2 ${colorStyles[color]}`}>{icon}</div>
      </CardContent>
    </Card>
  );
}
