"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import type { Order } from "@/types/order";
import { DataTable } from "@/components/common/data-table";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { formatDateDDMMYYYY, formatINR } from "@/lib/format";
import { Button } from "@/components/ui/button";

interface OrdersTableProps {
  data: Order[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function OrdersTable({
  data,
  loading,
  page,
  totalPages,
  onPageChange
}: OrdersTableProps) {
  const columns: ColumnDef<Order>[] = [
    {
      header: "Order ID",
      cell: ({ row }) => {
        const shortId = row.original.id.slice(0, 8);
        return (
          <div className="flex items-center gap-1">
            <span>{shortId}</span>
            <button
              className="rounded p-1 hover:bg-[#f2f2f2]"
              onClick={() => navigator.clipboard.writeText(row.original.id)}
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      }
    },
    {
      header: "Vendor",
      cell: ({ row }) => row.original.vendor?.full_name ?? "-"
    },
    {
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <p>{row.original.customer_name}</p>
          <p className="text-xs text-gray-500">{row.original.customer_email}</p>
        </div>
      )
    },
    {
      header: "Items",
      cell: ({ row }) => row.original.order_items?.length ?? 0
    },
    {
      header: "Total ₹",
      cell: ({ row }) => formatINR(row.original.total)
    },
    {
      header: "Commission ₹",
      cell: ({ row }) => formatINR(row.original.commission)
    },
    {
      header: "Payment",
      cell: ({ row }) => <OrderStatusBadge status={row.original.payment_status} />
    },
    {
      header: "Order",
      cell: ({ row }) => <OrderStatusBadge status={row.original.order_status} />
    },
    {
      header: "Date",
      cell: ({ row }) => formatDateDDMMYYYY(row.original.created_at)
    }
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      emptyTitle="No orders found"
      emptyDescription="No matching orders for current filters."
    />
  );
}
