import Link from "next/link";
import { LayoutDashboard, X, Mail, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "mailto:hello@clientops.example" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Help center", href: "#" },
      { label: "API docs", href: "#" },
      { label: "Status", href: "#" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "#" },
      { label: "Terms of service", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

const socials = [
  { label: "X (Twitter)", icon: X, href: "#" },
  { label: "Community", icon: MessageCircle, href: "#" },
  { label: "Email", icon: Mail, href: "mailto:hello@clientops.example" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="size-4" aria-hidden="true" />
              </span>
              <span>Client Ops Console</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The operations layer for agencies and consulting teams running
              multiple clients at once.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <social.icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.heading}>
                <h3 className="text-sm font-semibold">{column.heading}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Client Ops Console. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
