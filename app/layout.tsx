import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import "./globals.css";

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
    <html lang="en" className={`${fontSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
