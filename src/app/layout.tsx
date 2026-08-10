import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://obgroupsolution.com"),
  title: {
    default: "OB Group Solution",
    template: "%s | OB Group Solution",
  },
  description:
    "OB Group Solution connects Apple device buyers and network technology customers with product guidance, installation support, and direct WhatsApp assistance.",
  applicationName: "OB Group Solution",
  openGraph: {
    title: "OB Group Solution",
    description:
      "Apple devices, networking, CCTV, and installation services built around direct customer support.",
    url: "https://obgroupsolution.com",
    siteName: "OB Group Solution",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
