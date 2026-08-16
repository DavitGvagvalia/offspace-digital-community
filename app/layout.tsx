import type { Metadata, Viewport } from "next";
import { Manrope,Quicksand } from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://offspace.ge"),

  title: {
    default: "Offspace Digital Community",
    template: "%s · Offspace",
  },

  description:
    "A creative-tech community where people learn digital skills, build real projects, meet interesting people, and grow together.",

  applicationName: "Offspace Digital Community",

  keywords: [
    "Offspace",
    "Offspace Digital Community",
    "creative tech",
    "digital community",
    "web development",
    "UI UX",
    "graphic design",
    "photography",
    "digital skills",
    "creative community",
    "online learning",
    "Georgia",
    "Tbilisi",
  ],

  authors: [{ name: "Offspace Digital Community" }],
  creator: "Offspace Digital Community",
  publisher: "Offspace Digital Community",

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Offspace Digital Community",
    title: "Offspace Digital Community",
    description:
      "Learn digital skills, build real things, and grow alongside a creative community.",
    url: "https://offspace.ge",
  },

  twitter: {
    card: "summary_large_image",
    title: "Offspace Digital Community",
    description:
      "Learn digital skills, build real things, and grow alongside a creative community.",
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "education",
};

export const viewport: Viewport = {
  themeColor: "#123524",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${quicksand.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}