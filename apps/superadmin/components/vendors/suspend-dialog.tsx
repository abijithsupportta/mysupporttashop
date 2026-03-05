"use client";

import { ConfirmDialog } from "@/components/ui/dialog";

interface SuspendDialogProps {
  open: boolean;
  vendorName: string;
  action: "suspend" | "activate";
  onConfirm: () => void;
  onCancel: () => void;
}

export function SuspendDialog({
  open,
  vendorName,
  action,
  onConfirm,
  onCancel
}: SuspendDialogProps) {
  const isSuspend = action === "suspend";

  return (
    <ConfirmDialog
      open={open}
      title={isSuspend ? "Suspend Vendor" : "Activate Vendor"}
      description={
        isSuspend
          ? `Are you sure you want to suspend ${vendorName}? Their store will be hidden from customers.`
          : `Are you sure you want to activate ${vendorName}? Their store will be visible to customers.`
      }
      confirmText={isSuspend ? "Suspend" : "Activate"}
      confirmVariant={isSuspend ? "destructive" : "default"}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
