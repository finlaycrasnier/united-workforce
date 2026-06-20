import { NextResponse } from "next/server";
import { sendPayroll, PayrollRequest } from "@/lib/base-payroll";

export async function POST(request: Request) {
  try {
    const body: PayrollRequest = await request.json();
    
    if (!body.workerId || !body.walletAddress || body.amountEth === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: workerId, walletAddress, or amountEth" },
        { status: 400 }
      );
    }

    const result = await sendPayroll(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Payroll Error", details: error.message },
      { status: 500 }
    );
  }
}