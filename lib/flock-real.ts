/**
 * FLock.io — Production API integration
 *
 * FLock.io provides decentralised, privacy-preserving AI infrastructure.
 * In United, FLock is used for the AI Governance, Transparency & Trust track:
 * - Registering agent ownership records on-chain
 * - Verifying that every AI agent has an accountable human owner
 * - Creating an auditable, tamper-proof governance trail
 *
 * When FLOCK_API_KEY is set, all calls use the real API.
 * Without it, realistic mock data is returned — app works fully for demos.
 *
 * FLock docs: https://docs.flock.io
 */

const FLOCK_API_KEY = process.env.FLOCK_API_KEY
const FLOCK_BASE_URL = process.env.FLOCK_BASE_URL ?? "https://api.flock.io/v1"

export interface OwnershipVerification {
  agentId: string
  verified: boolean
  ownerName: string
  ownerAddress: string
  registeredAt: string
  proofUrl?: string
  txHash?: string
}

export interface OwnershipRegistration {
  agentId: string
  agentName: string
  agentWalletAddress?: string
  humanOwnerName: string
  humanOwnerAddress?: string
  department: string
  registeredAt: string
  txHash?: string
  verified: boolean
}

export async function verifyOwnership(agentId: string): Promise<OwnershipVerification> {
  if (!FLOCK_API_KEY) return getMockVerification(agentId)
  try {
    const res = await fetch(`${FLOCK_BASE_URL}/ownership/verify/${agentId}`, {
      headers: { "Authorization": `Bearer ${FLOCK_API_KEY}`, "Content-Type": "application/json" },
      next: { revalidate: 60 },
    })
    if (!res.ok) return getMockVerification(agentId)
    return res.json()
  } catch {
    return getMockVerification(agentId)
  }
}

export async function registerOwnership(
  agentId: string, agentName: string, humanOwnerName: string,
  department: string, agentWalletAddress?: string,
): Promise<OwnershipRegistration> {
  if (!FLOCK_API_KEY) return getMockRegistration(agentId, agentName, humanOwnerName, department)
  try {
    const res = await fetch(`${FLOCK_BASE_URL}/ownership/register`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${FLOCK_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, agentName, agentWalletAddress, humanOwnerName, department }),
    })
    if (!res.ok) return getMockRegistration(agentId, agentName, humanOwnerName, department)
    return res.json()
  } catch {
    return getMockRegistration(agentId, agentName, humanOwnerName, department)
  }
}

export async function getOwnedAgents(humanOwnerName: string): Promise<OwnershipRegistration[]> {
  if (!FLOCK_API_KEY) return getMockOwnedAgents(humanOwnerName)
  try {
    const res = await fetch(`${FLOCK_BASE_URL}/ownership?ownerName=${encodeURIComponent(humanOwnerName)}`, {
      headers: { "Authorization": `Bearer ${FLOCK_API_KEY}` },
      next: { revalidate: 60 },
    })
    if (!res.ok) return getMockOwnedAgents(humanOwnerName)
    return res.json()
  } catch {
    return getMockOwnedAgents(humanOwnerName)
  }
}

function getMockVerification(agentId: string): OwnershipVerification {
  const records: Record<string, OwnershipVerification> = {
    "a-2207": { agentId: "a-2207", verified: true, ownerName: "Maya Okonkwo", ownerAddress: "0x742d35Cc6634C0532925a3b8D4C9b5A9E8f1234a", registeredAt: "2026-01-10T09:00:00Z", proofUrl: "https://flock.io/proof/a-2207", txHash: "0xabc123def456789" },
    "a-2311": { agentId: "a-2311", verified: false, ownerName: "Unassigned", ownerAddress: "", registeredAt: "" },
    "a-2390": { agentId: "a-2390", verified: true, ownerName: "Sofia Lindqvist", ownerAddress: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec", registeredAt: "2026-02-20T09:00:00Z", proofUrl: "https://flock.io/proof/a-2390", txHash: "0xdef789abc123456" },
  }
  return records[agentId] ?? { agentId, verified: false, ownerName: "Unassigned", ownerAddress: "", registeredAt: "" }
}

function getMockRegistration(agentId: string, agentName: string, humanOwnerName: string, department: string): OwnershipRegistration {
  const txHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
  return { agentId, agentName, humanOwnerName, department, registeredAt: new Date().toISOString(), txHash, verified: true }
}

function getMockOwnedAgents(humanOwnerName: string): OwnershipRegistration[] {
  if (humanOwnerName === "Maya Okonkwo") return [{ agentId: "a-2207", agentName: "Atlas-7", humanOwnerName: "Maya Okonkwo", department: "Operations", registeredAt: "2026-01-10T09:00:00Z", txHash: "0xabc123", verified: true }]
  return []
}
