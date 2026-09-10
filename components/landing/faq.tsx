import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How long does setup take?",
    answer:
      "Most teams import their client list, invite teammates, and connect Slack and email in under 15 minutes. There's no migration project or onboarding call required to get started.",
  },
  {
    question: "Can our clients see their status page without an account?",
    answer:
      "Yes. Client-facing status pages are shareable via a private link and don't require your clients to sign up or log in.",
  },
  {
    question: "Does Client Ops Console replace our project management tool?",
    answer:
      "It can, but it doesn't have to. Many teams keep their existing PM tool for internal execution and use the console as the client-facing layer on top, synced automatically.",
  },
  {
    question: "What happens to our data if we cancel?",
    answer:
      "You can export every client, task, and file to CSV or JSON at any time, including after cancellation, for 30 days.",
  },
  {
    question: "Is there a limit on team members?",
    answer:
      "No. Pricing is per active seat with no cap on the number of clients on the Team and Agency plans, so you can add teammates as you grow.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes, annual billing saves 20% compared to paying monthly, and is available on every plan including Starter.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Can&apos;t find what you&apos;re looking for? Reach us at{" "}
          <a href="mailto:hello@clientops.example" className="font-medium text-foreground underline underline-offset-4">
            hello@clientops.example
          </a>
          .
        </p>
      </div>

      <Accordion className="mt-10">
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger className="text-base">{faq.question}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
