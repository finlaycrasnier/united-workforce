export type WorkerType = "Human" | "AI Agent" | "Robot"
export type WorkerStatus = "Active" | "Idle" | "Flagged"

export interface Worker {
  id: string
  type: WorkerType
  name: string
  role: string
  uptime: string
  labourCost: number
  tasksCompleted: number
  efficiency: number
  status: WorkerStatus
  walletAddress?: string
  ownershipVerified?: boolean
  zkVerificationRate?: number
  humanEquivalentCost?: number
  actualCost?: number
}

export const workers: Worker[] = [
  {
    id: "w-1042",
    type: "Human",
    name: "Maya Okonkwo",
    role: "Operations Lead",
    uptime: "38.5 hrs",
    labourCost: 6420,
    tasksCompleted: 184,
    efficiency: 94,
    status: "Active",
  },
  {
    id: "a-2207",
    type: "AI Agent",
    name: "Atlas-7",
    role: "Support Triage Subsystem",
    uptime: "168.0 hrs",
    labourCost: 1180,
    tasksCompleted: 12480,
    efficiency: 98,
    status: "Active",
  },
  {
    id: "w-1088",
    type: "Human",
    name: "Daniel Reyes",
    role: "Field Technician",
    uptime: "40.0 hrs",
    labourCost: 5210,
    tasksCompleted: 96,
    efficiency: 81,
    status: "Idle",
  },
  {
    id: "r-0031",
    type: "Robot",
    name: "Hauler Unit R-31",
    role: "Warehouse Logistics",
    uptime: "162.4 hrs",
    labourCost: 2340,
    tasksCompleted: 5021,
    efficiency: 89,
    status: "Active",
  },
  {
    id: "a-2311",
    type: "AI Agent",
    name: "Quill-3",
    role: "Content Generation Subsystem",
    uptime: "168.0 hrs",
    labourCost: 940,
    tasksCompleted: 8760,
    efficiency: 72,
    status: "Flagged",
  },
  {
    id: "w-1119",
    type: "Human",
    name: "Sofia Lindqvist",
    role: "Customer Success Manager",
    uptime: "37.0 hrs",
    labourCost: 5890,
    tasksCompleted: 142,
    efficiency: 91,
    status: "Active",
  },
  {
    id: "a-2390",
    type: "AI Agent",
    name: "Ledger-9",
    role: "Finance Reconciliation Subsystem",
    uptime: "168.0 hrs",
    labourCost: 1520,
    tasksCompleted: 15230,
    efficiency: 96,
    status: "Active",
  },
  {
    id: "w-1156",
    type: "Human",
    name: "Tobias Müller",
    role: "QA Analyst",
    uptime: "32.5 hrs",
    labourCost: 4380,
    tasksCompleted: 78,
    efficiency: 64,
    status: "Flagged",
  },
]

// Wallet and verification fields added for Base payroll, FLock, and zkVerify
// Patching existing workers inline via module augmentation workaround:
// These are applied as overrides when imported by payroll/billing pages.
export const workerExtensions: Record<string, Partial<Worker>> = {
  "a-2207": { walletAddress: "0x742d35Cc6634C0532925a3b8D4C9b5A9E8f1234a", ownershipVerified: true, zkVerificationRate: 0.98 },
  "a-2311": { walletAddress: "0x8ba1f109551bD432803012645Ac136ddd64DBA72", ownershipVerified: false, zkVerificationRate: 0.72 },
  "a-2390": { walletAddress: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec", ownershipVerified: true, zkVerificationRate: 0.96 },
  "r-0031": { walletAddress: "0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB" },
}

export const workersWithExtensions: (Worker & { walletAddress?: string; ownershipVerified?: boolean; zkVerificationRate?: number; humanEquivalentCost?: number; actualCost?: number })[] = workers.map(w => ({
  ...w,
  ...workerExtensions[w.id],
}))

// Add this to the END of lib/workforce-data.ts
// Credential types for Gap ④ — ephemeral vs static identity

export type CredentialType = "ephemeral_oauth" | "static_api_key" | "certificate"
export type CredentialRisk = "low" | "medium" | "high" | "critical"

export interface WorkerCredential {
  type: CredentialType
  tokenId: string
  issuedAt: string
  expiresAt: string | null   // null = never expires = risk
  riskLevel: CredentialRisk
  riskReason?: string
}

export const workerCredentials: Record<string, WorkerCredential> = {
  "a-2207": {
    type: "ephemeral_oauth",
    tokenId: "tok_atlas_ephemeral",
    issuedAt: "2026-06-20T13:00:00Z",
    expiresAt: "2026-06-20T14:00:00Z",
    riskLevel: "low",
  },
  "a-2311": {
    type: "static_api_key",
    tokenId: "sk-prod-quill-legacy-2024",
    issuedAt: "2024-06-01T00:00:00Z",
    expiresAt: null,
    riskLevel: "critical",
    riskReason: "Static API key — 384 days old, no rotation policy",
  },
  "a-2390": {
    type: "ephemeral_oauth",
    tokenId: "tok_ledger_ephemeral",
    issuedAt: "2026-06-20T12:00:00Z",
    expiresAt: "2026-06-20T13:00:00Z",
    riskLevel: "low",
  },
}

export interface WorkerAlert {
  id: string
  workerId: string
  workerName: string
  severity: "info" | "warning" | "critical"
  title: string
  description: string
  actions: { label: string; actionId: string }[]
}

export const workerAlerts: WorkerAlert[] = [
  {
    id: "alert-001",
    workerId: "a-2311",
    workerName: "Quill-3",
    severity: "critical",
    title: "Unowned agent with static credential",
    description: "Quill-3 has no verified human owner and is running on a static API key issued 384 days ago. ZK verification rate is only 72%.",
    actions: [
      { label: "Assign owner", actionId: "assign_owner" },
      { label: "Rotate credential", actionId: "rotate_credential" },
      { label: "Pause agent", actionId: "pause_agent" },
    ],
  },
  {
    id: "alert-002",
    workerId: "a-2207",
    workerName: "Atlas-7",
    severity: "info",
    title: "Ephemeral token expiring soon",
    description: "Atlas-7's OAuth token expires in 60 minutes. Auto-rotation is enabled — no action required.",
    actions: [
      { label: "Force rotate now", actionId: "rotate_credential" },
      { label: "Dismiss", actionId: "dismiss" },
    ],
  },
]