"use client";

import { useEffect, useState } from "react";
import { WorkforceUsageSummary } from "@/lib/solvimon";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { clsx } from "clsx";

export default function BillingPage() {
  const [summary, setSummary] = useState<WorkforceUsageSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/billing/summary")
      .then((res) => res.json())
      .then((data) => { setSummary(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getRoiColor = (score: number) => {
    if (score >= 75) return "bg-chart-3/15 text-chart-3 border-chart-3/20";
    if (score >= 50) return "bg-primary/15 text-primary border-primary/20";
    return "bg-destructive/15 text-destructive border-destructive/20";
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center border-b border-border px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Billing</h1>
            <p className="text-sm text-muted-foreground">Cost analytics and automation savings</p>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-6 p-6">
          {loading && <p className="text-muted-foreground">Loading...</p>}
          {!loading && !summary && <p className="text-destructive">Error loading billing data.</p>}
          {summary && (() => {
            const agentRobotSpend = summary.byWorkerType["AI Agent"] + summary.byWorkerType["Robot"];
            const total = summary.byWorkerType.Human + summary.byWorkerType["AI Agent"] + summary.byWorkerType["Robot"];
            return (
              <>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[
                    { label: "MTD Total Spend", value: `$${summary.totalMtdUsd.toLocaleString()}`, highlight: false },
                    { label: "Human Equivalent Cost", value: `$${summary.humanEquivalentUsd.toLocaleString()}`, highlight: false },
                    { label: "Automation Savings", value: `$${summary.savingsUsd.toLocaleString()}`, highlight: true },
                    { label: "Agent & Robot Spend", value: `$${agentRobotSpend.toLocaleString()}`, highlight: false },
                  ].map((card) => (
                    <div key={card.label} className={clsx("rounded-xl border border-border p-5", card.highlight ? "bg-chart-3/10" : "bg-card")}>
                      <p className={clsx("text-sm font-medium", card.highlight ? "text-chart-3" : "text-muted-foreground")}>{card.label}</p>
                      <p className={clsx("mt-1 text-2xl font-semibold", card.highlight ? "text-chart-3" : "text-card-foreground")}>{card.value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                  <p className="text-sm font-semibold text-card-foreground">Spend by worker type</p>
                  <div className="h-3 w-full flex rounded-full overflow-hidden gap-0.5">
                    <div style={{ width: `${(summary.byWorkerType.Human / total) * 100}%` }} className="bg-primary/60" />
                    <div style={{ width: `${(summary.byWorkerType["AI Agent"] / total) * 100}%` }} className="bg-chart-3" />
                    <div style={{ width: `${(summary.byWorkerType["Robot"] / total) * 100}%` }} className="bg-primary" />
                  </div>
                  <div className="flex gap-5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-primary/60" />Human</span>
                    <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-chart-3" />AI Agent</span>
                    <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-primary" />Robot</span>
                  </div>
                </div>
                <section className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="px-5 py-4 border-b border-border">
                    <p className="text-sm font-semibold text-card-foreground">Cost drivers — agents & robots</p>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground">
                        <th className="px-5 py-3 text-left font-medium">Worker</th>
                        <th className="px-5 py-3 text-right font-medium">Trend</th>
                        <th className="px-5 py-3 text-right font-medium">ROI score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {summary.topCostDrivers.map((d) => (
                        <tr key={d.name} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-5 py-3 font-medium text-card-foreground">{d.name}</td>
                          <td className="px-5 py-3 text-right">
                            {d.trend === "up" && <ArrowUp className="inline w-4 h-4 text-destructive" />}
                            {d.trend === "down" && <ArrowDown className="inline w-4 h-4 text-chart-3" />}
                            {d.trend === "stable" && <Minus className="inline w-4 h-4 text-muted-foreground" />}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium border", getRoiColor(d.roiScore))}>{d.roiScore}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              </>
            );
          })()}
        </main>
      </div>
    </div>
  );
}
