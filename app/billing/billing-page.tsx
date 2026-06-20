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
          {summary && (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm font-medium text-muted-foreground">MTD Total Spend</p>
                  <p className="mt-1 text-2xl font-semibold text-card-foreground">${summary.totalMtdUsd.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm font-medium text-muted-foreground">Human Equivalent Cost</p>
                  <p className="mt-1 text-2xl font-semibold text-card-foreground">${summary.humanEquivalentUsd.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-border bg-chart-3/10 p-5">
                  <p className="text-sm font-medium text-chart-3">Automation Savings</p>
                  <p className="mt-1 text-2xl font-semibold text-chart-3">${summary.savingsUsd.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm font-medium text-muted-foreground">Agent & Robot Spend</p>
                  <p className="mt-1 text-2xl font-semibold text-card-foreground">
                    ${(summary.byWorkerType["AI Agent"] + summary.byWorkerType["Robot"]).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <p className="text-sm font-semibold text-card-foreground">Spend by worker type</p>
                <div className="h-3 w-full flex rounded-full overflow-hidden gap-0.5">
                  <div style={{ width: `${(summary.byWorkerType.Human / (summary.byWorkerType.Human + summary.byWorkerType["AI Agent"] + summary.byWorkerType["Robot"])) * 100}%` }} className="bg-primary/60" />
                  <div style={{ width: `${(summary.byWorkerType["AI Agent"] / (summary.byWorkerType.Human + summary.byWorkerType["AI Agent"] + summary.byWorkerType["Robot"])) * 100}%` }} className="bg-chart-3" />
                  <div style={{ width: `${(summary.byWorkerType["Robot"] / (summary.byWorkerType.Human + summary.byWorkerType["AI Agent"] + summary.byWorkerType["Robot"])) * 100}%` }} className="bg-primary" />
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
                          <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium border", getRoiColor(d.roiScore))}>
                            {d.roiScore}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
