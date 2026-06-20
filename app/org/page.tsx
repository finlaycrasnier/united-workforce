"use client"

import { useState } from "react"
import { User, Bot, Cpu, CheckCircle, AlertCircle, ShieldCheck, ShieldOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

// ── Data ──────────────────────────────────────────────────────────────────────
// Mirrors workforce-data.ts — update if you add workers

const ORG: OrgNode[] = [
  {
    id: "w-1042",
    name: "Maya Okonkwo",
    role: "Operations Lead",
    type: "Human",
    status: "Active",
    children: [
      {
        id: "a-2207",
        name: "Atlas-7",
        role: "Support Triage",
        type: "AI Agent",
        status: "Active",
        ownershipVerified: true,
        credentialType: "ephemeral",
        zkRate: 0.98,
        children: [],
      },
      {
        id: "a-2390",
        name: "Ledger-9",
        role: "Finance Reconciliation",
        type: "AI Agent",
        status: "Active",
        ownershipVerified: true,
        credentialType: "ephemeral",
        zkRate: 0.96,
        children: [],
      },
    ],
  },
  {
    id: "w-1088",
    name: "Daniel Reyes",
    role: "Field Technician",
    type: "Human",
    status: "Idle",
    children: [
      {
        id: "r-0031",
        name: "Hauler Unit R-31",
        role: "Warehouse Logistics",
        type: "Robot",
        status: "Active",
        children: [],
      },
    ],
  },
  {
    id: "w-1119",
    name: "Sofia Lindqvist",
    role: "Customer Success",
    type: "Human",
    status: "Active",
    children: [],
  },
  {
    id: "w-1156",
    name: "Tobias Müller",
    role: "QA Analyst",
    type: "Human",
    status: "Flagged",
    children: [],
  },
  // Unowned agent — no parent, shows as orphan
  {
    id: "a-2311",
    name: "Quill-3",
    role: "Content Generation",
    type: "AI Agent",
    status: "Flagged",
    ownershipVerified: false,
    credentialType: "static",
    zkRate: 0.72,
    unowned: true,
    children: [],
  },
]

// ── Types ─────────────────────────────────────────────────────────────────────

interface OrgNode {
  id: string
  name: string
  role: string
  type: "Human" | "AI Agent" | "Robot"
  status: "Active" | "Idle" | "Flagged"
  ownershipVerified?: boolean
  credentialType?: "ephemeral" | "static"
  zkRate?: number
  unowned?: boolean
  children: OrgNode[]
}

// ── Node card ─────────────────────────────────────────────────────────────────

function NodeCard({ node, depth = 0 }: { node: OrgNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = node.children.length > 0

  const typeColor = {
    Human: "border-chart-2/50 bg-chart-2/10",
    "AI Agent": "border-primary/50 bg-primary/10",
    Robot: "border-chart-3/50 bg-chart-3/10",
  }[node.type]

  const typeIcon = {
    Human: User,
    "AI Agent": Bot,
    Robot: Cpu,
  }[node.type]

  const TypeIcon = typeIcon

  const statusDot = {
    Active: "bg-chart-3",
    Idle: "bg-muted-foreground",
    Flagged: "bg-destructive",
  }[node.status]

  return (
    <div className="flex flex-col items-center">
      {/* Card */}
      <div
        className={cn(
          "relative rounded-xl border-2 px-4 py-3 w-48 text-center shadow-sm transition-all",
          typeColor,
          node.unowned && "border-destructive/60 bg-destructive/10 ring-2 ring-destructive/30",
          hasChildren && "cursor-pointer hover:opacity-80",
        )}
        onClick={() => hasChildren && setExpanded((v) => !v)}
      >
        {/* Status dot */}
        <span className={cn("absolute top-2 right-2 size-2 rounded-full", statusDot)} />

        {/* Icon */}
        <div className="flex justify-center mb-1.5">
          <TypeIcon className={cn("size-5",
            node.type === "Human" ? "text-chart-2" :
            node.type === "AI Agent" ? "text-primary" : "text-chart-3"
          )} />
        </div>

        {/* Name */}
        <p className="text-sm font-semibold text-card-foreground leading-tight">{node.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{node.role}</p>

        {/* Badges */}
        <div className="flex items-center justify-center gap-1 mt-2 flex-wrap">
          {node.type === "AI Agent" && node.ownershipVerified === true && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-chart-3/15 border border-chart-3/30 px-1.5 py-0.5 text-xs text-chart-3">
              <CheckCircle className="size-2.5" /> Owned
            </span>
          )}
          {node.type === "AI Agent" && node.ownershipVerified === false && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-destructive/15 border border-destructive/30 px-1.5 py-0.5 text-xs text-destructive">
              <AlertCircle className="size-2.5" /> No owner
            </span>
          )}
          {node.credentialType === "ephemeral" && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-chart-3/10 border border-chart-3/20 px-1.5 py-0.5 text-xs text-chart-3">
              <ShieldCheck className="size-2.5" /> Ephemeral
            </span>
          )}
          {node.credentialType === "static" && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-destructive/10 border border-destructive/20 px-1.5 py-0.5 text-xs text-destructive">
              <ShieldOff className="size-2.5" /> Static key
            </span>
          )}
          {node.zkRate !== undefined && (
            <span className={cn(
              "rounded-full px-1.5 py-0.5 text-xs font-medium",
              node.zkRate >= 0.9 ? "bg-primary/10 text-primary" :
              node.zkRate >= 0.7 ? "bg-chart-3/15 text-chart-3" :
              "bg-destructive/15 text-destructive"
            )}>
              {Math.round(node.zkRate * 100)}% ZK
            </span>
          )}
        </div>

        {/* Expand indicator */}
        {hasChildren && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 size-4 rounded-full bg-border flex items-center justify-center text-muted-foreground text-xs">
            {expanded ? "−" : "+"}
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="mt-6 flex gap-6 relative">
          {/* Horizontal connector line */}
          {node.children.length > 1 && (
            <div
              className="absolute top-0 border-t border-border"
              style={{
                left: `calc(50% - ${((node.children.length - 1) * (192 + 24)) / 2}px + 96px)`,
                width: `${(node.children.length - 1) * (192 + 24)}px`,
                transform: "translateY(-1px)",
              }}
            />
          )}
          {node.children.map((child) => (
            <div key={child.id} className="flex flex-col items-center">
              {/* Vertical line down to child */}
              <div className="w-px h-6 bg-border" />
              <NodeCard node={child} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function OrgChartPage() {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      {/* Sidebar imported inline to avoid circular dep — swap for DashboardSidebar if preferred */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Org chart</h1>
            <p className="text-sm text-muted-foreground">Ownership structure — humans, agents, robots</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-chart-3 inline-block" />Active</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-muted-foreground inline-block" />Idle</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-destructive inline-block" />Flagged</span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          {/* Owned workers */}
          <div className="flex gap-12 flex-wrap justify-center">
            {ORG.filter((n) => !n.unowned).map((node) => (
              <div key={node.id} className="flex flex-col items-center">
                <NodeCard node={node} />
              </div>
            ))}
          </div>

          {/* Unowned agents — shown separately with warning */}
          {ORG.filter((n) => n.unowned).length > 0 && (
            <div className="mt-12 border-t border-dashed border-destructive/40 pt-8">
              <div className="flex items-center gap-2 mb-6 justify-center">
                <AlertCircle className="size-4 text-destructive" />
                <p className="text-sm font-medium text-destructive">Unowned entities — no accountable human assigned</p>
              </div>
              <div className="flex gap-8 justify-center flex-wrap">
                {ORG.filter((n) => n.unowned).map((node) => (
                  <NodeCard key={node.id} node={node} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
