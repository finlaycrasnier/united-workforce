"use client"

import { useState, useCallback } from "react"
import { Users, DollarSign, Activity, CheckCircle, TrendingUp, ShieldAlert, AlertTriangle, Shield, Bot, Settings, GripVertical, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { ALL_KPIS, KpiDefinition } from "@/lib/worker-extensions"

const KPI_VALUES: Record<string, { value: string; sub: string; trend?: string }> = {
  headcount:      { value: "1,284", sub: "+42 this month", trend: "up" },
  labour_cost:    { value: "$2.41M", sub: "-3.8% vs last month", trend: "down" },
  efficiency:     { value: "87.4%", sub: "+1.6 pts", trend: "up" },
  tasks:          { value: "642,109", sub: "+12.3% this week", trend: "up" },
  savings:        { value: "$39,860", sub: "vs full FTE cost", trend: "up" },
  roi:            { value: "78 / 100", sub: "across 3 agents", trend: "up" },
  unowned:        { value: "1", sub: "Quill-3 — critical", trend: "bad" },
  critical_alerts:{ value: "2", sub: "action required", trend: "bad" },
  zk_rate:        { value: "88.7%", sub: "avg across agents", trend: "up" },
  agent_cost:     { value: "$4,450", sub: "MTD agent spend", trend: "stable" },
}

const KPI_ICONS: Record<string, typeof Users> = {
  headcount: Users,
  labour_cost: DollarSign,
  efficiency: Activity,
  tasks: CheckCircle,
  savings: TrendingUp,
  roi: TrendingUp,
  unowned: ShieldAlert,
  critical_alerts: AlertTriangle,
  zk_rate: Shield,
  agent_cost: Bot,
}

const CATEGORY_COLOR: Record<string, string> = {
  financial: "text-chart-3",
  operational: "text-primary",
  security: "text-destructive",
  workforce: "text-chart-2",
}

function KpiCard({ kpi, onRemove, dragging }: { kpi: KpiDefinition; onRemove: (id: string) => void; dragging: boolean }) {
  const data = KPI_VALUES[kpi.id]
  const Icon = KPI_ICONS[kpi.id] || Activity
  const isBad = data.trend === "bad"

  return (
    <div
      className={cn(
        "group relative rounded-xl border border-border bg-card p-5 min-w-[220px] flex-1 transition-all",
        dragging && "opacity-50 scale-95",
      )}
      draggable
    >
      {/* Drag handle */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-40 cursor-grab active:cursor-grabbing">
        <GripVertical className="size-4 text-muted-foreground" />
      </div>
      {/* Remove button */}
      <button
        onClick={() => onRemove(kpi.id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity"
        title="Remove KPI"
      >
        <X className="size-3.5 text-muted-foreground" />
      </button>

      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-medium text-muted-foreground pr-6 leading-tight">{kpi.label}</p>
        <div className={cn("p-1.5 rounded-lg bg-secondary", isBad ? "bg-destructive/10" : "")}>
          <Icon className={cn("size-4", isBad ? "text-destructive" : CATEGORY_COLOR[kpi.category])} />
        </div>
      </div>
      <p className={cn("text-2xl font-semibold text-card-foreground", isBad && "text-destructive")}>{data.value}</p>
      <p className={cn("text-xs mt-0.5", isBad ? "text-destructive/70" : "text-muted-foreground")}>{data.sub}</p>
    </div>
  )
}

export function CustomisableKpiBar() {
  const defaultVisible = ALL_KPIS.filter(k => k.defaultVisible).map(k => k.id)
  const [visibleIds, setVisibleIds] = useState<string[]>(defaultVisible)
  const [editing, setEditing] = useState(false)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const visibleKpis = visibleIds.map(id => ALL_KPIS.find(k => k.id === id)!).filter(Boolean)
  const hiddenKpis = ALL_KPIS.filter(k => !visibleIds.includes(k.id))

  const handleDragStart = useCallback((id: string) => {
    setDraggingId(id)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault()
    setDragOverId(id)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggingId || draggingId === targetId) return
    setVisibleIds(prev => {
      const next = [...prev]
      const fromIdx = next.indexOf(draggingId)
      const toIdx = next.indexOf(targetId)
      next.splice(fromIdx, 1)
      next.splice(toIdx, 0, draggingId)
      return next
    })
    setDraggingId(null)
    setDragOverId(null)
  }, [draggingId])

  const handleDragEnd = useCallback(() => {
    setDraggingId(null)
    setDragOverId(null)
  }, [])

  const removeKpi = (id: string) => {
    setVisibleIds(prev => prev.filter(v => v !== id))
  }

  const addKpi = (id: string) => {
    setVisibleIds(prev => [...prev, id])
  }

  return (
    <div className="space-y-3">
      {/* KPI row */}
      <div className="flex gap-3 flex-wrap">
        {visibleKpis.map(kpi => (
          <div
            key={kpi.id}
            draggable
            onDragStart={() => handleDragStart(kpi.id)}
            onDragOver={e => handleDragOver(e, kpi.id)}
            onDrop={e => handleDrop(e, kpi.id)}
            onDragEnd={handleDragEnd}
            className={cn(
              "min-w-[220px] flex-1 transition-all",
              dragOverId === kpi.id && draggingId !== kpi.id && "scale-105 ring-2 ring-primary ring-offset-1 ring-offset-background rounded-xl"
            )}
          >
            <KpiCard
              kpi={kpi}
              onRemove={removeKpi}
              dragging={draggingId === kpi.id}
            />
          </div>
        ))}

        {/* Customise button */}
        <button
          onClick={() => setEditing(v => !v)}
          className={cn(
            "flex items-center gap-1.5 rounded-xl border border-dashed border-border px-4 py-3 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors",
            editing && "border-primary text-primary"
          )}
        >
          <Settings className="size-3.5" />
          Customise
        </button>
      </div>

      {/* Customise panel */}
      {editing && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-card-foreground">Dashboard KPIs</p>
            <p className="text-xs text-muted-foreground">Drag cards above to reorder · click × to remove · click + to add</p>
          </div>
          {hiddenKpis.length === 0 ? (
            <p className="text-xs text-muted-foreground">All KPIs are visible.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {hiddenKpis.map(kpi => (
                <button
                  key={kpi.id}
                  onClick={() => addKpi(kpi.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:text-primary",
                    "border-border text-muted-foreground",
                  )}
                >
                  <Plus className="size-3" />
                  {kpi.label}
                  <span className={cn("ml-1 rounded-full px-1 py-0.5 text-xs", CATEGORY_COLOR[kpi.category])}>
                    {kpi.category}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
