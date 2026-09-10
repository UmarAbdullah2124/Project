import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Placeholder testimonials — replace with verified customer quotes before launch.
const testimonials = [
  {
    quote:
      "We used to lose a full day every week just compiling status updates across clients. Now the console does it for us, and it's more accurate than what we were writing by hand.",
    name: "Priya N.",
    role: "Operations Lead, 40-person marketing agency",
    initials: "PN",
  },
  {
    quote:
      "The client-facing status pages alone paid for the subscription. Our clients stopped emailing 'just checking in' because they can see it themselves.",
    name: "Marcus D.",
    role: "Founder, brand & design studio",
    initials: "MD",
  },
  {
    quote:
      "Handoffs between account managers and delivery used to be where things fell through the cracks. That's basically gone now.",
    name: "Sofia R.",
    role: "Director of Client Services, consulting firm",
    initials: "SR",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Teams run leaner client ops with the console
        </h2>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name} className="justify-between ring-border/80">
            <CardContent>
              <div className="flex gap-0.5 text-chart-4" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <span className="sr-only">Rated 5 out of 5 stars</span>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
            </CardContent>
            <CardContent className="flex items-center gap-3 pt-1">
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground"
                aria-hidden="true"
              >
                {testimonial.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{testimonial.name}</p>
                <p className="truncate text-xs text-muted-foreground">{testimonial.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
