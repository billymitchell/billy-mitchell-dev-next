import Link from 'next/link';
import Header from '../../components/header';
import styles from './pricing.module.scss';

export const metadata = {
  title: 'Freelance Development Pricing',
  description: 'Budget ranges for working directly with Billy Mitchell, a Baltimore-based independent developer offering e-commerce development, automation, AI consulting, SEO analysis, and website maintenance.',
  alternates: { canonical: '/pricing' },
  robots: { index: false },
};

const projects = [
  {
    name: 'Basic landing pages',
    budget: '$500+',
    description: 'A single responsive page for a product, service, or campaign, with one clear call to action.',
  },
  {
    name: 'Basic e-commerce development',
    budget: '$1,000+',
    description: 'A focused Shopify storefront setup or theme update using an existing theme. Custom features, catalog migrations, and integrations increase the project price.',
  },
  {
    name: 'Microservices & automation',
    budget: '$2,500+',
    description: 'Custom microservices, REST API integrations, and workflow automation that connect your storefront, fulfillment tools, and other systems.',
  },
  {
    name: 'AI adoption strategy & consulting',
    budget: '$400+',
    description: 'Review one workflow, identify where AI could help, and outline the work, data, and safeguards needed to pilot it.',
  },
  {
    name: 'SEO & website performance analysis',
    budget: '$400+',
    description: 'Review a representative set of pages for crawl and indexing issues, on-page SEO, and mobile performance. Get a prioritized list of fixes and implementation options.',
  },
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.intro}>
            <h1>Freelance development pricing</h1>
            <p>I’m Billy Mitchell, a Baltimore-based full-stack developer. Work directly with me on e-commerce systems, microservices, workflow automation, and practical AI adoption.</p>
            <Link href="/#contact" className="button button-primary">Discuss your project</Link>
          </header>

          <section aria-labelledby="project-pricing">
            <h2 id="project-pricing">Fixed-scope projects</h2>
            <p>Starting prices reflect a focused scope. I confirm the deliverables, timeline, and price in a proposal before work begins.</p>
            <div className={styles.projects}>
              {projects.map(({ name, budget, description }) => (
                <article className={styles.card} key={name}>
                  <h3>{name}</h3>
                  <p className={styles.price}>Starting at {budget}</p>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="contract-pricing">
            <h2 id="contract-pricing">Contract development</h2>
            <dl className={styles.rates}>
              <div>
                <dt>Hourly support</dt>
                <dd><strong>$100/hour</strong><p>For debugging, focused improvements, and development work with a changing scope.</p></dd>
              </div>
              <div>
                <dt>Monthly retainer</dt>
                <dd><strong>$80/hour · 20% off</strong><p>Pre-book at least 2 hours per month, starting at $160/month. Unused hours expire at the end of each month. Use your hours for fixes, improvements, or consulting.</p></dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="full-time-opportunities">
            <h2 id="full-time-opportunities">Full-time roles</h2>
            <p>I’m currently in a full-time position I enjoy. I’m open to hearing about exceptional opportunities, with compensation starting in the low-to-mid six figures.</p>
          </section>

          <section aria-labelledby="maintenance-pricing">
            <h2 id="maintenance-pricing">Website maintenance packages</h2>
            <p>Ongoing maintenance is available for storefront and website updates, bug fixes, and periodic performance checks. I’ll recommend a package based on your platform and how often you need support.</p>
          </section>

          <section aria-labelledby="scope-pricing">
            <h2 id="scope-pricing">What goes into the quote</h2>
            <p>Project prices increase with complexity, including the number of pages or products, custom functionality, migrations, and integrations. I quote implementation, testing, and handoff based on the agreed scope. Required hosting, paid themes, app subscriptions, and third-party API fees are additional and depend on the services your project needs.</p>
            <p>Send a short description of what you’re building, your platform, and your target timeline.</p>
            <div className={styles.actions}>
              <Link href="/#contact" className="button button-primary">Discuss your project</Link>
              <Link href="/portfolio" className="button">View portfolio</Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
