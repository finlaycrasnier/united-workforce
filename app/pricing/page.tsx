"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CheckCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "For teams exploring AI agent management",
    highlight: false,
    cta: "Get started free",
    limits: "Up to 10 workers · 1 integration",
    features: [
      { text: "Unified workforce table", included: true },
      { text: "FLock ownership verification", included: true },
      { text: "Basic alerts panel", included: true },
      { text: "Org chart", included: true },
      { text: "1 data source integration", included: true },
      { text: "zkVerify proof badges", included: false },
      { text: "Base L2 payroll", included: false },
      { text: "Solvimon billing analytics", included: false },
      { text: "Custom KPI dashboard", included: false },
      { text: "Workforce AI assistant", included: false },
      { text: "Unlimited integrations", included: false },
      { text: "Audit log", included: false },
    ],
  },
  {
    name: "Growth",
    price: "$299",
    period: "per month",
    description: "For teams actively deploying AI agents at scale",
    highlight: true,
    cta: "Start 14-day trial",
    limits: "Up to 250 workers · 5 integrations",
    features: [
      { text: "Unified workforce table", included: true },
      { text: "FLock ownership verification", included: true },
      { text: "Advanced alerts with fix actions", included: true },
      { text: "Org chart", included: true },
      { text: "5 data source integrations", included: true },
      { text: "zkVerify proof badges", included: true },
      { text: "Base L2 payroll", included: true },
      { text: "Solvimon billing analytics", included: true },
      { text: "Custom KPI dashboard", included: true },
      { text: "Workforce AI assistant", included: true },
      { text: "Unlimited integrations", included: false },
      { text: "Audit log", included: false },
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "annual contract",
    description: "For organisations managing hundreds of workers across all three types",
    highlight: false,
    cta: "Talk to sales",
    limits: "Unlimited workers · Unlimited integrations",
    features: [
      { text: "Unified workforce table", included: true },
      { text: "FLock ownership verification", included: true },
      { text: "Advanced alerts with fix actions", included: true },
      { text: "Org chart", included: true },
      { text: "Unlimited integrations", included: true },
      { text: "zkVerify proof badges", included: true },
      { text: "Base L2 payroll", included: true },
      { text: "Solvimon billing analytics", included: true },
      { text: "Custom KPI dashboard", included: true },
      { text: "Workforce AI assistant", included: true },
      { text: "Full audit log", included: true },
      { text: "SSO, SAML, custom contracts", included: true },
    ],
  },
]

const ADDONS = [
  { name: "Additional integrations", price: "$49/mo each", description: "Add connectors beyond your plan limit" },
  { name: "Solvimon billing analytics", price: "$99/mo", description: "Real-time cost tracking and ROI reporting" },
  { name: "Base L2 payroll", price: "0.5% per transaction", description: "On-chain ETH payments to agent and robot wallets" },
  { name: "FLock ownership registry", price: "Included", description: "Blockchain ownership verification for all agents" },
]

export default function PricingPage() {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center border-b border-border px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Pricing</h1>
            <p className="text-sm text-muted-foreground">Simple, usage-based pricing that scales with your workforce</p>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-10 max-w-6xl">

          {/* Value prop */}
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              United charges per <strong className="text-card-foreground">managed worker</strong>, not per seat. 
              You pay for the value delivered — AI agents doing the work of 10 humans cost a fraction of 10 human salaries, 
              and United's ROI scores make that visible. Billing is handled by{" "}
              <span className="text-primary font-medium">Solvimon</span> — usage-based, metered in real time, invoiced monthly.
            </p>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {PLANS.map(plan => (
              <div
                key={plan.name}
                className={cn(
                  "rounded-xl border p-6 flex flex-col",
                  plan.highlight
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-card"
                )}
              >
                {plan.highlight && (
                  <div className="mb-3">
                    <span className="rounded-full bg-primary/15 border border-primary/30 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      Most popular
                    </span>
                  </div>
                )}
                <h2 className="text-base font-semibold text-card-foreground">{plan.name}</h2>
                <div className="mt-2 mb-1">
                  <span className="text-3xl font-bold text-card-foreground">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{plan.limits}</p>
                <p className="text-xs text-muted-foreground mb-5">{plan.description}</p>

                <button className={cn(
                  "w-full rounded-xl py-2.5 text-sm font-semibold transition-opacity mb-5",
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border bg-background text-card-foreground hover:bg-secondary"
                )}>
                  {plan.cta}
                </button>

                <div className="space-y-2.5 flex-1">
                  {plan.features.map(f => (
                    <div key={f.text} className="flex items-center gap-2.5">
                      {f.included
                        ? <CheckCircle className="size-4 text-chart-3 shrink-0" />
                        : <X className="size-4 text-muted-foreground/40 shrink-0" />
                      }
                      <span className={cn("text-xs", f.included ? "text-card-foreground" : "text-muted-foreground/50")}>
                        {f.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Add-ons */}
          <section>
            <h2 className="text-sm font-semibold text-card-foreground mb-3">Add-ons & usage pricing</h2>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="px-5 py-3 text-left font-medium">Feature</th>
                    <th className="px-5 py-3 text-left font-medium">Pricing</th>
                    <th className="px-5 py-3 text-left font-medium">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ADDONS.map(a => (
                    <tr key={a.name}>
                      <td className="px-5 py-3 font-medium text-card-foreground">{a.name}</td>
                      <td className="px-5 py-3 text-primary font-semibold">{a.price}</td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">{a.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Klarna-style ROI calculator */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-card-foreground mb-1">The United ROI argument</h2>
            <p className="text-xs text-muted-foreground mb-4">
              A company running 10 AI agents doing the equivalent work of 50 human FTEs:
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Without United", sub: "3 separate tools, no cross-worker insight", value: "$1,200/mo", note: "Workday + AgentOps + Formant" },
                { label: "With United Growth", sub: "One platform, full lifecycle management", value: "$299/mo", note: "All three worker types unified" },
                { label: "Saving", sub: "Plus the time saved switching between tools", value: "$901/mo", note: "75% cost reduction on tooling" },
              ].map(c => (
                <div key={c.label} className="rounded-lg border border-border p-4">
                  <p className="text-xs font-medium text-muted-foreground">{c.label}</p>
                  <p className="text-xl font-bold text-card-foreground mt-1">{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
                  <p className="text-xs text-primary mt-1">{c.note}</p>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}
