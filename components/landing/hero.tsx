import { ArrowRight, CircleCheck, CircleDot, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const rows = [
  { client: "Northpeak Retail", owner: "AK", status: "on-track" as const, task: "Kickoff assets due Fri", progress: 72 },
  { client: "Brightline Media", owner: "JR", status: "at-risk" as const, task: "Awaiting client sign-off", progress: 41 },
  { client: "Arcadia Partners", owner: "MS", status: "on-track" as const, task: "QA pass scheduled", progress: 88 },
  { client: "Fenwick Group", owner: "TL", status: "blocked" as const, task: "Contract amendment pending", progress: 20 },
];

const statusMap = {
  "on-track": { label: "On track", icon: CircleCheck, className: "bg-success/15 text-success" },
  "at-risk": { label: "At risk", icon: TriangleAlert, className: "bg-chart-4/20 text-chart-4" },
  blocked: { label: "Blocked", icon: CircleDot, className: "bg-destructive/10 text-destructive" },
};

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center"
      >
        <div className="h-[32rem] w-[64rem] rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:grid-cols-2 lg:px-8">
        <div>
          <Badge variant="secondary" className="mb-6 h-7 rounded-full px-3 text-xs">
            Built for agencies &amp; consulting teams
          </Badge>

          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
            Every client engagement,{" "}
            <span className="bg-gradient-to-r from-primary to-brand-secondary bg-clip-text text-transparent">
              one live console
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Client Ops Console unifies onboarding, tasks, communication, and billing
            status into a single view — so your team always knows where every
            client stands, without another status-update meeting.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-xl px-6 text-base"
              nativeButton={false}
              render={
                <a href="#pricing">
                  Start free trial
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              }
            />
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-xl px-6 text-base"
              nativeButton={false}
              render={<a href="#how-it-works">See how it works</a>}
            />
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/10 via-transparent to-success/10 blur-2xl"
          />
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(16,24,40,0.04),0_20px_48px_-16px_rgba(76,29,149,0.25)]">
            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-5 py-3.5">
              <div>
                <p className="text-sm font-medium">Client Health</p>
                <p className="text-xs text-muted-foreground">4 active engagements</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
                <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
                Live
              </span>
            </div>

            <ul className="divide-y divide-border">
              {rows.map((row) => {
                const status = statusMap[row.status];
                const StatusIcon = status.icon;
                return (
                  <li key={row.client} className="flex items-center gap-3 px-5 py-3.5">
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground"
                      aria-hidden="true"
                    >
                      {row.owner}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{row.client}</p>
                      <p className="truncate text-xs text-muted-foreground">{row.task}</p>
                    </div>
                    <div className="hidden w-20 shrink-0 sm:block">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${row.progress}%` }}
                        />
                      </div>
                    </div>
                    <span
                      className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${status.className}`}
                    >
                      <StatusIcon className="size-3" aria-hidden="true" />
                      {status.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
