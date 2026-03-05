import { NextResponse } from "next/server";
import { listOrdersService } from "@/lib/services/server/orders-service";
import type { ApiResponse } from "@/types/api";
import type { OrderStatus, PaymentStatus } from "@/types/order";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");
    const search = searchParams.get("search") ?? "";
    const order_status = (searchParams.get("order_status") ?? "all") as
      | OrderStatus
      | "all";
    const payment_status = (searchParams.get("payment_status") ?? "all") as
      | PaymentStatus
      | "all";
    const vendor_id = searchParams.get("vendor_id") ?? "all";
    const from_date = searchParams.get("from_date") ?? "";
    const to_date = searchParams.get("to_date") ?? "";

    const result = await listOrdersService({
      page,
      limit,
      search,
      order_status,
      payment_status,
      vendor_id,
      from_date,
      to_date
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/orders", error);
    const message = error instanceof Error ? error.message : "Server error";
    const response: ApiResponse<null> = {
      success: false,
      error: message
    };
    return NextResponse.json(response, { status: 500 });
  }
}
