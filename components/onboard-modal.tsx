"use client"

import { useState } from "react"
import { X, User, Bot, Cpu, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface OnboardModalProps {
  onClose: () => void
  onAdd: (worker: any) => void
}

const WORKER_TYPES = [
  { value: "Human", icon: User, label: "Human", description: "Employee or contractor" },
  { value: "AI Agent", icon: Bot, label: "AI Agent", description: "Autonomous software agent" },
  { value: "Robot", icon: Cpu, label: "Robot", description: "Physical machine or drone" },
]

export function OnboardModal({ onClose, onAdd }: OnboardModalProps) {
  const [step, setStep] = useState<"type" | "details" | "confirm">("type")
  const [type, setType] = useState<string>("")
  const [form, setForm] = useState({
    name: "",
    role: "",
    owner: "",
    walletAddress: "",
    department: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    // Simulate FLock registration + 1.2s delay
    await new Promise(r => setTimeout(r, 1200))
    const newWorker = {
      id: `${type === "Human" ? "w" : type === "AI Agent" ? "a" : "r"}-${Math.floor(Math.random() * 9000 + 1000)}`,
      type,
      name: form.name,
      role: form.role,
      uptime: type === "Human" ? "0.0 hrs" : "0.0 hrs",
      labourCost: 0,
      tasksCompleted: 0,
      efficiency: 100,
      status: "Active" as const,
      ownershipVerified: true,
      walletAddress: form.walletAddress || undefined,
    }
    setSubmitting(false)
    setDone(true)
    setTimeout(() => {
      onAdd(newWorker)
      onClose()
    }, 1500)
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-base font-semibold text-foreground">Onboard worker</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="size-5" />
            </button>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-2 px-6 py-3 border-b border-border">
            {["type", "details", "confirm"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  "size-6 rounded-full text-xs font-semibold flex items-center justify-center",
                  step === s ? "bg-primary text-primary-foreground" :
                  ["type", "details", "confirm"].indexOf(step) > i ? "bg-chart-3 text-white" : "bg-secondary text-muted-foreground"
                )}>
                  {i + 1}
                </div>
                <span className={cn("text-xs", step === s ? "text-foreground font-medium" : "text-muted-foreground")}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
                {i < 2 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          <div className="p-6">
            {/* Step 1: Type */}
            {step === "type" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">What type of worker are you onboarding?</p>
                <div className="grid grid-cols-3 gap-3">
                  {WORKER_TYPES.map(({ value, icon: Icon, label, description }) => (
                    <button
                      key={value}
                      onClick={() => setType(value)}
                      className={cn(
                        "rounded-xl border p-4 text-left transition-all",
                        type === value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      )}
                    >
                      <Icon className={cn("size-5 mb-2", type === value ? "text-primary" : "text-muted-foreground")} />
                      <p className="text-sm font-medium text-card-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                    </button>
                  ))}
                </div>
                <button
                  disabled={!type}
                  onClick={() => setStep("details")}
                  className="w-full mt-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40 transition-opacity"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Details */}
            {step === "details" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Enter the worker's details.</p>
                {[
                  { field: "name", label: "Name", placeholder: type === "AI Agent" ? "e.g. Atlas-8" : type === "Robot" ? "e.g. Hauler Unit R-32" : "e.g. Jane Smith", required: true },
                  { field: "role", label: "Role / Subsystem", placeholder: type === "AI Agent" ? "e.g. Support Triage Subsystem" : "e.g. Field Technician", required: true },
                  { field: "owner", label: "Accountable owner", placeholder: "Name of responsible human", required: true },
                  ...(type !== "Human" ? [{ field: "walletAddress", label: "Base wallet address (optional)", placeholder: "0x...", required: false }] : []),
                ].map(({ field, label, placeholder, required }) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      {label} {required && <span className="text-destructive">*</span>}
                    </label>
                    <input
                      type="text"
                      value={form[field as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
                <div className="flex gap-3 mt-2">
                  <button onClick={() => setStep("type")} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
                    Back
                  </button>
                  <button
                    disabled={!form.name || !form.role || !form.owner}
                    onClick={() => setStep("confirm")}
                    className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === "confirm" && (
              <div className="space-y-4">
                {done ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <CheckCircle className="size-12 text-chart-3" />
                    <p className="text-sm font-semibold text-card-foreground">Worker onboarded</p>
                    <p className="text-xs text-muted-foreground text-center">Ownership registered on FLock · Worker added to dashboard</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">Confirm details before registering ownership on FLock.</p>
                    <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
                      {[
                        ["Type", type],
                        ["Name", form.name],
                        ["Role", form.role],
                        ["Accountable owner", form.owner],
                        ...(form.walletAddress ? [["Wallet", `${form.walletAddress.slice(0, 8)}...`]] : []),
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="text-card-foreground font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 text-xs text-primary">
                      Registering on FLock creates an on-chain ownership record linking {form.name} to {form.owner}.
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep("details")} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary">
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                      >
                        {submitting ? "Registering on FLock…" : "Confirm & Onboard"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
