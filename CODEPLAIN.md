# Codeplain — Spec-Driven Development in United

United was built using a spec-driven development workflow powered by [Codeplain](https://codeplain.ai). This document explains how ***plain specifications were used throughout the project.

## What is spec-driven development?

Instead of writing code directly, we first wrote precise specifications in ***plain — a structured specification language. Codeplain then generated working TypeScript/Next.js code from those specs, which was integrated into the project.

This approach gave us:
- A single source of truth for what the integration layer should do
- Consistent, testable code generated from explicit acceptance criteria
- The ability to regenerate or update integrations by editing the spec, not the code

## How we used it

### The primary spec: `united.plain`

The file `united.plain` in the root of this repository is the primary ***plain specification. It covers:

**Definitions** — all core concepts: Worker, WalletAddress, OwnershipVerification, ZKVerificationRate, ROIScore, PayrollTransaction, MockMode

**Functional specs** — what each feature must do:
- DashboardSidebar navigation with real routing
- WorkforceTable ownership shields and ZK badges
- BillingPage with Solvimon data
- PayrollPage with Base L2 ETH transactions

**Implementation requirements** — specific technical constraints:
- Which env vars trigger real vs mock mode
- Exact mock data values for each integration
- TypeScript interface definitions

**Acceptance tests** — verifiable criteria:
- `verifyOwnership("a-2207")` returns `verified: true`
- `sendPayroll()` in MockMode resolves within 4000ms
- PayrollPage renders exactly 4 rows

### What Codeplain generated

Running `python plain2code.py united.plain` produced:

```
lib/solvimon.ts       — Solvimon billing integration
lib/base-payroll.ts   — Base L2 ETH payment integration
lib/flock.ts          — FLock.io ownership verification
lib/zkverify.ts       — zkVerify proof rate lookup
app/billing/page.tsx  — Billing analytics page
app/payroll/page.tsx  — Payroll management page
app/api/billing/summary/route.ts  — Billing API route
app/api/payroll/send/route.ts     — Payroll API route
components/payroll-tables.tsx     — Payroll UI components
```

### The second spec: `united-connectors.plain`

A second specification covers the connector framework — the data integration layer that allows United to pull worker data from real enterprise systems like Workday, LangChain, AgentOps, and Formant.

## Running the specs

```bash
# Install Codeplain
git clone https://github.com/Codeplain-ai/codeplain.git
cd codeplain
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Set API key
export CODEPLAIN_API_KEY="your_key"

# Run primary spec
python plain2code.py /path/to/united.plain

# Run connector spec
python plain2code.py /path/to/united-connectors.plain
```

## Why this approach

The integration layer — connecting to Solvimon, Base L2, FLock, and zkVerify — is the hardest part of United to get right. Each integration needs:
- Correct API authentication
- Graceful fallback to mock data
- TypeScript type safety
- Testable acceptance criteria

Writing specs first forced us to define the exact behaviour before writing any code. The generated code matched the spec exactly, including mock values, error handling, and TypeScript interfaces. Updating an integration means editing one line in the spec and regenerating — not hunting through implementation code.
