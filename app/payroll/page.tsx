"use client";

import React, { useState, useEffect } from "react";
import { workersWithExtensions as workers, Worker } from "@/lib/workforce-data";
import { suggestPaymentEth, PayrollResult } from "@/lib/base-payroll";
import { 
  WorkerPayrollTable, 
  TransactionHistoryTable, 
  PaymentState, 
  HistoryItem 
} from "@/components/payroll-tables";

export default function PayrollPage() {
  const [paymentData, setPaymentData] = useState<Record<string, PaymentState>>({});
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Initialize payment data for workers with wallets
  useEffect(() => {
    const initialData: Record<string, PaymentState> = {};
    workers.forEach((worker) => {
      if (worker.walletAddress) {
        const roi = calculateRoi(worker.humanEquivalentCost, worker.actualCost);
        initialData[worker.id] = {
          amount: suggestPaymentEth(worker.tasksCompleted, roi).toString(),
          status: "idle",
        };
      }
    });
    setPaymentData(initialData);
  }, []);

  function calculateRoi(humanCost: number, actualCost: number): number {
    if (humanCost === 0) return 0;
    return Math.round(((humanCost - actualCost) / humanCost) * 100);
  }

  const handleAmountChange = (id: string, val: string) => {
    setPaymentData((prev) => ({
      ...prev,
      [id]: { ...prev[id], amount: val, status: "idle", error: undefined, txHash: undefined },
    }));
  };

  const processPayment = async (worker: Worker) => {
    const state = paymentData[worker.id];
    setPaymentData((prev) => ({ ...prev, [worker.id]: { ...state, status: "sending" } }));

    try {
      const response = await fetch("/api/payroll/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId: worker.id,
          walletAddress: worker.walletAddress,
          amountEth: parseFloat(state.amount),
        }),
      });

      const result: PayrollResult = await response.json();

      if (result.status === "confirmed") {
        setPaymentData((prev) => ({
          ...prev,
          [worker.id]: { ...state, status: "success", txHash: result.txHash },
        }));
        setHistory((prev) => [
          {
            id: result.id,
            workerName: worker.name,
            amount: state.amount,
            txHash: result.txHash,
            status: "confirmed",
            timestamp: new Date(),
          },
          ...prev,
        ]);
      } else {
        throw new Error(result.error || "Payment failed");
      }
    } catch (err: any) {
      setPaymentData((prev) => ({
        ...prev,
        [worker.id]: { ...state, status: "error", error: err.message },
      }));
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          workerName: worker.name,
          amount: state.amount,
          status: "failed",
          timestamp: new Date(),
        },
        ...prev,
      ]);
    }
  };

  const eligibleWorkers = workers.filter((w) => !!w.walletAddress);

  return (
    <main className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Workforce Payroll</h1>
        <p className="text-muted-foreground">Distribute ETH payments to AI Agents and Robotic units on Base L2.</p>
      </div>

      <WorkerPayrollTable 
        workers={eligibleWorkers}
        paymentData={paymentData}
        onAmountChange={handleAmountChange}
        onProcessPayment={processPayment}
      />

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-card-foreground">Transaction History</h2>
        <TransactionHistoryTable history={history} />
      </section>
    </main>
  );
}