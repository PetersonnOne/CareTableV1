import type { Metadata } from "next";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { BrandLogo } from "@/components/brand-logo";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "CareTable — A little more care at every meal",
    template: "%s | CareTable",
  },
  description:
    "Thoughtful meal planning shaped around the people at your table.",
  icons: {
    icon: [{ url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" data-theme="midnight" suppressHydrationWarning>
        <body>
          <Providers>
            <a className="skip-link" href="#main">
              Skip to content
            </a>
            <Header />
            <main id="main">{children}</main>
            <footer>
              <BrandLogo />
              <p>A little more care at every meal.</p>
              <small>Qloo Agentic Hackathon · Original recipe suggestions</small>
            </footer>
          </Providers>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
