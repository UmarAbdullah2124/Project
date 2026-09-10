const steps = [
  {
    number: "01",
    title: "Connect your clients & tools",
    description:
      "Import active clients, invite your team, and connect Slack, email, and your calendar. Most teams are set up in under 15 minutes.",
  },
  {
    number: "02",
    title: "Centralize tasks & communication",
    description:
      "Every task, message, and file gets tied to a client automatically, replacing the scattered docs and DMs your team relies on today.",
  },
  {
    number: "03",
    title: "Share live status automatically",
    description:
      "Clients and stakeholders get a live status page and a weekly digest, so your team spends less time writing updates and more time doing the work.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border/70 bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Up and running in an afternoon
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No migration project required. Client Ops Console fits into how your
            team already works.
          </p>
        </div>

        <ol className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {steps.map((step) => (
            <li key={step.number}>
              <div className="flex items-center gap-4 sm:flex-col sm:items-start sm:gap-0">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-sm font-semibold text-primary-foreground">
                  {step.number}
                </span>
                <h3 className="text-lg font-semibold sm:mt-5">{step.title}</h3>
              </div>
              <p className="mt-2.5 text-muted-foreground sm:mt-3">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
