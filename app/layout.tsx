import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { SessionProvider } from "@/components/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import SplashScreen from "@/components/SplashScreen";

export const metadata: Metadata = {
  title: "FreeloLedger - Company Finance Tracker",
  description: "Track your company project income, payments, team payouts, and expenses",
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico' }, // Fallback for older browsers
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
        <ThemeProvider>
          <SessionProvider>
            <SplashScreen />
            <div className="min-h-screen w-full overflow-x-hidden">
              <Navigation />
              <main className="mobile-nav-spacing w-full md:ml-72 md:w-[calc(100%-18rem)] overflow-x-hidden">
                {children}
              </main>
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
