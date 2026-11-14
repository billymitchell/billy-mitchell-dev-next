import '../styles/global.scss';
import Script from 'next/script';
import Footer from '../components/footer';
import Providers from '../components/Providers';
import { siteUrl, siteName, profileTitle, profileDescription } from '../components/utilities/site';

// Defaults shared by every page. Pages override title/description/openGraph.
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: profileTitle,
    template: '%s | Billy Mitchell',
  },
  description: profileDescription,
  authors: [{ name: 'Billy Mitchell', url: siteUrl }],
  icons: {
    icon: '/files/favicon.ico',
  },
  openGraph: {
    siteName,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/files/open-graph.png',
        width: 1200,
        height: 630,
        alt: 'Billy Mitchell, full-stack product engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/files/open-graph.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400..900&display=swap"
        />
        {/* Content is revealed by JS-driven animations; keep it visible without JS */}
        <noscript>
          <style>{'.init-invisible{opacity:1}.init-width-none{width:100%}.init-height-none{height:100%}'}</style>
        </noscript>
      </head>
      <body>
        <div className="outer-wrapper">
          <div className="main-container">
            <Providers>{children}</Providers>
          </div>
        </div>
        <Footer />
        {/* Icon font is only used in the footer, so load it after everything else */}
        <Script src="https://kit.fontawesome.com/da815149ed.js" strategy="lazyOnload" crossOrigin="anonymous" />
      </body>
    </html>
  );
}
