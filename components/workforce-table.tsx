"use client"

import { useMemo, useState } from "react"
import { User, Bot, Cpu, UserMinus } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { workers, type Worker, type WorkerType } from "@/lib/workforce-data"

const typeConfig: Record<
  WorkerType,
  { icon: typeof User; className: string }
> = {
  Human: {
    icon: User,
    className:
      "border-[oklch(0.62_0.16_18/0.35)] bg-[oklch(0.62_0.16_18/0.12)] text-[oklch(0.52_0.16_18)]",
  },
  "AI Agent": {
    icon: Bot,
    className:
      "border-[oklch(0.72_0.13_45/0.4)] bg-[oklch(0.72_0.13_45/0.16)] text-[oklch(0.5_0.13_42)]",
  },
  Robot: {
    icon: Cpu,
    className:
      "border-[oklch(0.7_0.11_85/0.4)] bg-[oklch(0.7_0.11_85/0.18)] text-[oklch(0.46_0.08_85)]",
  },
}

function TypeBadge({ type }: { type: WorkerType }) {
  const { icon: Icon, className } = typeConfig[type]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        className,
      )}
    >
      <Icon className="size-3.5" />
      {type}
    </span>
  )
}

function StatusBadge({ status }: { status: Worker["status"] }) {
  const map = {
    Active: "border-primary/40 bg-primary/10 text-primary",
    Idle: "border-muted-foreground/30 bg-muted text-muted-foreground",
    Flagged: "border-destructive/40 bg-destructive/15 text-destructive",
  } as const
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        map[status],
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "Active" && "bg-primary",
          status === "Idle" && "bg-muted-foreground",
          status === "Flagged" && "bg-destructive",
        )}
      />
      {status}
    </span>
  )
}

const filters: (WorkerType | "All")[] = ["All", "Human", "AI Agent", "Robot"]

export function WorkforceTable() {
  const [filter, setFilter] = useState<WorkerType | "All">("All")

  const rows = useMemo(
    () => (filter === "All" ? workers : workers.filter((w) => w.type === filter)),
    [filter],
  )

  return (
    <section className="overflow-hidden rounded-2xl bg-card/70 shadow-[var(--shadow-soft)] backdrop-blur-md">
      <div className="flex flex-col gap-4 border-b border-border/60 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-card-foreground">
            Active Workforce
          </h2>
          <p className="text-sm text-muted-foreground">
            {rows.length} {rows.length === 1 ? "worker" : "workers"} across humans, agents, and robots
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border/60 bg-secondary/50 p-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Type</TableHead>
              <TableHead>Worker</TableHead>
              <TableHead>Role / Subsystem</TableHead>
              <TableHead className="text-right">Uptime / Shift</TableHead>
              <TableHead className="text-right">Labour Cost</TableHead>
              <TableHead className="text-right">Tasks</TableHead>
              <TableHead className="text-right">Efficiency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((w) => (
              <TableRow key={w.id}>
                <TableCell>
                  <TypeBadge type={w.type} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-card-foreground">{w.name}</span>
                    <span className="text-xs text-muted-foreground">{w.id}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{w.role}</TableCell>
                <TableCell className="text-right tabular-nums text-card-foreground">
                  {w.uptime}
                </TableCell>
                <TableCell className="text-right tabular-nums text-card-foreground">
                  ${w.labourCost.toLocaleString()}
                </TableCell>
                <TableCell className="text-right tabular-nums text-card-foreground">
                  {w.tasksCompleted.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-secondary sm:block">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          w.efficiency >= 85
                            ? "bg-primary"
                            : w.efficiency >= 70
                              ? "bg-chart-3"
                              : "bg-destructive",
                        )}
                        style={{ width: `${w.efficiency}%` }}
                      />
                    </div>
                    <span className="tabular-nums text-card-foreground">{w.efficiency}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={w.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <UserMinus className="size-4" />
                    Offboard
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
