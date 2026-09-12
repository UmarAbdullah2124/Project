import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { ThemeProvider } from "@/lib/theme-provider";
import "./globals.css";

const themeInitScript = `
(function () {
  try {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Client Ops Console — Run every client engagement from one place",
  description:
    "Client Ops Console unifies onboarding, tasks, communication, and billing status into one live view, so agency and consulting teams never lose track of a client.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <ThemeProvider>
          <SessionProvider>
            <ApolloWrapper>{children}</ApolloWrapper>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
