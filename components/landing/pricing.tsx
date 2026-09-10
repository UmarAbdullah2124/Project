import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "cn";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/ seat / mo",
    description: "For small teams managing a handful of clients.",
    features: [
      "Up to 15 active clients",
      "Unified task & timeline view",
      "Slack & email sync",
      "Weekly status digests",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Team",
    price: "$59",
    period: "/ seat / mo",
    description: "For growing agencies that need client-facing status.",
    features: [
      "Unlimited active clients",
      "Client-facing status pages",
      "Billing & scope tracking",
      "Automated handoff rules",
      "Priority support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "Custom",
    period: "",
    description: "For multi-team agencies with custom workflows.",
    features: [
      "Everything in Team",
      "Custom roles & permissions",
      "SSO & audit logs",
      "Dedicated onboarding",
      "Uptime SLA",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-y border-border/70 bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Simple pricing that scales with your roster
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every plan includes a 14-day free trial. Annual billing saves 20%.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-start">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "ring-border/80",
                plan.highlighted && "ring-2 ring-primary shadow-lg lg:-translate-y-2"
              )}
            >
              <CardHeader>
                {plan.highlighted && (
                  <Badge className="mb-2 w-fit rounded-full px-2.5">Most popular</Badge>
                )}
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <p className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  )}
                </p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="border-t-0 bg-transparent px-(--card-spacing) pt-2">
                <Button
                  size="lg"
                  variant={plan.highlighted ? "default" : "outline"}
                  className="h-11 w-full rounded-xl"
                  nativeButton={false}
                  render={<a href="#top">{plan.cta}</a>}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
