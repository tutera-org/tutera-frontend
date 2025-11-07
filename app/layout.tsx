import "./globals.css";

export const metadata = {
  title: "tutera",
  description: "your brand, your rules",
  keywords: ["educator", "creator", "learning"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main> {children} </main>
      </body>
    </html>
  );
}
