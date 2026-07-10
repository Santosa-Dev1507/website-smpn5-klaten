import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: '--font-jakarta'
});

export const metadata: Metadata = {
  title: "SMPN 5 Klaten - Generasi JUARA",
  description: "Website resmi SMPN 5 Klaten. Setiap Anak Punya Cara Sendiri untuk Jadi JUARA — Jujur, Unggul, Amanah, Religius, Berdaya.",
  metadataBase: new URL("https://www.smpn5klaten.sch.id"),
  alternates: { canonical: "/" },
  icons: {
    icon: "/logo_smpn5.png",
    apple: "/logo_smpn5.png",
  },
  openGraph: {
    title: "SMPN 5 Klaten - Generasi JUARA",
    description: "Website resmi SMPN 5 Klaten. Mendidik dengan hati, membentuk karakter, menginspirasi siswa menjadi pribadi JUARA.",
    url: "https://www.smpn5klaten.sch.id",
    siteName: "SMPN 5 Klaten",
    images: [{ url: "/logo_smpn5.png", width: 512, height: 512, alt: "Logo SMPN 5 Klaten" }],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className={plusJakartaSans.className}>
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-30PJ632B01" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-30PJ632B01');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
