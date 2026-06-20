import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

const SYSTEM_PROMPT = `You are a workforce intelligence assistant for United. Answer questions about this workforce data concisely:

WORKERS: Maya Okonkwo (Human, Operations Lead, 94% efficiency, Active), Atlas-7 (AI Agent, Support Triage, 98% efficiency, Active, owner: Maya Okonkwo, 98% ZK, ephemeral credential), Daniel Reyes (Human, Field Technician, 81% efficiency, Idle), Hauler Unit R-31 (Robot, Warehouse Logistics, 89% efficiency, Active), Quill-3 (AI Agent, Content Generation, 72% efficiency, FLAGGED, NO owner, static key 384 days old, high-risk: database_write + payment_api), Sofia Lindqvist (Human, Customer Success, 91% efficiency, Active), Ledger-9 (AI Agent, Finance Reconciliation, 96% efficiency, Active, owner: Sofia Lindqvist, 96% ZK, ephemeral), Tobias Müller (Human, QA Analyst, 64% efficiency, Flagged).

BILLING: MTD spend $58,340, savings vs human equivalent $39,860, agent spend $4,450.
CRITICAL ALERT: Quill-3 unowned, static key, high-risk permissions.

Keep answers short and direct. Use numbers.`

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: SYSTEM_PROMPT,
    messages,
    maxTokens: 400,
  })

  return result.toDataStreamResponse()
}
