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
