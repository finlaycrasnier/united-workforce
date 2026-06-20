"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

const MONTHLY_DATA = [
  { month: "Jan", human: 49200, agent: 3800, robot: 3900, tasks: 520000, efficiency: 84 },
  { month: "Feb", human: 49400, agent: 3900, robot: 3950, tasks: 548000, efficiency: 85 },
  { month: "Mar", human: 49600, agent: 4000, robot: 4000, tasks: 571000, efficiency: 85 },
  { month: "Apr", human: 49500, agent: 4100, robot: 4050, tasks: 589000, efficiency: 86 },
  { month: "May", human: 49700, agent: 4250, robot: 4100, tasks: 610000, efficiency: 87 },
  { month: "Jun", human: 49700, agent: 4450, robot: 4190, tasks: 642000, efficiency: 87 },
]

const AGENT_PERFORMANCE = [
  { name: "Atlas-7", tasks: 12480, efficiency: 98, cost: 1180, roi: 91, trend: "up" as const },
  { name: "Ledger-9", tasks: 15230, efficiency: 96, cost: 1520, roi: 88, trend: "stable" as const },
  { name: "Hauler R-31", tasks: 5021, efficiency: 89, cost: 2340, roi: 78, trend: "stable" as const },
  { name: "Quill-3", tasks: 8760, efficiency: 72, cost: 940, roi: 54, trend: "down" as const },
]

const maxCost = Math.max(...MONTHLY_DATA.map(d => d.human + d.agent + d.robot))

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center border-b border-border px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Analytics</h1>
            <p className="text-sm text-muted-foreground">Workforce performance trends over time</p>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6">

          {/* Cost trend chart */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-card-foreground mb-4">Monthly labour cost by worker type</h2>
            <div className="flex items-end gap-2 h-40">
              {MONTHLY_DATA.map((d) => {
                const total = d.human + d.agent + d.robot
                const humanH = (d.human / maxCost) * 100
                const agentH = (d.agent / maxCost) * 100
                const robotH = (d.robot / maxCost) * 100
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col justify-end rounded-t overflow-hidden" style={{ height: "120px" }}>
                      <div className="w-full bg-primary/60 transition-all" style={{ height: `${humanH}%` }} title={`Human: $${d.human.toLocaleString()}`} />
                      <div className="w-full bg-chart-3 transition-all" style={{ height: `${agentH}%` }} title={`Agent: $${d.agent.toLocaleString()}`} />
                      <div className="w-full bg-primary transition-all" style={{ height: `${robotH}%` }} title={`Robot: $${d.robot.toLocaleString()}`} />
                    </div>
                    <span className="text-xs text-muted-foreground">{d.month}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex gap-5 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-primary/60" />Human</span>
              <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-chart-3" />AI Agent</span>
              <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-primary" />Robot</span>
            </div>
          </section>

          {/* Efficiency trend */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-card-foreground mb-4">Average output efficiency trend</h2>
            <div className="flex items-end gap-2 h-24">
              {MONTHLY_DATA.map((d, i) => {
                const prev = i > 0 ? MONTHLY_DATA[i-1].efficiency : d.efficiency
                const delta = d.efficiency - prev
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground">{d.efficiency}%</span>
                    <div
                      className="w-full rounded-t bg-primary transition-all"
                      style={{ height: `${(d.efficiency / 100) * 60}px` }}
                    />
                    <span className="text-xs text-muted-foreground">{d.month}</span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Agent performance table */}
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-card-foreground">Agent & robot performance ranking</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="px-5 py-3 text-left font-medium">Worker</th>
                  <th className="px-5 py-3 text-right font-medium">Tasks MTD</th>
                  <th className="px-5 py-3 text-right font-medium">Efficiency</th>
                  <th className="px-5 py-3 text-right font-medium">Cost MTD</th>
                  <th className="px-5 py-3 text-right font-medium">ROI score</th>
                  <th className="px-5 py-3 text-right font-medium">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {AGENT_PERFORMANCE.map((a) => (
                  <tr key={a.name} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-card-foreground">{a.name}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-card-foreground">{a.tasks.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className={cn("h-full rounded-full", a.efficiency >= 85 ? "bg-primary" : a.efficiency >= 70 ? "bg-chart-3" : "bg-destructive")}
                            style={{ width: `${a.efficiency}%` }} />
                        </div>
                        <span className="tabular-nums text-card-foreground">{a.efficiency}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-card-foreground">${a.cost.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold border",
                        a.roi >= 75 ? "bg-chart-3/15 text-chart-3 border-chart-3/30" :
                        a.roi >= 50 ? "bg-primary/15 text-primary border-primary/30" :
                        "bg-destructive/15 text-destructive border-destructive/30"
                      )}>{a.roi}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {a.trend === "up" && <TrendingUp className="inline size-4 text-chart-3" />}
                      {a.trend === "down" && <TrendingDown className="inline size-4 text-destructive" />}
                      {a.trend === "stable" && <Minus className="inline size-4 text-muted-foreground" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Task velocity */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-card-foreground mb-4">Task completion velocity</h2>
            <div className="flex items-end gap-2 h-24">
              {MONTHLY_DATA.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{(d.tasks / 1000).toFixed(0)}k</span>
                  <div className="w-full rounded-t bg-chart-3/70 transition-all"
                    style={{ height: `${(d.tasks / 700000) * 60}px` }} />
                  <span className="text-xs text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}
