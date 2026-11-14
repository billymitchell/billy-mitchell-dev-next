const services = [
  {
    title: 'E-commerce development',
    description: 'I build and improve Shopify storefronts, customize Liquid themes, and troubleshoot product data, checkout, and shipping flows.',
  },
  {
    title: 'API integrations and automation',
    description: 'I connect storefronts to third-party systems through REST APIs, build custom microservices, and automate order and fulfillment workflows.',
  },
  {
    title: 'Front-end development',
    description: 'I build responsive interfaces and landing pages with React, JavaScript, HTML, and CSS.',
  },
];

export default function FetchServices() {
  return services.map(({ title, description }) => (
    <article key={title} className="service">
      <h3 className="h4">{title}</h3>
      <p>{description}</p>
    </article>
  ));
}
