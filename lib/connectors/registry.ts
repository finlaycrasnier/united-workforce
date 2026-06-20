/**
 * Connector Registry
 *
 * All available connectors are registered here.
 * To add a new one: implement ConnectorAdapter and add it to CONNECTORS.
 */

import { ConnectorDefinition, ConnectorAdapter, NormalisedWorker } from "./types"

// ── Connector definitions ──────────────────────────────────────────────────

export const CONNECTOR_DEFINITIONS: ConnectorDefinition[] = [
  {
    id: "workday",
    name: "Workday",
    description: "Pull human workers from Workday HCM. Syncs name, role, department, cost centre, and employment status.",
    category: "hris",
    logoInitials: "WD",
    logoColor: "#F36C21",
    workerType: "Human",
    docsUrl: "https://community.workday.com/sites/default/files/file-hosting/restapi/",
    syncIntervals: ["15min", "1hour"],
    defaultInterval: "1hour",
    fields: [
      { key: "tenant", label: "Workday Tenant URL", type: "url", placeholder: "https://wd2.myworkday.com/yourcompany", required: true },
      { key: "client_id", label: "Client ID", type: "text", placeholder: "Your OAuth2 client ID", required: true },
      { key: "client_secret", label: "Client Secret", type: "password", placeholder: "Your OAuth2 client secret", required: true },
      { key: "raas_endpoint", label: "RaaS Report Endpoint", type: "url", placeholder: "/ccx/service/yourcompany/Human_Resources/...", required: false },
    ],
  },
  {
    id: "rippling",
    name: "Rippling",
    description: "Sync employees from Rippling. Supports compensation, department, and role data.",
    category: "hris",
    logoInitials: "RP",
    logoColor: "#6C63FF",
    workerType: "Human",
    docsUrl: "https://developer.rippling.com/docs",
    syncIntervals: ["15min", "1hour"],
    defaultInterval: "15min",
    fields: [
      { key: "api_key", label: "API Key", type: "password", placeholder: "Your Rippling API key", required: true },
      { key: "company_id", label: "Company ID", type: "text", placeholder: "Your Rippling company ID", required: true },
    ],
  },
  {
    id: "langchain",
    name: "LangChain / LangSmith",
    description: "Pull active agents from LangSmith. Tracks runs, token usage, latency, and error rates.",
    category: "agent_runtime",
    logoInitials: "LC",
    logoColor: "#1C9B6E",
    workerType: "AI Agent",
    docsUrl: "https://docs.smith.langchain.com/reference/sdk/python",
    syncIntervals: ["realtime", "1min", "5min"],
    defaultInterval: "1min",
    fields: [
      { key: "api_key", label: "LangSmith API Key", type: "password", placeholder: "ls__...", required: true },
      { key: "project_name", label: "Project Name", type: "text", placeholder: "default", required: true },
      { key: "base_url", label: "Base URL", type: "url", placeholder: "https://api.smith.langchain.com", required: false },
    ],
  },
  {
    id: "agentops",
    name: "AgentOps",
    description: "Import agents from AgentOps. Syncs session data, cost tracking, and failure rates.",
    category: "agent_runtime",
    logoInitials: "AO",
    logoColor: "#7C3AED",
    workerType: "AI Agent",
    docsUrl: "https://docs.agentops.ai",
    syncIntervals: ["realtime", "1min", "5min"],
    defaultInterval: "1min",
    fields: [
      { key: "api_key", label: "AgentOps API Key", type: "password", placeholder: "Your AgentOps key", required: true },
    ],
  },
  {
    id: "openai_assistants",
    name: "OpenAI Assistants",
    description: "Pull assistants from the OpenAI Assistants API. Tracks runs, token consumption, and tool usage.",
    category: "agent_runtime",
    logoInitials: "OA",
    logoColor: "#10A37F",
    workerType: "AI Agent",
    docsUrl: "https://platform.openai.com/docs/api-reference/assistants",
    syncIntervals: ["1min", "5min", "15min"],
    defaultInterval: "5min",
    fields: [
      { key: "api_key", label: "OpenAI API Key", type: "password", placeholder: "sk-...", required: true },
      { key: "org_id", label: "Organisation ID (optional)", type: "text", placeholder: "org-...", required: false },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic Claude Agents",
    description: "Sync Claude-powered agents via the Anthropic API. Tracks token usage, costs, and tool calls.",
    category: "agent_runtime",
    logoInitials: "AN",
    logoColor: "#D97706",
    workerType: "AI Agent",
    docsUrl: "https://docs.anthropic.com/en/api",
    syncIntervals: ["1min", "5min", "15min"],
    defaultInterval: "5min",
    fields: [
      { key: "api_key", label: "Anthropic API Key", type: "password", placeholder: "sk-ant-...", required: true },
      { key: "workspace_id", label: "Workspace ID (optional)", type: "text", placeholder: "Your workspace", required: false },
    ],
  },
  {
    id: "formant",
    name: "Formant",
    description: "Import robots from Formant fleet management. Syncs telemetry, uptime, battery, and task data.",
    category: "robot_fleet",
    logoInitials: "FM",
    logoColor: "#0EA5E9",
    workerType: "Robot",
    docsUrl: "https://docs.formant.io/reference",
    syncIntervals: ["realtime", "1min", "5min"],
    defaultInterval: "1min",
    fields: [
      { key: "api_token", label: "API Token", type: "password", placeholder: "Your Formant API token", required: true },
      { key: "org_id", label: "Organisation ID", type: "text", placeholder: "Your Formant org ID", required: true },
      { key: "fleet_name", label: "Fleet Name (optional)", type: "text", placeholder: "Filter by fleet", required: false },
    ],
  },
  {
    id: "freedom_robotics",
    name: "Freedom Robotics",
    description: "Sync robots from Freedom Robotics. Pulls device status, uptime, and operational metrics.",
    category: "robot_fleet",
    logoInitials: "FR",
    logoColor: "#EF4444",
    workerType: "Robot",
    docsUrl: "https://docs.freedomrobotics.ai",
    syncIntervals: ["1min", "5min", "15min"],
    defaultInterval: "5min",
    fields: [
      { key: "api_key", label: "API Key", type: "password", placeholder: "Your Freedom Robotics key", required: true },
      { key: "account_id", label: "Account ID", type: "text", placeholder: "Your account ID", required: true },
    ],
  },
  {
    id: "csv",
    name: "CSV / Manual Import",
    description: "Upload a CSV file to bulk-import any worker type. Useful for custom systems with no API.",
    category: "custom",
    logoInitials: "CSV",
    logoColor: "#64748B",
    workerType: "all",
    docsUrl: "",
    syncIntervals: ["1hour"],
    defaultInterval: "1hour",
    fields: [
      { key: "mapping_type", label: "Worker type column name", type: "text", placeholder: "type", required: true },
      { key: "mapping_name", label: "Name column name", type: "text", placeholder: "name", required: true },
      { key: "mapping_role", label: "Role column name", type: "text", placeholder: "role", required: false },
    ],
  },
  {
    id: "webhook",
    name: "Webhook / Custom API",
    description: "Push worker data to United from any system via a webhook. United provides an inbound URL.",
    category: "custom",
    logoInitials: "WH",
    logoColor: "#64748B",
    workerType: "all",
    docsUrl: "",
    syncIntervals: ["realtime"],
    defaultInterval: "realtime",
    fields: [
      { key: "secret", label: "Webhook Secret", type: "password", placeholder: "Used to verify incoming requests", required: true },
      { key: "worker_type_field", label: "Worker type JSON field", type: "text", placeholder: "worker_type", required: true },
    ],
  },
]

// ── Mock adapter (simulates real sync with delay) ──────────────────────────

class MockAdapter implements ConnectorAdapter {
  constructor(public definition: ConnectorDefinition) {}

  async validate(config: Record<string, string>): Promise<{ valid: boolean; error?: string }> {
    await new Promise(r => setTimeout(r, 800))
    const required = this.definition.fields.filter(f => f.required)
    for (const field of required) {
      if (!config[field.key]) {
        return { valid: false, error: `${field.label} is required` }
      }
    }
    // Simulate 10% auth failure for realism
    if (Math.random() < 0.1) {
      return { valid: false, error: "Authentication failed — check your API key" }
    }
    return { valid: true }
  }

  async sync(config: Record<string, string>): Promise<NormalisedWorker[]> {
    await new Promise(r => setTimeout(r, 1200))
    // Each connector returns mock workers based on its type
    const count = Math.floor(Math.random() * 8) + 2
    return Array.from({ length: count }, (_, i) => ({
      externalId: `${this.definition.id}-ext-${i + 1}`,
      sourceConnectorId: this.definition.id,
      name: this.getMockName(this.definition.workerType, i),
      type: this.definition.workerType === "all" ? "Human" : this.definition.workerType,
      role: this.getMockRole(this.definition.workerType, i),
      status: Math.random() > 0.2 ? "Active" : "Idle",
      labourCost: Math.floor(Math.random() * 8000) + 500,
      tasksCompleted: Math.floor(Math.random() * 10000),
      efficiency: Math.floor(Math.random() * 30) + 70,
      uptime: `${Math.floor(Math.random() * 100) + 100}.0 hrs`,
      metadata: { source: this.definition.name, syncedAt: new Date().toISOString() },
    }))
  }

  private getMockName(type: string, i: number): string {
    if (type === "Human") return ["James Okafor", "Priya Nair", "Lena Müller", "Ravi Patel", "Sofia Chen"][i % 5]
    if (type === "AI Agent") return [`Nexus-${i + 1}`, `Orion-${i + 2}`, `Vega-${i + 1}`][i % 3]
    return `Unit-${String(i + 1).padStart(3, "0")}`
  }

  private getMockRole(type: string, i: number): string {
    if (type === "Human") return ["Operations Manager", "Data Analyst", "Customer Success", "Engineer", "Finance"][i % 5]
    if (type === "AI Agent") return ["Triage Subsystem", "Reconciliation Agent", "Content Agent"][i % 3]
    return ["Warehouse Logistics", "Inspection Drone", "Assembly Unit"][i % 3]
  }
}

// ── Registry ───────────────────────────────────────────────────────────────

export function getAdapter(definitionId: string): ConnectorAdapter {
  const def = CONNECTOR_DEFINITIONS.find(d => d.id === definitionId)
  if (!def) throw new Error(`No connector found with id: ${definitionId}`)
  return new MockAdapter(def)
}

export function getDefinition(id: string): ConnectorDefinition | undefined {
  return CONNECTOR_DEFINITIONS.find(d => d.id === id)
}
