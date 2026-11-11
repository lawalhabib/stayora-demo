import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Stayora | Exceptional stays, thoughtfully chosen",
  description: "Discover beautiful short-let apartments and make every stay feel special."
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}