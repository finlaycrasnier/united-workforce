"use client";

import { useEffect, useState } from "react";
import { WorkforceUsageSummary } from "@/lib/solvimon";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { clsx } from "clsx";

export default function BillingPage() {
  const [summary, setSummary] = useState<WorkforceUsageSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/billing/summary")
      .then((res) => res.json())
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching billing data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-muted-foreground">Loading Analytics...</div>;
  if (!summary) return <div className="p-8 text-destructive">Error loading billing summary.</div>;

  const agentRobotSpend = summary.byWorkerType["AI Agent"] + summary.byWorkerType["Robot"];
  const total = summary.byWorkerType.Human + summary.byWorkerType["AI Agent"] + summary.byWorkerType["Robot"];

  const getRoiColor = (score: number) => {
    if (score >= 75) return "bg-chart-3/15 text-chart-3 border-chart-3/20";
    if (score >= 50) return "bg-primary/15 text-primary border-primary/20";
    return "bg-destructive/15 text-destructive border-destructive/20";
  };

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-card-foreground">Billing & Cost Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card">
          <p className="text-sm text-muted-foreground">MTD Total Spend</p>
          <p className="text-2xl font-bold text-card-foreground">${summary.totalMtdUsd.toLocaleString()}</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card">
          <p className="text-sm text-muted-foreground">Human Equivalent Cost</p>
          <p className="text-2xl font-bold text-card-foreground">${summary.humanEquivalentUsd.toLocaleString()}</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-chart-3/10">
          <p className="text-sm text-chart-3 font-semibold">Automation Savings</p>
          <p className="text-2xl font-bold text-chart-3">${summary.savingsUsd.toLocaleString()}</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card">
          <p className="text-sm text-muted-foreground">Agent & Robot Spend</p>
          <p className="text-2xl font-bold text-card-foreground">${agentRobotSpend.toLocaleString()}</p>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-border bg-card space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Spend Distribution</h2>
        <div className="h-8 w-full flex rounded-full overflow-hidden">
          <div style={{ width: `${(summary.byWorkerType.Human / total) * 100}%` }} className="bg-primary/60" title="Human" />
          <div style={{ width: `${(summary.byWorkerType["AI Agent"] / total) * 100}%` }} className="bg-chart-3" title="AI Agent" />
          <div style={{ width: `${(summary.byWorkerType.Robot / total) * 100}%` }} className="bg-primary" title="Robot" />
        </div>
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary/60" /> Human</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-chart-3" /> AI Agent</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /> Robot</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-card-foreground">Cost Drivers (Agents & Robots)</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-muted-foreground/5 text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-6 py-3 font-semibold">Worker</th>
              <th className="px-6 py-3 font-semibold text-right">Trend</th>
              <th className="px-6 py-3 font-semibold text-right">ROI Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {summary.topCostDrivers.map((driver) => (
              <tr key={driver.name} className="hover:bg-muted-foreground/5 transition-colors">
                <td className="px-6 py-4 font-medium text-card-foreground">{driver.name}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end">
                    {driver.trend === "up" && <ArrowUp className="w-4 h-4 text-destructive" />}
                    {driver.trend === "down" && <ArrowDown className="w-4 h-4 text-chart-3" />}
                    {driver.trend === "stable" && <Minus className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={clsx("px-2 py-1 rounded text-xs font-mono border", getRoiColor(driver.roiScore))}>
                    {driver.roiScore}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}