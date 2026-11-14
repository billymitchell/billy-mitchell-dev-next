import Link from 'next/link';
import Header from '../components/header';

export const metadata = {
  title: 'Page Not Found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div id="portfolio" className="bg-black">
      <Header />
      <main>
        <div className="outer-container">
          <div className="inner-width">
            <h1>Page not found</h1>
            <p>That page doesn&apos;t exist or has moved.</p>
            <p>
              <Link href="/portfolio">Browse the portfolio</Link> or{' '}
              <Link href="/">head back home</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
