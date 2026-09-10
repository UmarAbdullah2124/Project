import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ListChecks,
  Globe,
  Receipt,
  Send,
  Plug,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Activity,
    title: "Unified client timeline",
    description:
      "Every email, file, task, and decision for a client lands on one timeline, so nobody has to dig through inboxes to find context.",
  },
  {
    icon: ListChecks,
    title: "Tasks & handoffs",
    description:
      "Assign work across teams, track handoffs between account and delivery, and see what's blocking each engagement in real time.",
  },
  {
    icon: Globe,
    title: "Client-facing status pages",
    description:
      "Give each client a branded, read-only status page that answers 'where are we?' before they have to ask.",
  },
  {
    icon: Receipt,
    title: "Billing & scope visibility",
    description:
      "Track retainer hours, scope changes, and outstanding invoices next to the work itself, not in a separate spreadsheet.",
  },
  {
    icon: Send,
    title: "Automated status digests",
    description:
      "Weekly summaries go out to stakeholders automatically, pulling from real activity instead of a manually written update.",
  },
  {
    icon: Plug,
    title: "Works with your stack",
    description:
      "Two-way sync with Slack, email, and your calendar keeps the console current without changing how your team already works.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything client ops needs, nothing it doesn&apos;t
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Replace the scattered docs, threads, and trackers with one system built
          around the client, not the tool.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="ring-border/80 transition-shadow hover:shadow-md">
            <CardHeader>
              <span className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-5" aria-hidden="true" />
              </span>
              <CardTitle className="text-base">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-[0.925rem] leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
