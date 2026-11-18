import Homesplash from '../components/home/homesplash';
import PortfolioReadout from '../components/home/PortfolioReadout';
import GitHubActivity from '../components/home/GitHubActivity';
import Link from 'next/link';
import { projectSlug } from '../components/utilities/projectSlug';
import TechStack from '../components/home/techstack';
import About from '../components/home/about';
import Services from '../components/home/Services';
import FetchServices from '../components/home/getServices';
import Contact from '../components/home/Contact';
import { siteUrl, siteName, developerTitle, profileTitle as title, profileDescription as description, linkedInUrl, headshotPath } from '../components/utilities/site';
import Companies from '../components/home/Companies';
import FetchCompanies from '../components/home/getCompanies';
import ParallaxProviderWrapper from '../components/utilities/ParallaxProviderWrapper';
// app/page.js
import Header from '../components/header';

export const metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName,
    images: [
      {
        url: '/files/og-home.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Billy Mitchell Dev: Full-Stack Product Engineer building e-commerce systems, API integrations, and automation',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [{ url: '/files/og-home.jpg', alt: 'Billy Mitchell Dev: Full-Stack Product Engineer building e-commerce systems, API integrations, and automation' }],
  },
};

// Structured data so search engines can connect this site to Billy as a person
const personJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      publisher: { '@id': `${siteUrl}/#person` },
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Billy Mitchell',
      url: siteUrl,
      image: `${siteUrl}${headshotPath}`,
      jobTitle: developerTitle,
      description,
      email: 'mailto:hello@billymitchell.dev',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Baltimore',
        addressRegion: 'MD',
        addressCountry: 'US',
      },
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'University of Maryland, Baltimore County',
      },
      knowsAbout: [
        'E-commerce development',
        'Front-end development',
        'Shopify',
        'REST API integrations',
        'Microservices',
        'Workflow automation',
        'Liquid',
        'React',
        'JavaScript',
      ],
      sameAs: [
        linkedInUrl,
        'https://github.com/billymitchell',
      ],
    },
  ],
};

// Updates to content
  // consider switching images to local files / links vs cloudinary

//Update Home Page
  // create new homesplash video and fallback animation
  // Order Companies by priority
  // Link Companies to a project
  // Sort services by priority
  // Link services to a project

// Update Portfolio Content
  // Add flyers to portfolio
  // Add new projects
    // forbes travel guide API 
    // ASE API integration
    // Shipping API integration
    // Orderdesk rule setups
    // forms to monday.com jobs
  // Update existing projects
    // itravel better - add XD images
    // travel authority - add XD images
  // remove excessive examples
  // add code base link for projects to project header 
  // update made for from unknown to educational corse w/link
  // Portfolio Sort
    // default by featured and then by date
  // review each project and all links, where can I improve?

// Update tech stack content
  // MAC
  // + symbol
  // create hover text reveal

// add/remove featured services content
  // - order services by priority
  // - add consulting service
  // - expand width to 1000px

// add/remove featured companies content
  // - add centricity largest company logos 
  // - order companies by priority

// Update about content
  // update with AI
  // update image
  // move to top of page

// Add contact content
  // add form and submit functionality

// Refactor and simplify code
  // dynamically call Airtable data
  // add typescript support 
  // Cloudinary vs NextImg component
  // // add portfolio all page
  // style 404 page
  // add analytics

export default function Home() {
  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
    />
    <Header page={"home"}/>
    <ParallaxProviderWrapper>
      <main id="home">
        <Homesplash />
        <section id="featured-work" className="home-page-section outer-container">
          <div className="inner-width-1000 featured-work-layout">
            <div className="featured-work-list">
              <h2 className="h3">Selected Development Projects</h2>
              <ul className="featured-projects">
                <li>
                  <Link href={`/portfolio/${projectSlug('Forbes Travel Guide Award API')}`}>
                    <strong>Forbes Travel Guide Award API</strong>
                    <span>A custom API for an international award redemption program.</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/portfolio/${projectSlug('Automotive Service Excellence Technician Validation API')}`}>
                    <strong>ASE Technician Validation API</strong>
                    <span>A REST API integration for validating technician credentials across client stores.</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/portfolio/${projectSlug('Orderdesk Fulfillment Rules')}`}>
                    <strong>Orderdesk Fulfillment Rules</strong>
                    <span>E-commerce order and fulfillment automation.</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              </ul>
              <Link href="/portfolio" className="button portfolio-link">View full portfolio</Link>
            </div>
            <PortfolioReadout />
          </div>
        </section>
        <GitHubActivity />
        <About />
        <TechStack />
        <Services>
          <FetchServices />
        </Services>
        <Companies>
          <FetchCompanies />
        </Companies>
        <Contact />
      </main>
    </ParallaxProviderWrapper>
    </>
  );
}
