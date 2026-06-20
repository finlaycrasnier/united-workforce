/**
 * United — Connector Framework
 *
 * Every data source (Workday, LangChain, AgentOps, custom) implements
 * the Connector interface. United polls each connector on a configurable
 * interval and merges the results into the unified worker store.
 *
 * Adding a new integration = implement ConnectorAdapter, register it here.
 */

export type ConnectorCategory = "hris" | "agent_runtime" | "robot_fleet" | "custom"
export type ConnectorStatus = "connected" | "disconnected" | "syncing" | "error"
export type SyncInterval = "realtime" | "1min" | "5min" | "15min" | "1hour"

export interface ConnectorField {
  key: string
  label: string
  type: "text" | "password" | "select" | "url"
  placeholder?: string
  options?: string[]
  required: boolean
}

export interface ConnectorDefinition {
  id: string
  name: string
  description: string
  category: ConnectorCategory
  logoInitials: string
  logoColor: string
  workerType: "Human" | "AI Agent" | "Robot" | "all"
  fields: ConnectorField[]
  docsUrl: string
  syncIntervals: SyncInterval[]
  defaultInterval: SyncInterval
}

export interface ConnectorInstance {
  definitionId: string
  status: ConnectorStatus
  lastSyncAt: string | null
  nextSyncAt: string | null
  workersImported: number
  errorMessage?: string
  config: Record<string, string>
  interval: SyncInterval
}

// What every connector must return
export interface NormalisedWorker {
  externalId: string           // ID in the source system
  sourceConnectorId: string
  name: string
  type: "Human" | "AI Agent" | "Robot"
  role: string
  status: "Active" | "Idle" | "Flagged"
  labourCost: number
  tasksCompleted: number
  efficiency: number
  uptime: string
  metadata: Record<string, unknown>  // source-specific extras
}

// Every connector adapter must implement this
export interface ConnectorAdapter {
  definition: ConnectorDefinition
  validate(config: Record<string, string>): Promise<{ valid: boolean; error?: string }>
  sync(config: Record<string, string>): Promise<NormalisedWorker[]>
}
