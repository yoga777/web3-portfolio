import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { profile } from "@/data/portfolio";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://www.yogalab.my.id";

// SEO description (157 chars): correct name first; the common "Yoga"
// spelling appears once, naturally, so the site is also found for it.
const SITE_DESCRIPTION =
  "Portofolio resmi Yuga Adi Kusuma (sering ditulis Yoga Adi Kusuma), Full Stack Developer asal Jombang dengan keahlian PHP, JavaScript, Python, dan PostgreSQL.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s | ${profile.name}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Yuga Adi Kusuma",
    "Yoga Adi Kusuma",
    "Portofolio Yuga Adi Kusuma",
    "Full Stack Developer Jombang",
    "Programmer Jombang",
    "IT Developer",
    "Full Stack Developer",
    "Web Developer Jombang",
    "PHP Developer Indonesia",
    "PostgreSQL Developer",
  ],
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  publisher: profile.name,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "profile",
    locale: "id_ID",
    url: SITE_URL,
    siteName: `${profile.name} — Portofolio`,
    title: `${profile.name} — ${profile.role}`,
    description: SITE_DESCRIPTION,
    firstName: "Yuga Adi",
    lastName: "Kusuma",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${profile.name} — ${profile.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: SITE_DESCRIPTION,
    images: ["/twitter-image"],
  },
  // Google Search Console verification for yogalab.my.id (code provided by
  // the owner on 2026-11-24; the value is public in the page source by
  // design). An env var can override it without a code change.
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
      "c4Mn1vKC4YpZsWeMssHJpke-qNGmMDPKcayUQ1Phx3s",
  },
};

// Structured data (schema.org): Person + WebSite. The "Yoga" spelling is
// declared as alternateName only — the owner's correct name is "Yuga".
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Yuga Adi Kusuma",
      alternateName: "Yoga Adi Kusuma",
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image`,
      description: SITE_DESCRIPTION,
      jobTitle: "Full Stack Developer",
      worksFor: {
        "@type": "Organization",
        name: "PT Nusantara Jaya Raya Mujur",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Jombang",
        addressRegion: "Jawa Timur",
        addressCountry: "ID",
      },
      email: `mailto:${profile.email}`,
      sameAs: [
        profile.socials.github,
        "https://yoga777.github.io/lowongan-it-surabaya-sidoarjo/",
      ],
      knowsAbout: [
        "PHP",
        "JavaScript",
        "Python",
        "PostgreSQL",
        "Flutter",
        "HTML",
        "CSS",
        "Web Development",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Yuga Adi Kusuma — Portofolio",
      description: SITE_DESCRIPTION,
      inLanguage: "id-ID",
      about: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

// Runs before first paint (next/script "beforeInteractive" is injected into
// <head>): a saved manual choice in localStorage wins; on a first visit the
// OS `prefers-color-scheme` decides. Sets the `.dark` class on <html> so
// there is no flash of the wrong theme.
const themeInitScript = `(function(){try{var t=localStorage.getItem("web3-portfolio-theme");if(t==="dark"||t==="light"){document.documentElement.classList.toggle("dark",t==="dark");}else if(window.matchMedia("(prefers-color-scheme: dark)").matches){document.documentElement.classList.add("dark");}}catch(e){document.documentElement.classList.add("dark");}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <Web3Provider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
