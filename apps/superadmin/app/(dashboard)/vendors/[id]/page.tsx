import { Suspense } from "react";
import { VendorDetailView } from "@/components/vendors/vendor-detail-view";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export default async function VendorDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VendorDetailView vendorId={id} />
    </Suspense>
  );
}
