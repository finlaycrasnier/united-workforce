export interface AgentVerificationSummary {
  verificationRate: number;
  totalProofs: number;
}

export async function getAgentVerificationSummary(agentId: string): Promise<AgentVerificationSummary> {
  if (!process.env.ZK_VERIFY_API_KEY) {
    // MockMode
    switch (agentId) {
      case "a-2207":
        return { verificationRate: 0.98, totalProofs: 12480 };
      case "a-2311":
        return { verificationRate: 0.72, totalProofs: 8760 };
      case "a-2390":
        return { verificationRate: 0.96, totalProofs: 15230 };
      default:
        return { verificationRate: 0, totalProofs: 0 };
    }
  }

  throw new Error("ZKVerify integration requires ZK_VERIFY_API_KEY.");
}