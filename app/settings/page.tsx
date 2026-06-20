"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CONNECTOR_DEFINITIONS, getAdapter } from "@/lib/connectors/registry"
import { ConnectorDefinition, ConnectorInstance, SyncInterval } from "@/lib/connectors/types"
import { cn } from "@/lib/utils"
import { CheckCircle, AlertCircle, RefreshCw, Plus, X, ChevronRight, Zap, Clock, Database } from "lucide-react"

const CATEGORY_LABELS = {
  hris: "HRIS — Human workers",
  agent_runtime: "Agent runtimes — AI agents",
  robot_fleet: "Robot fleet — Physical machines",
  custom: "Custom — CSV & webhooks",
}

const CATEGORY_ORDER = ["hris", "agent_runtime", "robot_fleet", "custom"]

const INTERVAL_LABELS: Record<SyncInterval, string> = {
  realtime: "Real-time",
  "1min": "Every minute",
  "5min": "Every 5 minutes",
  "15min": "Every 15 minutes",
  "1hour": "Every hour",
}

const STATUS_STYLES = {
  connected: "text-chart-3 bg-chart-3/10 border-chart-3/20",
  disconnected: "text-muted-foreground bg-secondary border-border",
  syncing: "text-primary bg-primary/10 border-primary/20",
  error: "text-destructive bg-destructive/10 border-destructive/20",
}

