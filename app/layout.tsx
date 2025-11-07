import "./globals.css";
import { Lato } from "next/font/google";

const lato = Lato({
  // Importing font family for the body
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  display: "swap",
});

export const metadata = {
  title: "tutera",
  description: "your brand, your rules",
  keywords: ["educator", "creator", "learning"],
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <main>
          {children}
          {modal}
        </main>
      </body>
    </html>
  );
}
