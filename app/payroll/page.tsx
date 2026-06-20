"use client";

import React, { useState, useEffect } from "react";
import { workersWithExtensions as workers, Worker } from "@/lib/workforce-data";
import { suggestPaymentEth, PayrollResult } from "@/lib/base-payroll";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { WorkerPayrollTable, TransactionHistoryTable, PaymentState, HistoryItem } from "@/components/payroll-tables";

export default function PayrollPage() {
  const [paymentData, setPaymentData] = useState<Record<string, PaymentState>>({});
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const initialData: Record<string, PaymentState> = {};
    workers.forEach((worker) => {
      if (worker.walletAddress) {
        const roi = worker.humanEquivalentCost && worker.actualCost
          ? Math.round(((worker.humanEquivalentCost - worker.actualCost) / worker.humanEquivalentCost) * 100)
          : Math.round((worker as any).efficiency ?? 80);
        initialData[worker.id] = {
          amount: suggestPaymentEth(worker.tasksCompleted, roi).toString(),
          status: "idle",
        };
      }
    });
    setPaymentData(initialData);
  }, []);

  const handleAmountChange = (id: string, val: string) => {
    setPaymentData((prev) => ({ ...prev, [id]: { ...prev[id], amount: val, status: "idle", error: undefined, txHash: undefined } }));
  };

  const processPayment = async (worker: Worker) => {
    const state = paymentData[worker.id];
    setPaymentData((prev) => ({ ...prev, [worker.id]: { ...state, status: "sending" } }));
    try {
      const response = await fetch("/api/payroll/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId: worker.id, walletAddress: worker.walletAddress, amountEth: parseFloat(state.amount) }),
      });
      const result: PayrollResult = await response.json();
      if (result.status === "confirmed") {
        setPaymentData((prev) => ({ ...prev, [worker.id]: { ...state, status: "success", txHash: result.txHash } }));
        setHistory((prev) => [{ id: result.id, workerName: worker.name, amount: state.amount, txHash: result.txHash, status: "confirmed", timestamp: new Date() }, ...prev]);
      } else {
        throw new Error(result.error || "Payment failed");
      }
    } catch (err: any) {
      setPaymentData((prev) => ({ ...prev, [worker.id]: { ...state, status: "error", error: err.message } }));
      setHistory((prev) => [{ id: crypto.randomUUID(), workerName: worker.name, amount: state.amount, status: "failed", timestamp: new Date() }, ...prev]);
    }
  };

  const eligibleWorkers = workers.filter((w) => !!w.walletAddress);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center border-b border-border px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Payroll</h1>
            <p className="text-sm text-muted-foreground">On-chain ETH payments via Base L2</p>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-6 p-6">
          <WorkerPayrollTable
            workers={eligibleWorkers}
            paymentData={paymentData}
            onAmountChange={handleAmountChange}
            onProcessPayment={processPayment}
          />
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-card-foreground">Transaction history</h2>
            <TransactionHistoryTable history={history} />
          </section>
        </main>
      </div>
    </div>
  );
}
