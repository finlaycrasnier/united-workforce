// Extended worker data — permissions, activity logs, live cost data
// Add this as a new file: lib/worker-extensions.ts

export interface Permission {
  scope: string
  risk: "low" | "medium" | "high"
}

export interface ActivityEvent {
  timestamp: string
  action: string
  detail: string
  cost?: number
}

export interface WorkerExtension {
  permissions?: Permission[]
  recentActivity?: ActivityEvent[]
  tokenBurnRate?: number    // tokens per minute (agents only)
  mtdCostLive?: number      // running MTD cost, increments in UI
  uptimePct?: number        // for robots
}

export const workerExtensions: Record<string, WorkerExtension> = {
  "a-2207": {
    permissions: [
      { scope: "web_search", risk: "low" },
      { scope: "ticket_api", risk: "low" },
      { scope: "email_send", risk: "medium" },
    ],
    tokenBurnRate: 320,
    mtdCostLive: 1180,
    recentActivity: [
      { timestamp: "14:02:11", action: "web_search", detail: "Searched: billing dispute account #94822", cost: 0.002 },
      { timestamp: "14:01:58", action: "ticket_api", detail: "Fetched ticket #94822 details", cost: 0.001 },
      { timestamp: "14:01:44", action: "email_send", detail: "Drafted response to customer", cost: 0.004 },
      { timestamp: "14:00:10", action: "web_search", detail: "Searched: refund policy clause 4.2", cost: 0.002 },
      { timestamp: "13:59:02", action: "ticket_api", detail: "Updated ticket status to In Progress", cost: 0.001 },
    ],
  },
  "a-2311": {
    permissions: [
      { scope: "web_scraping", risk: "medium" },
      { scope: "database_write", risk: "high" },
      { scope: "payment_api", risk: "high" },
      { scope: "email_send", risk: "medium" },
    ],
    tokenBurnRate: 200,
    mtdCostLive: 940,
    recentActivity: [
      { timestamp: "13:45:22", action: "database_write", detail: "Wrote 847 records to content_db", cost: 0.012 },
      { timestamp: "13:44:01", action: "web_scraping", detail: "Scraped 42 pages from competitor site", cost: 0.008 },
      { timestamp: "13:30:15", action: "payment_api", detail: "API call to payment processor — UNVERIFIED", cost: 0.003 },
      { timestamp: "13:15:44", action: "email_send", detail: "Sent 120 bulk emails", cost: 0.006 },
      { timestamp: "13:00:00", action: "database_write", detail: "Modified user table — owner unverified", cost: 0.009 },
    ],
  },
  "a-2390": {
    permissions: [
      { scope: "accounting_api", risk: "medium" },
      { scope: "spreadsheet_read", risk: "low" },
      { scope: "report_generate", risk: "low" },
    ],
    tokenBurnRate: 850,
    mtdCostLive: 1520,
    recentActivity: [
      { timestamp: "14:03:55", action: "accounting_api", detail: "Reconciled 2,847 transactions", cost: 0.018 },
      { timestamp: "14:02:30", action: "report_generate", detail: "Generated June P&L report", cost: 0.005 },
      { timestamp: "14:01:11", action: "spreadsheet_read", detail: "Read Q2 expense sheet", cost: 0.001 },
      { timestamp: "13:58:44", action: "accounting_api", detail: "Matched 412 invoices to POs", cost: 0.014 },
      { timestamp: "13:55:20", action: "report_generate", detail: "Generated variance analysis", cost: 0.004 },
    ],
  },
  "r-0031": {
    permissions: [
      { scope: "warehouse_nav", risk: "low" },
      { scope: "inventory_write", risk: "medium" },
    ],
    uptimePct: 97.2,
    mtdCostLive: 2340,
    recentActivity: [
      { timestamp: "14:00:05", action: "warehouse_nav", detail: "Completed pick route B-7 to D-12", cost: 0 },
      { timestamp: "13:55:10", action: "inventory_write", detail: "Updated 24 SKU stock levels", cost: 0 },
      { timestamp: "13:50:22", action: "warehouse_nav", detail: "Completed pick route A-3 to C-8", cost: 0 },
      { timestamp: "13:45:01", action: "inventory_write", detail: "Flagged 3 items as low stock", cost: 0 },
      { timestamp: "13:40:15", action: "warehouse_nav", detail: "Docked for 4.2 min battery charge", cost: 0 },
    ],
  },
}

// KPI definitions for drag-and-drop dashboard
export interface KpiDefinition {
  id: string
  label: string
  description: string
  defaultVisible: boolean
  category: "financial" | "operational" | "security" | "workforce"
}

export const ALL_KPIS: KpiDefinition[] = [
  { id: "headcount", label: "Total Headcount", description: "All active workers", defaultVisible: true, category: "workforce" },
  { id: "labour_cost", label: "Monthly Labour Cost", description: "Total MTD spend across all worker types", defaultVisible: true, category: "financial" },
  { id: "efficiency", label: "Avg Output Efficiency", description: "Mean efficiency score across all workers", defaultVisible: true, category: "operational" },
  { id: "tasks", label: "Total Tasks Completed", description: "Aggregate tasks this month", defaultVisible: true, category: "operational" },
  { id: "savings", label: "Automation Savings", description: "Cost saved vs full human equivalent", defaultVisible: false, category: "financial" },
  { id: "roi", label: "Avg Agent ROI", description: "Mean ROI score across all AI agents", defaultVisible: false, category: "financial" },
  { id: "unowned", label: "Unowned Agents", description: "Agents with no verified human owner", defaultVisible: false, category: "security" },
  { id: "critical_alerts", label: "Critical Alerts", description: "Open critical alerts requiring action", defaultVisible: false, category: "security" },
  { id: "zk_rate", label: "Avg ZK Verification", description: "Mean cryptographic proof rate across agents", defaultVisible: false, category: "security" },
  { id: "agent_cost", label: "Agent Spend MTD", description: "Total AI agent costs this month", defaultVisible: false, category: "financial" },
]
