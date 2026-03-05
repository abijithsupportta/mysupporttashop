"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";
import type { Vendor } from "@/types/vendor";
import { DataTable } from "@/components/common/data-table";
import { VendorStatusBadge } from "@/components/vendors/vendor-status-badge";
import { Button } from "@/components/ui/button";
import { formatDateDDMMYYYY, formatINR } from "@/lib/format";

interface VendorsTableProps {
  data: Vendor[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onToggleStatus: (vendor: Vendor) => void;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

export function VendorsTable({
  data,
  loading,
  page,
  totalPages,
  onPageChange,
  onToggleStatus,
  onEdit,
  onDelete
}: VendorsTableProps) {
  const columns: ColumnDef<Vendor>[] = [
    {
      header: "Vendor",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.full_name}</p>
          <p className="text-xs text-gray-500">{row.original.email}</p>
        </div>
      )
    },
    {
      header: "Store Name",
      cell: ({ row }) => row.original.store?.name ?? "-"
    },
    {
      header: "Products",
      cell: ({ row }) => row.original.total_products ?? 0
    },
    {
      header: "Orders",
      cell: ({ row }) => row.original.total_orders ?? 0
    },
    {
      header: "Revenue ₹",
      cell: ({ row }) => formatINR(row.original.total_revenue ?? 0)
    },
    {
      header: "Commission ₹",
      cell: ({ row }) => formatINR(row.original.commission_earned ?? 0)
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <VendorStatusBadge is_active={row.original.is_active} />
      )
    },
    {
      header: "Joined",
      cell: ({ row }) => formatDateDDMMYYYY(row.original.created_at)
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link
            href={`/vendors/${row.original.id}`}
            className="inline-flex items-center rounded-md border border-[#e5e5e5] bg-white px-3 py-2 text-sm"
          >
            <Eye className="mr-1 h-4 w-4" />
            View
          </Link>
          <Button
            variant={row.original.is_active ? "destructive" : "default"}
            onClick={() => onToggleStatus(row.original)}
          >
            {row.original.is_active ? "Suspend" : "Activate"}
          </Button>
          <Button variant="outline" onClick={() => onEdit(row.original)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={() => onDelete(row.original)}>
            Delete
          </Button>
        </div>
      )
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
      emptyTitle="No vendors found"
      emptyDescription="Try updating your filters."
    />
  );
}
