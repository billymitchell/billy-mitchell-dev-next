// app/portfolio/page.js (Server Component)

import Portfolio from '../portfolio/portfolio.js';
import projectsData from '../../components/utilities/data/projectsData.json';
import { projectSlug } from '../../components/utilities/projectSlug';
import { siteUrl, siteName } from '../../components/utilities/site';

const title = 'Full-Stack Development Portfolio';
const description =
  'Selected projects by Billy Mitchell, including e-commerce storefront features, REST API integrations, workflow automation, and front-end development.';

export const metadata = {
  title,
  description,
  alternates: {
    canonical: '/portfolio',
  },
  openGraph: {
    title: `${title} | Billy Mitchell`,
    description,
    url: `${siteUrl}/portfolio`,
    siteName,
    images: [
      {
        url: '/files/open-graph.png',
        width: 1200,
        height: 630,
        alt: 'Billy Mitchell portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} | Billy Mitchell`,
    description,
    images: ['/files/open-graph.png'],
  },
};

// Only the fields the grid needs are sent to the browser, instead of the whole
// Airtable export (body HTML, metadata, etc.), sorted newest first.
const projects = projectsData
  .filter(({ fields }) => fields.Published)
  .sort(
    (a, b) =>
      new Date(b.fields['End Date'] || '1970-01-01').getTime() -
      new Date(a.fields['End Date'] || '1970-01-01').getTime()
  )
  .map(({ id, fields }) => ({
    id,
    title: fields['Project Title'] || 'Untitled Project',
    slug: projectSlug(fields['Project Title'] || ''),
    image: fields['Featured Image URL'] || null,
    disciplines: fields['Creative Discipline'] || [],
  }));

const disciplines = Array.from(
  new Set(projects.flatMap((project) => project.disciplines))
);

export default function PortfolioPage() {
  return <Portfolio projects={projects} disciplines={disciplines} />;
}
