import { NextResponse } from "next/server";
import { getWorkforceUsageSummary } from "@/lib/solvimon";

export async function GET() {
  try {
    const summary = await getWorkforceUsageSummary();
    return NextResponse.json(summary);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch billing summary", details: error.message },
      { status: 500 }
    );
  }
}