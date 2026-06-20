"use client";

import React from "react";
import { Worker } from "@/lib/workforce-data";
import { ExternalLink, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaymentState {
  amount: string;
  status: "idle" | "sending" | "success" | "error";
  txHash?: string;
  error?: string;
}

export interface HistoryItem {
  id: string;
  workerName: string;
  amount: string;
  txHash?: string;
  status: "confirmed" | "failed";
  timestamp: Date;
}

interface WorkerPayrollTableProps {
  workers: Worker[];
  paymentData: Record<string, PaymentState>;
  onAmountChange: (id: string, val: string) => void;
  onProcessPayment: (worker: Worker) => void;
}

export function WorkerPayrollTable({ 
  workers, 
  paymentData, 
  onAmountChange, 
  onProcessPayment 
}: WorkerPayrollTableProps) {
  const truncateWallet = (address: string) => 
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted-foreground/5 text-muted-foreground">
            <th className="px-6 py-4 text-left font-medium">Worker</th>
            <th className="px-6 py-4 text-left font-medium">Wallet</th>
            <th className="px-6 py-4 text-right font-medium">Tasks</th>
            <th className="px-6 py-4 text-left font-medium">Amount (ETH)</th>
            <th className="px-6 py-4 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-card-foreground">
          {workers.map((worker) => {
            const state = paymentData[worker.id] || { amount: "0", status: "idle" };
            return (
              <tr key={worker.id} className="hover:bg-muted-foreground/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold">{worker.name}</div>
                  <div className="text-xs text-muted-foreground">{worker.type}</div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">
                  {worker.walletAddress ? truncateWallet(worker.walletAddress) : "-"}
                </td>
                <td className="px-6 py-4 text-right font-mono">
                  {worker.tasksCompleted}
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    step="0.000001"
                    value={state.amount}
                    onChange={(e) => onAmountChange(worker.id, e.target.value)}
                    className="w-32 rounded border border-border bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={state.status === "sending"}
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => onProcessPayment(worker)}
                      disabled={state.status === "sending"}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold transition-all",
                        state.status === "sending" 
                          ? "bg-border text-muted-foreground cursor-not-allowed" 
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      )}
                    >
                      {state.status === "sending" && <Loader2 className="h-3 w-3 animate-spin" />}
                      {state.status === "sending" ? "Sending..." : "Pay on Base"}
                    </button>
                    
                    {state.status === "success" && (
                      <a 
                        href={`https://sepolia.basescan.org/tx/${state.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] text-chart-3 hover:underline"
                      >
                        View TX <ExternalLink className="h-2 w-2" />
                      </a>
                    )}
                    
                    {state.status === "error" && (
                      <div className="flex items-center gap-1 text-[10px] text-destructive">
                        <AlertCircle className="h-2 w-2" /> {state.error}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function TransactionHistoryTable({ history }: { history: HistoryItem[] }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {history.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground text-sm">
          No transactions in this session.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-muted-foreground/5 text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Worker</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Amount</th>
              <th className="px-6 py-3 text-right">Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {history.map((item) => (
              <tr key={item.id} className="text-card-foreground">
                <td className="px-6 py-4 font-medium">{item.workerName}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {item.status === "confirmed" ? (
                      <CheckCircle2 className="h-4 w-4 text-chart-3" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="capitalize">{item.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono">{item.amount} ETH</td>
                <td className="px-6 py-4 text-right">
                  {item.txHash ? (
                    <a 
                      href={`https://sepolia.basescan.org/tx/${item.txHash}`}
                      target="_blank"
                      className="text-primary hover:underline text-xs font-mono"
                    >
                      {item.txHash.slice(0, 10)}...
                    </a>
                  ) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}