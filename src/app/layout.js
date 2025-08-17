import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./context/context";
import 'primereact/resources/themes/lara-light-blue/theme.css';  // Theme
import 'primereact/resources/primereact.min.css';                // Core
import 'primeicons/primeicons.css';                              // Icons


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Withread blog site",
  description: "The home of great and creative minded creators",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
         <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
