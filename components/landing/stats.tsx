const stats = [
  { value: "38%", label: "Faster client onboarding" },
  { value: "12 hrs", label: "Saved per PM, every week" },
  { value: "4.9 / 5", label: "Average team rating" },
  { value: "99.95%", label: "Platform uptime" },
];

export function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <dt className="sr-only">{stat.label}</dt>
            <dd className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {stat.value}
            </dd>
            <p className="mt-1.5 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </dl>
    </section>
  );
}
