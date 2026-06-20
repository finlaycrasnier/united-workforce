import { Users, DollarSign, Gauge, CheckCircle2, type LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Kpi {
  label: string
  value: string
  delta: string
  trend: "up" | "down"
  icon: LucideIcon
}

const kpis: Kpi[] = [
  {
    label: "Total Workforce Headcount",
    value: "1,284",
    delta: "+42 this month",
    trend: "up",
    icon: Users,
  },
  {
    label: "Monthly Labour Cost",
    value: "$2.41M",
    delta: "-3.8% vs last month",
    trend: "down",
    icon: DollarSign,
  },
  {
    label: "Avg Output Efficiency",
    value: "87.4%",
    delta: "+1.6 pts",
    trend: "up",
    icon: Gauge,
  },
  {
    label: "Total Tasks Completed",
    value: "642,109",
    delta: "+12.3% this week",
    trend: "up",
    icon: CheckCircle2,
  },
]

export function KpiBar() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <Card
          key={kpi.label}
          className="gap-3 border-0 bg-card/70 p-5 shadow-[var(--shadow-soft)] ring-0 backdrop-blur-md transition-shadow duration-300 hover:shadow-[var(--shadow-soft-lg)]"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{kpi.label}</span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <kpi.icon className="size-4" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-semibold tracking-tight text-card-foreground">
              {kpi.value}
            </span>
            <span
              className={
                kpi.trend === "up"
                  ? "text-xs font-medium text-primary"
                  : "text-xs font-medium text-chart-2"
              }
            >
              {kpi.delta}
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
}
