"use client"

import { useEffect, useRef } from "react"
import { X, ShieldCheck, ShieldOff, CheckCircle, AlertCircle, Zap, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { workerExtensions } from "@/lib/worker-extensions"

interface Worker {
  id: string
  name: string
  type: string
  role: string
  status: string
  efficiency: number
  tasksCompleted: number
  labourCost: number
  ownershipVerified?: boolean
  zkVerificationRate?: number
  walletAddress?: string
}

const RISK_COLOR = {
  low: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
}

export function WorkerDrawer({ worker, onClose }: { worker: Worker; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const ext = workerExtensions[worker.id]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      {/* Drawer */}
      <div
        ref={ref}
        className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-border bg-background shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">{worker.name}</h2>
              {worker.type === "AI Agent" && (
                worker.ownershipVerified
                  ? <CheckCircle className="size-4 text-chart-3" title="Ownership verified" />
                  : <AlertCircle className="size-4 text-destructive" title="No verified owner" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{worker.id} · {worker.role}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Efficiency", value: `${worker.efficiency}%` },
              { label: "Tasks MTD", value: worker.tasksCompleted.toLocaleString() },
              { label: "Labour Cost", value: `$${worker.labourCost.toLocaleString()}` },
            ].map(s => (
              <div key={s.label} className="rounded-lg border border-border bg-card p-3 text-center">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-sm font-semibold text-card-foreground mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Live cost ticker for agents */}
          {ext?.tokenBurnRate && (
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="size-4 text-amber-500" />
                <p className="text-sm font-medium text-card-foreground">Live cost</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-chart-3/10 px-2 py-0.5 text-xs text-chart-3 animate-pulse">
                  ● Live
                </span>
              </div>
              <LiveCostTicker baseRate={ext.tokenBurnRate} baseCost={ext.mtdCostLive ?? 0} />
            </div>
          )}

          {/* Permissions */}
          {ext?.permissions && ext.permissions.length > 0 && (
            <div>
              <p className="text-sm font-medium text-card-foreground mb-2">Permission scopes</p>
              <div className="flex flex-wrap gap-2">
                {ext.permissions.map(p => (
                  <span
                    key={p.scope}
                    className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", RISK_COLOR[p.risk])}
                  >
                    {p.scope}
                    <span className="ml-1.5 opacity-60">{p.risk}</span>
                  </span>
                ))}
              </div>
              {ext.permissions.some(p => p.risk === "high") && (
                <p className="mt-2 text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  High-risk permissions detected
                  {!worker.ownershipVerified && " — no verified owner assigned"}
                </p>
              )}
            </div>
          )}

          {/* Activity log */}
          {ext?.recentActivity && (
            <div>
              <p className="text-sm font-medium text-card-foreground mb-2">Recent activity</p>
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                {ext.recentActivity.map((event, i) => (
                  <div key={i} className={cn("flex items-start gap-3 px-4 py-3 text-xs", i < ext.recentActivity!.length - 1 && "border-b border-border")}>
                    <Clock className="size-3 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-muted-foreground">{event.timestamp}</span>
                        <span className="rounded bg-secondary px-1.5 py-0.5 font-medium text-card-foreground">{event.action}</span>
                      </div>
                      <p className="text-muted-foreground mt-0.5 truncate">{event.detail}</p>
                    </div>
                    {event.cost ? (
                      <span className="text-muted-foreground shrink-0">${event.cost.toFixed(3)}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wallet */}
          {worker.walletAddress && (
            <div>
              <p className="text-sm font-medium text-card-foreground mb-2">Base wallet</p>
              <p className="font-mono text-xs text-muted-foreground break-all bg-card border border-border rounded-lg px-3 py-2">
                {worker.walletAddress}
              </p>
            </div>
          )}

          {/* ZK rate */}
          {worker.zkVerificationRate !== undefined && (
            <div>
              <p className="text-sm font-medium text-card-foreground mb-2">zkVerify proof rate</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", worker.zkVerificationRate >= 0.9 ? "bg-primary" : worker.zkVerificationRate >= 0.7 ? "bg-chart-3" : "bg-destructive")}
                    style={{ width: `${worker.zkVerificationRate * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-card-foreground w-12 text-right">
                  {Math.round(worker.zkVerificationRate * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function LiveCostTicker({ baseRate, baseCost }: { baseRate: number; baseCost: number }) {
  const [cost, setCost] = useState(baseCost)
  const [tokens, setTokens] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const tokensPerTick = baseRate / 10
      const costPerTick = (tokensPerTick * 0.000003)
      setTokens(t => t + tokensPerTick)
      setCost(c => c + costPerTick)
    }, 100)
    return () => clearInterval(interval)
  }, [baseRate])

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <p className="text-xs text-muted-foreground">MTD spend</p>
        <p className="text-lg font-semibold text-card-foreground">${cost.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Tokens this session</p>
        <p className="text-lg font-semibold text-card-foreground">{Math.round(tokens).toLocaleString()}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Burn rate</p>
        <p className="text-sm font-medium text-card-foreground">{baseRate} tokens/min</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Cost rate</p>
        <p className="text-sm font-medium text-card-foreground">${(baseRate * 0.000003 * 60).toFixed(4)}/min</p>
      </div>
    </div>
  )
}

// Need useState in the same file for LiveCostTicker
import { useState } from "react"