function ConnectorCard({
  def,
  instance,
  onConnect,
  onSync,
  onDisconnect,
}: {
  def: ConnectorDefinition
  instance?: ConnectorInstance
  onConnect: (def: ConnectorDefinition) => void
  onSync: (def: ConnectorDefinition) => void
  onDisconnect: (id: string) => void
}) {
  const status = instance?.status ?? "disconnected"

  return (
    <div className={cn(
      "rounded-xl border bg-card p-5 flex items-start gap-4 transition-all",
      status === "connected" ? "border-chart-3/30" :
      status === "error" ? "border-destructive/30" : "border-border"
    )}>
      {/* Logo */}
      <div
        className="size-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ backgroundColor: def.logoColor }}
      >
        {def.logoInitials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-card-foreground">{def.name}</span>
          <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium", STATUS_STYLES[status])}>
            {status === "syncing" ? (
              <span className="flex items-center gap-1"><RefreshCw className="size-2.5 animate-spin" />{status}</span>
            ) : status}
          </span>
          <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {def.workerType === "all" ? "Any type" : def.workerType}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{def.description}</p>

        {instance && (
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Database className="size-3" />
              {instance.workersImported} workers imported
            </span>
            {instance.lastSyncAt && (
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                Last sync {new Date(instance.lastSyncAt).toLocaleTimeString()}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Zap className="size-3" />
              {INTERVAL_LABELS[instance.interval]}
            </span>
          </div>
        )}

        {instance?.errorMessage && (
          <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="size-3" />{instance.errorMessage}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {status === "connected" && (
          <>
            <button
              onClick={() => onSync(def)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
            >
              Sync now
            </button>
            <button
              onClick={() => onDisconnect(def.id)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
            >
              Disconnect
            </button>
          </>
        )}
        {(status === "disconnected" || status === "error") && (
          <button
            onClick={() => onConnect(def)}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-1"
          >
            <Plus className="size-3" />Connect
          </button>
        )}
        {status === "syncing" && (
          <div className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground flex items-center gap-1">
            <RefreshCw className="size-3 animate-spin" />Syncing…
          </div>
        )}
      </div>
    </div>
  )
}

function ConnectModal({
  def,
  onClose,
  onConnected,
}: {
  def: ConnectorDefinition
  onClose: () => void
  onConnected: (instance: ConnectorInstance) => void
}) {
  const [config, setConfig] = useState<Record<string, string>>({})
  const [interval, setInterval] = useState<SyncInterval>(def.defaultInterval)
  const [step, setStep] = useState<"config" | "validating" | "syncing" | "done" | "error">("config")
  const [error, setError] = useState("")
  const [imported, setImported] = useState(0)

  const handleConnect = async () => {
    setStep("validating")
    const adapter = getAdapter(def.id)
    const validation = await adapter.validate(config)
    if (!validation.valid) {
      setError(validation.error ?? "Validation failed")
      setStep("error")
      return
    }
    setStep("syncing")
    const workers = await adapter.sync(config)
    setImported(workers.length)
    setStep("done")
    onConnected({
      definitionId: def.id,
      status: "connected",
      lastSyncAt: new Date().toISOString(),
      nextSyncAt: new Date(Date.now() + 60000).toISOString(),
      workersImported: workers.length,
      config,
      interval,
    })
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={step === "config" || step === "error" ? onClose : undefined} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: def.logoColor }}>
                {def.logoInitials}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Connect {def.name}</h2>
                <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[def.category]}</p>
              </div>
            </div>
            {(step === "config" || step === "error") && (
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="size-5" />
              </button>
            )}
          </div>

          <div className="p-6">
            {step === "config" && (
              <div className="space-y-4">
                {def.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      {field.label} {field.required && <span className="text-destructive">*</span>}
                    </label>
                    {field.type === "select" ? (
                      <select
                        value={config[field.key] ?? ""}
                        onChange={e => setConfig(c => ({ ...c, [field.key]: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        type={field.type === "password" ? "password" : "text"}
                        value={config[field.key] ?? ""}
                        onChange={e => setConfig(c => ({ ...c, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Sync frequency</label>
                  <select
                    value={interval}
                    onChange={e => setInterval(e.target.value as SyncInterval)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {def.syncIntervals.map(i => (
                      <option key={i} value={i}>{INTERVAL_LABELS[i]}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleConnect}
                  className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity mt-2"
                >
                  Validate & Connect
                </button>
              </div>
            )}

            {(step === "validating" || step === "syncing") && (
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <RefreshCw className="size-8 text-primary animate-spin" />
                <p className="text-sm font-medium text-card-foreground">
                  {step === "validating" ? "Validating credentials…" : "Running initial sync…"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {step === "validating" ? "Checking your API key with " + def.name : "Importing workers from " + def.name}
                </p>
              </div>
            )}

            {step === "done" && (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <CheckCircle className="size-10 text-chart-3" />
                <p className="text-sm font-semibold text-card-foreground">{def.name} connected</p>
                <p className="text-xs text-muted-foreground text-center">
                  {imported} workers imported · syncing {INTERVAL_LABELS[interval].toLowerCase()}
                </p>
                <button onClick={onClose} className="mt-2 rounded-xl border border-border px-6 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
                  Done
                </button>
              </div>
            )}

            {step === "error" && (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <AlertCircle className="size-8 text-destructive" />
                <p className="text-sm font-semibold text-destructive">Connection failed</p>
                <p className="text-xs text-muted-foreground text-center">{error}</p>
                <button onClick={() => setStep("config")} className="mt-2 rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground">
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default function SettingsPage() {
  const [instances, setInstances] = useState<Record<string, ConnectorInstance>>({})
  const [connecting, setConnecting] = useState<ConnectorDefinition | null>(null)
  const [syncing, setSyncing] = useState<string | null>(null)

  const handleConnected = (instance: ConnectorInstance) => {
    setInstances(prev => ({ ...prev, [instance.definitionId]: instance }))
    setConnecting(null)
  }

  const handleSync = async (def: ConnectorDefinition) => {
    setSyncing(def.id)
    setInstances(prev => ({
      ...prev,
      [def.id]: { ...prev[def.id], status: "syncing" },
    }))
    const adapter = getAdapter(def.id)
    const workers = await adapter.sync(instances[def.id]?.config ?? {})
    setInstances(prev => ({
      ...prev,
      [def.id]: {
        ...prev[def.id],
        status: "connected",
        lastSyncAt: new Date().toISOString(),
        workersImported: workers.length,
      },
    }))
    setSyncing(null)
  }

  const handleDisconnect = (id: string) => {
    if (!confirm("Disconnect this integration? Workers imported from it will be removed.")) return
    setInstances(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const connectedCount = Object.keys(instances).length
  const totalImported = Object.values(instances).reduce((sum, i) => sum + i.workersImported, 0)

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Integrations</h1>
            <p className="text-sm text-muted-foreground">Connect your existing HR, agent, and robot systems</p>
          </div>
          {connectedCount > 0 && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="size-4 text-chart-3" />
                {connectedCount} connected
              </span>
              <span className="flex items-center gap-1.5">
                <Database className="size-4" />
                {totalImported} workers imported
              </span>
            </div>
          )}
        </header>

        <main className="flex-1 p-6 space-y-8">
          {CATEGORY_ORDER.map(category => {
            const defs = CONNECTOR_DEFINITIONS.filter(d => d.category === category)
            return (
              <section key={category}>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                </h2>
                <div className="space-y-3">
                  {defs.map(def => (
                    <ConnectorCard
                      key={def.id}
                      def={def}
                      instance={instances[def.id]}
                      onConnect={setConnecting}
                      onSync={handleSync}
                      onDisconnect={handleDisconnect}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </main>
      </div>

      {connecting && (
        <ConnectModal
          def={connecting}
          onClose={() => setConnecting(null)}
          onConnected={handleConnected}
        />
      )}
    </div>
  )
}
