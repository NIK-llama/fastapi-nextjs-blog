import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FastAPI Blog - Modern Monorepo",
  description: "A fast, modern blog app built with Next.js App Router and FastAPI backend",
};

const themeScript = `
  (function() {
    try {
      var t = localStorage.getItem('theme') || 'auto';
      var isDark = t === 'dark' || (t === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground`}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
              {children}
            </main>
            <footer className="border-t border-border bg-card/50 py-6 mt-12 text-center text-sm text-muted-foreground">
              <div className="max-w-6xl mx-auto px-4">
                © {new Date().getFullYear()} FastAPI Blog Monorepo. Built with Next.js & FastAPI.
              </div>
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
