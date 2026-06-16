import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme/theme-provider";
import DisclaimerModal from "@/components/common/disclaimer-modal";

export const metadata: Metadata = {
  title: "Living Law",
  description: "Professional Legal & Counselling Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <DisclaimerModal />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}