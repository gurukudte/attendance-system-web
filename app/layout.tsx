import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: "TalentSync | Modern HR Platform",
    template: "%s | TalentSync",
  },
  description:
    "Streamline your HR processes with our all-in-one platform. Talent acquisition, employee engagement, and analytics in one seamless solution.",
  keywords: [
    "HR software",
    "human resources platform",
    "talent management",
    "recruitment software",
    "employee engagement",
    "HR analytics",
  ],
  metadataBase: new URL("https://talentsync.example.com"),
  openGraph: {
    title: "TalentSync | Modern HR Platform",
    description: "All-in-one HR platform for the future of work",
    url: "https://talentsync.example.com",
    siteName: "TalentSync",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TalentSync | Modern HR Platform",
    description: "All-in-one HR platform for the future of work",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background antialiased")}>
        <Providers>
          {/* <Toaster /> */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
