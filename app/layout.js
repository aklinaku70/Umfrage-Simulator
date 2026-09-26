import "./globals.css";

export const metadata = {
  title: "Callcenter Simulator",
  description: "Simulator praktik për cold calls (anketë vere, gjermanisht)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sq" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-100 font-sans">{children}</body>
    </html>
  );
}
