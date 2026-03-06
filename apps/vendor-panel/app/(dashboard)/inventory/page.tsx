import { Plus, ScanLine, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const products = [
  { sku: "SKU-101", name: "Mini Samosa Box", stock: 120, status: "Healthy", price: "INR 299" },
  { sku: "SKU-102", name: "Masala Kaju Pack", stock: 18, status: "Low", price: "INR 450" },
  { sku: "SKU-103", name: "Filter Coffee Decoction", stock: 0, status: "Out", price: "INR 199" },
  { sku: "SKU-104", name: "Banana Chips Family Pack", stock: 64, status: "Healthy", price: "INR 220" }
];

function statusPill(status: string) {
  if (status === "Healthy") return "bg-emerald-100 text-emerald-700";
  if (status === "Low") return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export default function InventoryPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Inventory"
        description="Track stock levels, monitor critical items, and publish catalog updates quickly."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <ScanLine className="h-4 w-4" />
              Sync Stock
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total SKUs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">218</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-amber-700">17</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
              <ShieldAlert className="h-4 w-4" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-red-700">4</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto rounded-xl border border-[color:var(--line)] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">SKU</th>
                <th className="py-2">Product</th>
                <th className="py-2">Price</th>
                <th className="py-2">Stock</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.sku} className="border-t border-[color:var(--line)]">
                  <td className="py-2 font-medium text-slate-900">{product.sku}</td>
                  <td className="py-2 text-slate-600">{product.name}</td>
                  <td className="py-2 text-slate-600">{product.price}</td>
                  <td className="py-2 text-slate-600">{product.stock}</td>
                  <td className="py-2">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusPill(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
