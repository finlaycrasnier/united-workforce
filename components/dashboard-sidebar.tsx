"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Wallet,
  BarChart3,
  Settings,
  Boxes,
  Network,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Workforce", href: "/", icon: Users },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Payroll", href: "/payroll", icon: Wallet },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Org Chart", href: "/org", icon: Network },
  { label: "Integrations", href: "/settings", icon: Plug },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

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
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href)
          return (
            <Link
              key={label}
              href={href}
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
            </Link>
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
