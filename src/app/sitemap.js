import projectsData from '../components/utilities/data/projectsData.json';
import { projectSlug } from '../components/utilities/projectSlug';

const siteUrl = 'https://www.billymitchell.dev';

export default function sitemap() {
  const projectUrls = projectsData
    .filter(
      ({ fields }) =>
        fields.Published &&
        ['billymitchell.dev', 'Both'].includes(fields['Render On'])
    )
    .map(({ fields }) => {
      const lastModified = fields['Date Modified']
        ? new Date(fields['Date Modified'])
        : undefined;

      return {
        url: `${siteUrl}/portfolio/${projectSlug(fields['Project Title'])}`,
        ...(lastModified &&
          !Number.isNaN(lastModified.getTime()) && { lastModified }),
      };
    });

  return [
    {
      url: siteUrl,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteUrl}/portfolio`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...projectUrls,
  ];
}
