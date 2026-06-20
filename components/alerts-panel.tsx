"use client"

import { useState } from "react"
import { workerAlerts, WorkerAlert } from "@/lib/workforce-data"
import { cn } from "@/lib/utils"
import { AlertTriangle, Info, X, CheckCircle } from "lucide-react"

const SEVERITY_STYLES = {
  critical: {
    border: "border-l-destructive bg-destructive/5",
    icon: AlertTriangle,
    iconColor: "text-destructive",
    badge: "bg-destructive/15 text-destructive border-destructive/30",
  },
  warning: {
    border: "border-l-chart-3 bg-chart-3/5",
    icon: AlertTriangle,
    iconColor: "text-chart-3",
    badge: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  },
  info: {
    border: "border-l-primary bg-primary/5",
    icon: Info,
    iconColor: "text-primary",
    badge: "bg-primary/15 text-primary border-primary/30",
  },
}

const ACTION_MESSAGES: Record<string, string> = {
  assign_owner: "Ownership reassignment workflow started.",
  rotate_credential: "Credential rotation queued — new ephemeral token in ~30s.",
  pause_agent: "Agent suspended. Human review required to resume.",
  dismiss: "Alert dismissed.",
}

interface AlertsPanelProps {
  className?: string
}

export function AlertsPanel({ className }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<WorkerAlert[]>(workerAlerts)
  const [toast, setToast] = useState<string | null>(null)

  const criticalCount = alerts.filter((a) => a.severity === "critical").length

  function handleAction(alertId: string, actionId: string) {
    if (actionId === "dismiss") {
      setAlerts((prev) => prev.filter((a) => a.id !== alertId))
    } else {
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, _acknowledged: true } : a))
      )
    }
    const msg = ACTION_MESSAGES[actionId] ?? "Action triggered."
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  if (alerts.length === 0) return null

  return (
    <section className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-card-foreground">Alerts</p>
          {criticalCount > 0 && (
            <span className="rounded-full bg-destructive/15 border border-destructive/30 px-2 py-0.5 text-xs font-medium text-destructive">
              {criticalCount} critical
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{alerts.length} open</span>
      </div>

      <div className="divide-y divide-border">
        {alerts.map((alert) => {
          const styles = SEVERITY_STYLES[alert.severity]
          const Icon = styles.icon
          return (
            <div key={alert.id} className={cn("border-l-4 px-5 py-4", styles.border)}>
              <div className="flex items-start gap-3">
                <Icon className={cn("size-4 mt-0.5 shrink-0", styles.iconColor)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-card-foreground">{alert.title}</span>
                    <span className={cn("rounded-full border px-1.5 py-0.5 text-xs", styles.badge)}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{alert.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {alert.actions.map((action) => (
                      <button
                        key={action.actionId}
                        onClick={() => handleAction(alert.id, action.actionId)}
                        className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-card-foreground hover:bg-secondary/50 transition-colors active:scale-95"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {toast && (
        <div className="flex items-center gap-2 border-t border-border bg-secondary/30 px-5 py-3">
          <CheckCircle className="size-3.5 text-chart-3 shrink-0" />
          <p className="text-xs text-muted-foreground">{toast}</p>
        </div>
      )}
    </section>
  )
}
