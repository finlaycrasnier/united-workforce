"use client"

import { useState } from "react"
import { Search, Bell, Plus } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CustomisableKpiBar } from "@/components/customisable-kpi-bar"
import { WorkforceTable } from "@/components/workforce-table"
import { AlertsPanel } from "@/components/alerts-panel"
import { OnboardModal } from "@/components/onboard-modal"
import { WorkforceAssistant } from "@/components/workforce-assistant"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [showOnboard, setShowOnboard] = useState(false)
  const [extraWorkers, setExtraWorkers] = useState<any[]>([])

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Workforce</h1>
            <p className="text-sm text-muted-foreground">Unified view of your human, AI, and robotic teams</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground md:flex">
              <Search className="size-4" />
              <span>Search workers...</span>
            </div>
            <Button variant="outline" size="icon" className="border-border bg-card text-muted-foreground" aria-label="Notifications">
              <Bell className="size-4" />
            </Button>
            <Button onClick={() => setShowOnboard(true)}>
              <Plus className="size-4" />
              <span className="hidden sm:inline">Onboard Worker</span>
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-6 p-6">
          <CustomisableKpiBar />
          <AlertsPanel />
          <WorkforceTable extraWorkers={extraWorkers} />
        </main>
      </div>
      {showOnboard && (
        <OnboardModal onClose={() => setShowOnboard(false)} onAdd={(w) => setExtraWorkers(prev => [...prev, w])} />
      )}
      <WorkforceAssistant />
    </div>
  )
}
