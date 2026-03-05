"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface VendorFormValues {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  owner_role: "vendor_owner" | "shop_owner";
  store_name: string;
  logo_url: string;
  address: string;
  city: string;
  state: string;
  district: string;
  pincode: string;
}

const EMPTY_VALUES: VendorFormValues = {
  email: "",
  password: "",
  full_name: "",
  phone: "",
  owner_role: "vendor_owner",
  store_name: "",
  logo_url: "",
  address: "",
  city: "",
  state: "",
  district: "",
  pincode: ""
};

function getInitialValues(
  mode: "create" | "edit",
  initialValues?: Partial<VendorFormValues>
): VendorFormValues {
  return {
    ...EMPTY_VALUES,
    ...initialValues,
    password: mode === "edit" ? "" : initialValues?.password ?? ""
  };
}

interface VendorFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  submitting?: boolean;
  initialValues?: Partial<VendorFormValues>;
  onCancel: () => void;
  onSubmit: (values: VendorFormValues) => Promise<void> | void;
}

export function VendorFormDialog({
  open,
  mode,
  submitting,
  initialValues,
  onCancel,
  onSubmit
}: VendorFormDialogProps) {
  const [values, setValues] = useState<VendorFormValues>(() =>
    getInitialValues(mode, initialValues)
  );
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!open) {
    return null;
  }

  const isEdit = mode === "edit";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!values.email || !values.full_name || !values.phone || !values.store_name) {
      setError("Please fill required fields.");
      return;
    }

    if (!isEdit && values.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!values.address || !values.city || !values.state || !values.district || !values.pincode) {
      setError("Address, city, state, district and pincode are required.");
      return;
    }

    await onSubmit(values);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#e5e5e5] bg-white p-4">
        <h3 className="text-lg font-semibold">
          {isEdit ? "Edit Vendor" : "Add New Vendor"}
        </h3>

        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={values.email}
                onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
            {!isEdit ? (
              <div>
                <Label>Password *</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                    value={values.password}
                    onChange={(event) =>
                      setValues((prev) => ({ ...prev, password: event.target.value }))
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ) : null}
            <div>
              <Label>Vendor Owner Name *</Label>
              <Input
                value={values.full_name}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, full_name: event.target.value }))
                }
              />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input
                value={values.phone}
                onChange={(event) => setValues((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </div>
            <div>
              <Label>Owner Role *</Label>
              <select
                className="h-10 w-full rounded-md border border-[#e5e5e5] bg-white px-3 text-sm outline-none focus:border-[#e85d2f] focus:ring-2 focus:ring-[#f7c5b3]"
                value={values.owner_role}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    owner_role: event.target.value as "vendor_owner" | "shop_owner"
                  }))
                }
              >
                <option value="vendor_owner">Vendor Owner</option>
                <option value="shop_owner">Shop Owner</option>
              </select>
            </div>
            <div>
              <Label>Shop Name *</Label>
              <Input
                value={values.store_name}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, store_name: event.target.value }))
                }
              />
            </div>
            <div>
              <Label>Logo URL</Label>
              <Input
                value={values.logo_url}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, logo_url: event.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <Label>Address *</Label>
              <Input
                value={values.address}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, address: event.target.value }))
                }
              />
            </div>
            <div>
              <Label>City *</Label>
              <Input
                value={values.city}
                onChange={(event) => setValues((prev) => ({ ...prev, city: event.target.value }))}
              />
            </div>
            <div>
              <Label>State *</Label>
              <Input
                value={values.state}
                onChange={(event) => setValues((prev) => ({ ...prev, state: event.target.value }))}
              />
            </div>
            <div>
              <Label>District *</Label>
              <Input
                value={values.district}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, district: event.target.value }))
                }
              />
            </div>
            <div>
              <Label>Pincode *</Label>
              <Input
                value={values.pincode}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, pincode: event.target.value }))
                }
              />
            </div>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Vendor"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
