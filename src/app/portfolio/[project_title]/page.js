// src/app/portfolio/[project_title]/page.js
import projectsData from '../../../components/utilities/data/projectsData.json';
import companiesData from '../../../components/utilities/data/companiesData.json';
import cloudinaryData from '../../../components/utilities/data/cloudinaryData.json';
import { projectSlug } from '../../../components/utilities/projectSlug';
import { notFound } from 'next/navigation';
import Header from '../../../components/header';
import { cleanURL } from '../../../components/utilities/cleanURL';
import { siteUrl, siteName } from '../../../components/utilities/site';
import GalleryLightbox from '../../../components/GalleryLightbox';

// Only the projects in generateStaticParams exist; anything else is a real 404
export const dynamicParams = false;

const findProject = (slug) =>
  projectsData.find(
    (item) => projectSlug(item.fields['Project Title']) === slug
  );

const list = (value) => (Array.isArray(value) ? value.join(', ') : '');

// Plain-text summary for meta descriptions: intro copy without headings or tags
const plainText = (html = '') =>
  html
    .replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

const truncate = (text, max = 155) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' '))}...`;
};

const projectDescription = (data) => {
  const intro = plainText(data['Intro Text']);
  if (intro.length > 50) return truncate(intro);
  return `${data['Project Title']}: a ${list(data['Job Type'])} project by Billy Mitchell. ${list(
    data['Creative Discipline']
  )}, built with ${list(data['Made With'])}.`;
};

// Social share image: cropped to 1200x630 (videos fall back to the site image)
const shareImage = (data) =>
  isVideoFile(data['Featured Image URL'])
    ? `${siteUrl}/files/open-graph.png`
    : `https://res.cloudinary.com/billymitchell/image/upload/c_fill,w_1200,h_630,f_jpg,q_auto/portfolio/${data['Featured Image URL']}`;

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

// Generate metadata dynamically from the project data
export async function generateMetadata({ params }) {
  const project = findProject(params.project_title);
  if (!project) return {};

  const data = project.fields;
  const canonicalUrl = `${siteUrl}/portfolio/${params.project_title}`;
  const title = `${data['Project Title']} - Portfolio`;
  const description = projectDescription(data);
  const image = shareImage(data);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | Billy Mitchell`,
      description,
      url: canonicalUrl,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${data['Project Title']} featured image`,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Billy Mitchell`,
      description,
      images: [image],
    },
  };
}

// Function to generate static paths for all projects
export async function generateStaticParams() {
  return projectsData.map((project) => ({
    project_title: projectSlug(String(project.fields['Project Title'])),
  }));
}

// Helper functions
const isVideoFile = (url) => {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
};

const IfLiveURL = (data) => {
  if (data['Live Web Project URL']) {
    return (
      <>
        <span>
          <b>Live Project URL:</b>{' '}
        </span>
        <a target="_blank" rel="noreferrer" href={data['Live Web Project URL']}>
          {cleanURL (data['Live Web Project URL'])}
        </a>
        <br />
      </>
    );
  }
  return null;
};

const IfGitHubURL = (data) => {
  if (data['GitHub URL'] || data['2nd Github URL']) {
    return (
      <>
        <span>
          <b>GitHub Code Repository: </b>
        </span>

        {data['GitHub URL'] && (
          <a target="_blank" rel="noreferrer" href={data['GitHub URL']}>
            {cleanURL (data['GitHub URL'])}
          </a>
        )}
        {data['2nd Github URL'] && (
          <>
          {data['GitHub URL'] && <span> | </span>}
          <a target="_blank" rel="noreferrer" href={data['2nd Github URL']}>
            {cleanURL (data['2nd Github URL'])}
          </a>
          </>
        )}
        <br />
      </>
    );
  }
  return null;
};

const IfPosition = (data) => {
  if (data['Position on Project']) {
    return (
      <>
        <span>
          <b>Position:</b>{' '}
        </span>
        <span>{data['Position on Project']}</span>
        <br />
      </>
    );
  }
  return null;
};

// Helper to get an optimized Cloudinary URL (modern format, capped width)
const getCloudinaryMediaUrl = (filename, width = 1600) => {
  if (!filename) return '';
  if (isVideoFile(filename)) {
    return `https://res.cloudinary.com/billymitchell/video/upload/portfolio/${filename}`;
  }
  return `https://res.cloudinary.com/billymitchell/image/upload/f_auto,q_auto,w_${width},c_limit/portfolio/${filename}`;
};

// New helper to get Cloudinary media sources for videos
const getCloudinaryMediaSources = (filename) => {
  if (!filename) return [];
  const basePath = 'https://res.cloudinary.com/billymitchell/video/upload/portfolio/';
  const name = filename.replace(/\.(mp4|webm|ogg|mov|avi)$/i, '');
  return [
    { src: `${basePath}${name}.webm`, type: 'video/webm' },
    { src: `${basePath}${name}.mp4`, type: 'video/mp4' },
  ];
};

// Helper to get low-res Cloudinary video URL
const getCloudinaryLowResVideoSources = (filename) => {
  if (!filename) return [];
  const basePath = 'https://res.cloudinary.com/billymitchell/video/upload/w_600,q_40/portfolio/';
  const name = filename.replace(/\.(mp4|webm|ogg|mov|avi)$/i, '');
  return [
    { src: `${basePath}${name}.webm`, type: 'video/webm' },
    { src: `${basePath}${name}.mp4`, type: 'video/mp4' },
  ];
};

