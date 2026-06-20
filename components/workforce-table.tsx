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
    className: "border-chart-2/40 bg-chart-2/15 text-chart-2",
  },
  "AI Agent": {
    icon: Bot,
    className: "border-primary/40 bg-primary/15 text-primary",
  },
  Robot: {
    icon: Cpu,
    className: "border-chart-3/40 bg-chart-3/15 text-chart-3",
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
    <section className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-card-foreground">
            Active Workforce
          </h2>
          <p className="text-sm text-muted-foreground">
            {rows.length} {rows.length === 1 ? "worker" : "workers"} across humans, agents, and robots
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-secondary/40 p-1">
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
