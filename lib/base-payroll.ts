export interface PayrollRequest {
  workerId: string;
  walletAddress: string;
  amountEth: number;
}

export interface PayrollResult {
  id: string;
  txHash?: string;
  status: "confirmed" | "failed";
  error?: string;
}

export function suggestPaymentEth(tasksCompleted: number, roiScore: number): number {
  // Calculation: min(tasks * 0.05 * (roi / 100) / 3420, 0.05)
  const calculation = (tasksCompleted * 0.05 * (roiScore / 100)) / 3420;
  return parseFloat(Math.min(calculation, 0.05).toFixed(6));
}

export async function sendPayroll(req: PayrollRequest): Promise<PayrollResult> {
  if (!process.env.BASE_RPC_URL) {
    // MockMode
    await new Promise((resolve) => setTimeout(resolve, 1800));
    
    const isFailure = Math.random() < 0.04;
    if (isFailure) {
      return {
        id: crypto.randomUUID(),
        status: "failed",
        error: "Simulation of 4% failure rate triggered."
      };
    }

    const randomHex = Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    return {
      id: crypto.randomUUID(),
      txHash: `0x${randomHex}`,
      status: "confirmed"
    };
  }

  throw new Error("Base Payroll Production integration requires BASE_RPC_URL.");
}