// Update renderHeader
const renderHeader = (data) => {
  if (data['Custom HTML']) {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: data['Custom HTML'],
        }}
      ></div>
    );
  } else if (data['Hide Featured Image In Body'] === true) {
    return null;
  } else {
    if (isVideoFile(data['Featured Image URL'])) {
      const sources = getCloudinaryMediaSources(data['Featured Image URL']);
      return (
        <video
          className="fetched-header"
          controls
          preload="metadata"
          // no autoplay, not muted, not looped
          playsInline
        >
          {sources.map((source) => (
            <source key={source.type} src={source.src} type={source.type} />
          ))}
          Your browser does not support the video tag.
        </video>
      );
    } else {
      const mediaUrl = getCloudinaryMediaUrl(data['Featured Image URL'], 1400);
      return (
        <img
          className="fetched-header"
          src={mediaUrl}
          alt={String(data['Project Title'])}
          loading="lazy"
          decoding="async"
        />
      );
    }
  }
};

const ifCustomBodyHTML = (data) => {
  if (data['Body Text']) {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: data['Body Text'],
        }}
      ></div>
    );
  }
  return null;
};

const ifIntroText = (data) => {
  if (data['Intro Text']) {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: data['Intro Text'],
        }}
      ></div>
    );
  }
  return null;
};



// Server Component to render the project page
export default function PortfolioContent({ params }) {
  const project = findProject(params.project_title);

  if (!project) {
    notFound();
  }

  const data = project.fields;

  // Company names for the "Made For" field. Companies that are not part of this
  // site's data export are skipped rather than shown as "Unknown Company".
  const companyNames = Array.isArray(data['Made For'])
    ? data['Made For']
        .map((companyId) => {
          const company = companiesData.find((item) => item.id === companyId);
          return company ? company.fields['Company Name'] : null;
        })
        .filter(Boolean)
    : [];

  // Gallery assets, trimmed to the fields the gallery renders
  const galleryAssets = (cloudinaryData[data['Gallery Folder Name']] || []).map(
    ({ asset_id, public_id, format, resource_type, width, height, secure_url, context }) => ({
      asset_id,
      public_id,
      format,
      resource_type,
      width,
      height,
      secure_url,
      ...(context && { context }),
    })
  );

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: data['Project Title'],
    description: projectDescription(data),
    url: `${siteUrl}/portfolio/${params.project_title}`,
    image: shareImage(data),
    ...(data['End Date'] && { dateCreated: data['End Date'] }),
    ...(data['Date Modified'] && { dateModified: data['Date Modified'] }),
    keywords: [...(data['Creative Discipline'] || []), ...(data['Made With'] || [])].join(', '),
    author: { '@type': 'Person', '@id': `${siteUrl}/#person`, name: 'Billy Mitchell', url: siteUrl },
  };

  return (
    <div id="portfolio-page" className="bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <Header />
      <main>
      <div className="portfolio-header-container">
        <div className="image-container">
          {isVideoFile(data['Featured Image URL']) ? (
            <video
              suppressHydrationWarning
              className="portfolio-header"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              // no controls attribute
            >
              {getCloudinaryLowResVideoSources(data['Featured Image URL']).map((source) => (
                <source key={source.type} src={source.src} type={source.type} />
              ))}
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              suppressHydrationWarning
              className="portfolio-header"
              src={getCloudinaryMediaUrl(data['Featured Image URL'])}
              alt=""
              fetchPriority="high"
            />
          )}
        </div>
        <h1 className="project-title">{String(data['Project Title'])}</h1>
      </div>
      <div className="outer-container-body">
        <div className="inner-text-width">
          <div className="portfolio-meta-data">
            <p>
              <span>
                <b>End Date:</b> {data['End Date'] ? formatDate(data['End Date']) : 'Ongoing'}
              </span>
              <br />
              {IfLiveURL(data)}
              {IfGitHubURL(data)}
              <span>
                <b>Creative Discipline:</b>{' '}
                {Array.isArray(data['Creative Discipline']) &&
                  data['Creative Discipline'].map((discipline, index) => (
                    <span key={index}>
                      {index > 0 && ' | '}
                      {discipline}
                    </span>
                ))}
              </span>
              <br />
              <span>
                <b>Job Type:</b> {list(data['Job Type'])}
              </span>
              <br />
              {companyNames.length > 0 && (
                <>
                  <span>
                    <b>Made for:</b>{' '}
                    {companyNames.map((name, index) => (
                      <span key={index} className="Company">
                        {index > 0 && ' | '}
                        {name}
                      </span>
                    ))}
                  </span>
                  <br />
                </>
              )}
              {IfPosition(data)}
              <span>
                <b>Made With:</b>{' '}
                {Array.isArray(data['Made With']) &&
                  data['Made With'].map((tech, index) => (
                    <span key={index} className="Company">
                      {index > 0 && ' | '}
                      {tech}
                    </span>
                  ))}
              </span>
              <br />
            </p>
          </div>
          <div className="intro-text">{ifIntroText(data)}</div>
        </div>
        <div className="inner-width">{renderHeader(data)}</div>
        <div className="inner-text-width imported-text">
          {ifCustomBodyHTML(data)}
        </div>
        <div className="inner-width gallery-section">
          {galleryAssets.length > 0 && (
            <GalleryLightbox
              assets={galleryAssets}
              projectTitle={data['Project Title']}
            />
          )}
        </div>
      </div>
      </main>
    </div>
  );
}
