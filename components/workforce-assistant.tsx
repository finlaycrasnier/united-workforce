"use client"

import { useChat } from "@ai-sdk/react"
import { useRef, useState } from "react"
import { X, Send, Bot, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const SUGGESTED_PROMPTS = [
  "Which agents have security risks?",
  "What are my automation savings this month?",
  "Show me all flagged workers",
  "Compare Atlas-7 vs Quill-3 performance",
  "Who owns each AI agent?",
  "Which worker has the best ROI?",
]

export function WorkforceAssistant() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    messages,
    input,
    setInput,
    append,
    isLoading,
  } = useChat({ api: "/api/chat" })

  const safeInput = input ?? ""

  const send = async () => {
    const text = safeInput.trim()
    if (!text || isLoading) return
    setInput("")
    await append({ role: "user", content: text })
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-lg transition-all",
          open
            ? "bg-secondary text-muted-foreground border border-border"
            : "bg-primary text-primary-foreground hover:opacity-90"
        )}
      >
        {open ? <X className="size-4" /> : <Sparkles className="size-4" />}
        {open ? "Close" : "Ask United AI"}
      </button>

      {open && (
        <div
          className="fixed bottom-20 right-6 z-40 w-96 rounded-2xl border border-border bg-background shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: "70vh" }}
        >
          <div className="flex items-center gap-3 border-b border-border px-4 py-3 bg-card">
            <div className="flex size-7 items-center justify-center rounded-full bg-primary">
              <Bot className="size-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-card-foreground">Workforce Intelligence</p>
              <p className="text-xs text-muted-foreground">Powered by Vercel AI SDK</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground text-center">Ask anything about your workforce</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_PROMPTS.map(p => (
                    <button
                      key={p}
                      onClick={() => {
                        setInput("")
                        append({ role: "user", content: p })
                      }}
                      className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(m => (
              <div key={m.id} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
                {m.role === "assistant" && (
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary mt-0.5">
                    <Bot className="size-3.5 text-primary-foreground" />
                  </div>
                )}
                <div className={cn(
                  "rounded-xl px-3 py-2 text-sm max-w-[80%] leading-relaxed",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-card-foreground"
                )}>
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary mt-0.5">
                  <Bot className="size-3.5 text-primary-foreground" />
                </div>
                <div className="rounded-xl border border-border bg-card px-3 py-2">
                  <div className="flex gap-1">
                    <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border p-3 flex gap-2">
            <input
              ref={inputRef}
              value={safeInput}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about your workforce..."
              className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={send}
              disabled={isLoading || !safeInput.trim()}
              className="rounded-lg bg-primary px-3 py-2 text-primary-foreground disabled:opacity-40 transition-opacity hover:opacity-90"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
