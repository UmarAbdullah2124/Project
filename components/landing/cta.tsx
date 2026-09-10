import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-14 text-center sm:px-16 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"
        />
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
          Give your team one place to run every client
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/85">
          Start your free 14-day trial today. No credit card required.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            variant="secondary"
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
            size="lg"
            variant="ghost"
            className="h-12 rounded-xl px-6 text-base text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
            nativeButton={false}
            render={<a href="mailto:hello@clientops.example">Talk to sales</a>}
          />
        </div>
      </div>
    </section>
  );
}
