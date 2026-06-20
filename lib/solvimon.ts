export interface WorkforceUsageSummary {
  totalMtdUsd: number;
  humanEquivalentUsd: number;
  savingsUsd: number;
  byWorkerType: {
    Human: number;
    "AI Agent": number;
    Robot: number;
  };
  topCostDrivers: Array<{
    name: string;
    roiScore: number;
    trend: "up" | "down" | "stable";
  }>;
}

export async function getWorkforceUsageSummary(): Promise<WorkforceUsageSummary> {
  if (!process.env.SOLVIMON_API_KEY) {
    // MockMode
    return {
      totalMtdUsd: 58340,
      humanEquivalentUsd: 98200,
      savingsUsd: 39860,
      byWorkerType: {
        Human: 49700,
        "AI Agent": 4450,
        Robot: 4190,
      },
      topCostDrivers: [
        { name: "Atlas-7", roiScore: 91, trend: "down" },
        { name: "Hauler Unit R-31", roiScore: 78, trend: "stable" },
        { name: "Quill-3", roiScore: 54, trend: "up" },
        { name: "Ledger-9", roiScore: 88, trend: "stable" },
      ],
    };
  }

  // Production implementation would go here
  throw new Error("Solvimon Production API not implemented. Please provide SOLVIMON_API_KEY for non-mock usage.");
}

export async function trackUsage(event: any): Promise<void> {
  if (!process.env.SOLVIMON_API_KEY) {
    console.log("[MockMode] Tracking event:", event);
    return;
  }
  // Production implementation...
  if (process.env.NODE_ENV === "production") {
    throw new Error("solvimon: trackUsage production implementation missing API key.");
  }
}