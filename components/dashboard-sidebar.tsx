"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Wallet,
  BarChart3,
  Settings,
  Boxes,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Workforce", icon: Users },
  { label: "Billing", icon: CreditCard },
  { label: "Payroll", icon: Wallet },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
]

export function DashboardSidebar() {
  const [active, setActive] = useState("Workforce")

  return (
    <aside className="flex w-16 flex-col items-center gap-2 border-r border-sidebar-border bg-sidebar py-4 lg:w-60 lg:items-stretch lg:px-3">
      <div className="mb-4 flex items-center gap-2 px-0 lg:px-2">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Boxes className="size-5" />
        </div>
        <span className="hidden text-lg font-semibold tracking-tight text-sidebar-foreground lg:block">
          United
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Primary">
        {navItems.map(({ label, icon: Icon }) => {
          const isActive = active === label
          return (
            <button
              key={label}
              onClick={() => setActive(label)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center justify-center gap-3 rounded-md px-0 py-2.5 text-sm font-medium transition-colors lg:justify-start lg:px-3",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              title={label}
            >
              <Icon className="size-5 shrink-0" />
              <span className="hidden lg:block">{label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto hidden items-center gap-3 rounded-md border border-sidebar-border px-3 py-2.5 lg:flex">
        <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
          AC
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-sidebar-foreground">Acme Corp</p>
          <p className="truncate text-xs text-muted-foreground">Enterprise plan</p>
        </div>
      </div>
    </aside>
  )
}
