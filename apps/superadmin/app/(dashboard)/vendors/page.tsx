"use client";

import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Vendor } from "@/types/vendor";
import { useVendors } from "@/hooks/use-vendors";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { sendTestEmail } from "@/lib/services/client/email-service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SuspendDialog } from "@/components/vendors/suspend-dialog";
import {
  VendorFormDialog,
  type VendorFormValues
} from "@/components/vendors/vendor-form-dialog";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const VendorsTable = lazy(async () => {
  const tableModule = await import("@/components/vendors/vendors-table");
  return { default: tableModule.VendorsTable };
});

export default function VendorsPage() {
  const {
    vendors,
    totalPages,
    loading,
    error,
    params,
    setParams,
    addVendor,
    editVendor,
    removeVendor,
    updateVendorStatus
  } = useVendors({ page: 1, limit: 10 });

  const [searchInput, setSearchInput] = useState(params.search);
  const debouncedSearch = useDebouncedValue(searchInput, 500);
  const [dialogVendor, setDialogVendor] = useState<Vendor | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editVendorData, setEditVendorData] = useState<Vendor | null>(null);
  const [deleteVendorData, setDeleteVendorData] = useState<Vendor | null>(null);
  const [savingVendor, setSavingVendor] = useState(false);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [testEmailMessage, setTestEmailMessage] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    setParams((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch, setParams]);

  const statusTabs: Array<{ key: "all" | "active" | "suspended"; label: string }> =
    useMemo(
      () => [
        { key: "all", label: "All" },
        { key: "active", label: "Active" },
        { key: "suspended", label: "Suspended" }
      ],
      []
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            className="pl-9"
            placeholder="Search vendor by name or email"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          {statusTabs.map((tab) => (
            <Button
              key={tab.key}
              variant={params.status === tab.key ? "default" : "outline"}
              onClick={() => setParams((prev) => ({ ...prev, status: tab.key, page: 1 }))}
            >
              {tab.label}
            </Button>
          ))}
          <Button
            variant="outline"
            disabled={sendingTestEmail}
            onClick={() => {
              setSendingTestEmail(true);
              setActionError("");
              setTestEmailMessage("");

              void sendTestEmail()
                .then((result) => {
                  setTestEmailMessage(`Test email sent to ${result.to}`);
                })
                .catch((error) => {
                  const message =
                    error instanceof Error ? error.message : "Failed to send test email";
                  setActionError(message);
                })
                .finally(() => {
                  setSendingTestEmail(false);
                });
            }}
          >
            {sendingTestEmail ? "Sending Test Email..." : "Send Test Email"}
          </Button>
          <Button onClick={() => setCreateOpen(true)}>Add Vendor</Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      {testEmailMessage ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {testEmailMessage}
        </div>
      ) : null}

      <Suspense fallback={<Skeleton className="h-96" />}>
        <VendorsTable
          data={vendors}
          loading={loading}
          page={params.page}
          totalPages={totalPages}
          onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
          onToggleStatus={(vendor) => setDialogVendor(vendor)}
          onEdit={(vendor) => setEditVendorData(vendor)}
          onDelete={(vendor) => setDeleteVendorData(vendor)}
        />
      </Suspense>

      <SuspendDialog
        open={Boolean(dialogVendor)}
        vendorName={dialogVendor?.full_name ?? ""}
        action={dialogVendor?.is_active ? "suspend" : "activate"}
        onCancel={() => setDialogVendor(null)}
        onConfirm={() => {
          if (!dialogVendor) {
            return;
          }

          void updateVendorStatus(dialogVendor.id, !dialogVendor.is_active).finally(() => {
            setDialogVendor(null);
          });
        }}
      />

      <VendorFormDialog
        key={`create-${createOpen ? "open" : "closed"}`}
        open={createOpen}
        mode="create"
        submitting={savingVendor}
        onCancel={() => {
          setCreateOpen(false);
          setActionError("");
        }}
        onSubmit={async (values: VendorFormValues) => {
          setSavingVendor(true);
          setActionError("");
          try {
            await addVendor({
              email: values.email,
              password: values.password,
              full_name: values.full_name,
              phone: values.phone,
              owner_role: values.owner_role,
              is_active: true,
              store_name: values.store_name,
              logo_url: values.logo_url,
              address: values.address,
              city: values.city,
              state: values.state,
              district: values.district,
              pincode: values.pincode
            });
            setCreateOpen(false);
          } catch (submitError) {
            const message =
              submitError instanceof Error ? submitError.message : "Failed to create vendor";
            setActionError(message);
          } finally {
            setSavingVendor(false);
          }
        }}
      />

      <VendorFormDialog
        key={`edit-${editVendorData?.id ?? "none"}`}
        open={Boolean(editVendorData)}
        mode="edit"
        submitting={savingVendor}
        initialValues={{
          email: editVendorData?.email ?? "",
          full_name: editVendorData?.full_name ?? "",
          phone: editVendorData?.phone ?? "",
          owner_role: editVendorData?.owner_role ?? "vendor_owner",
          store_name: editVendorData?.store?.name ?? "",
          logo_url: editVendorData?.store?.logo_url ?? "",
          address: editVendorData?.store?.address ?? "",
          city: editVendorData?.store?.city ?? "",
          state: editVendorData?.store?.state ?? "",
          district: editVendorData?.store?.district ?? "",
          pincode: editVendorData?.store?.pincode ?? ""
        }}
        onCancel={() => {
          setEditVendorData(null);
          setActionError("");
        }}
        onSubmit={async (values: VendorFormValues) => {
          if (!editVendorData) {
            return;
          }

          setSavingVendor(true);
          setActionError("");
          try {
            await editVendor(editVendorData.id, {
              email: values.email,
              full_name: values.full_name,
              phone: values.phone,
              owner_role: values.owner_role,
              store_name: values.store_name,
              logo_url: values.logo_url,
              address: values.address,
              city: values.city,
              state: values.state,
              district: values.district,
              pincode: values.pincode
            });
            setEditVendorData(null);
          } catch (submitError) {
            const message =
              submitError instanceof Error ? submitError.message : "Failed to update vendor";
            setActionError(message);
          } finally {
            setSavingVendor(false);
          }
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteVendorData)}
        title="Delete Vendor"
        description={`Are you sure you want to delete ${deleteVendorData?.full_name ?? "this vendor"}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
        onCancel={() => setDeleteVendorData(null)}
        onConfirm={() => {
          if (!deleteVendorData) {
            return;
          }

          setSavingVendor(true);
          setActionError("");
          void removeVendor(deleteVendorData.id)
            .then(() => {
              setDeleteVendorData(null);
            })
            .catch((deleteError) => {
              const message =
                deleteError instanceof Error ? deleteError.message : "Failed to delete vendor";
              setActionError(message);
            })
            .finally(() => {
              setSavingVendor(false);
            });
        }}
      />
    </div>
  );
}
