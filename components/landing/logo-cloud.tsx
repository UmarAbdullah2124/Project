const logos = [
  "NORTHPEAK",
  "Brightline",
  "ARCADIA & CO",
  "Fenwick Group",
  "Lumen Studio",
  "Verity Partners",
];

export function LogoCloud() {
  return (
    <section className="border-y border-border/70 bg-muted/40 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Trusted by operations teams at growing agencies
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 grayscale">
          {logos.map((name) => (
            <li
              key={name}
              className="text-lg font-semibold tracking-tight text-muted-foreground/70 select-none"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
