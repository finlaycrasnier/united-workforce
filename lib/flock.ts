export interface OwnershipVerification {
  verified: boolean;
  ownerName?: string;
}

export async function verifyOwnership(agentId: string): Promise<OwnershipVerification> {
  if (!process.env.FLOCK_API_KEY) {
    // MockMode
    switch (agentId) {
      case "a-2207":
        return { verified: true, ownerName: "Maya Okonkwo" };
      case "a-2311":
        return { verified: false };
      case "a-2390":
        return { verified: true, ownerName: "Sofia Lindqvist" };
      default:
        return { verified: false };
    }
  }

  throw new Error("FLock.io integration requires FLOCK_API_KEY.");
}