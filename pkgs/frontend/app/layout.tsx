import type { Metadata } from 'next';
import '@/themes/styles/globals.css';
import Footer from '@/components/organisms/Footer';
import Header from '@/components/organisms/Header';
import Web3ProviderWrapper from '@/components/providers/Web3ProviderWrapper';

export const metadata: Metadata = {
  title: {
    template: '%s | CrossDonate',
    default: 'CrossDonate',
  },
  description: 'Web3寄付エコシステムの断片化問題を解決する次世代プラットフォーム',
  keywords: ['Web3', 'Donation', 'Blockchain', 'Cross-chain', 'Avail Nexus', 'CREATE2'],
  category: 'technology',
  authors: [{ name: 'CrossDonate Team', url: 'https://github.com/crossdonate' }],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'CrossDonate',
    description: 'Web3寄付エコシステムの断片化問題を解決する次世代プラットフォーム',
    url: 'https://crossdonate.org/',
    siteName: 'crossdonate.org',
    images: [
      {
        url: '/assets/crossdonate_logo_black_type.png',
        width: 243,
        height: 26,
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrossDonate',
    description: 'Web3寄付エコシステムの断片化問題を解決する次世代プラットフォーム',
    images: ['/assets/crossdonate_logo_black_type.png'],
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'oklch(0.98 0.005 270)' },
    { media: '(prefers-color-scheme: dark)', color: 'oklch(0.08 0.015 270)' },
  ],
  icons: {
    icon: '/assets/favicon/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body suppressHydrationWarning={true} className="font-sans antialiased">
        <Web3ProviderWrapper>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col w-full">{children}</main>
            <Footer />
          </div>
        </Web3ProviderWrapper>
      </body>
    </html>
  );
}
