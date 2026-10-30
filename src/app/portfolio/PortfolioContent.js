import ClientMasonry from '../../components/utilities/clientMasonry';
import InViewAnimationTwo from '../../components/utilities/InViewAnimationTwo.js';
import { projectSlug } from '../../components/utilities/projectSlug';
import Link from 'next/link';
import projectsData from '../../components/utilities/data/projectsData.json';

const IfFeaturedMedia = ({ portfolioItem, index }) => {
  const imageUrl = portfolioItem.fields['Featured Image URL'];
  const title = portfolioItem.fields['Project Title'] || 'Untitled Project';
  const isVideo = imageUrl
    ? /\.(mp4|webm|mov|gif)$/i.test(imageUrl)
    : false; // Include GIFs as videos

  if (!imageUrl) return null;

  if (isVideo) {
    const posterUrl = `https://res.cloudinary.com/billymitchell/video/upload/so_0,f_jpg,q_auto:low,w_800,c_limit/v1750459284/portfolio/${imageUrl}`;

    return (
      <>
        <img
          className="fluid"
          id={portfolioItem.id}
          src={posterUrl}
          alt={title}
          loading={index < 3 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          decoding="async"
        />
        <p className="title">
          <strong>{title}</strong>
        </p>
      </>
    );
  }

  const transformedUrl = `https://res.cloudinary.com/billymitchell/image/upload/dpr_auto,f_auto,q_auto:good,w_800,c_limit/v1750459284/portfolio/${imageUrl}`;

  return (
    <>
      <img
        className="fluid"
        id={portfolioItem.id}
        src={transformedUrl}
        alt={title}
        loading={index < 3 ? 'eager' : 'lazy'}
        fetchPriority={index === 0 ? 'high' : 'auto'}
        decoding="async"
      />
      <p className="title">
        <strong>{title}</strong>
      </p>
    </>
  );
};

const PortfolioContent = ({ selectedDiscipline }) => {
  const handleLinkClick = (item) => {
    // Only log critical errors or important events
    if (!item || !item.id) {
      console.error('Portfolio item missing or invalid:', item);
    }
    // Remove other non-critical logs
  };

  const selectedPortfolioContent = projectsData.filter((item) => {
    if (selectedDiscipline === 'All') return item.fields.Published;
    return item.fields['Creative Discipline']?.includes(selectedDiscipline);
  });

  const sortedPortfolioItems = selectedPortfolioContent.sort((a, b) => {
    const dateA = new Date(a.fields['End Date'] || '1970-01-01');
    const dateB = new Date(b.fields['End Date'] || '1970-01-01');
    return dateB.getTime() - dateA.getTime();
  });

  const breakpointCols = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="portfolio-item-container">
      {sortedPortfolioItems.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <ClientMasonry
          breakpointCols={breakpointCols}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {sortedPortfolioItems.map((portfolioItem, index) => {
            const portfolioKey =
              portfolioItem.id ||
              portfolioItem._rawJson?.id ||
              portfolioItem.fields?.['Project Title'] ||
              index;
            return (
            <InViewAnimationTwo
              key={portfolioKey}
              delay={`delay-${index * 50 + 200}ms`}
              className="init-invisible"
            >
              <div id={portfolioItem.id} className="portfolio-item">
                <Link
                  href={`/portfolio/${projectSlug(
                    portfolioItem.fields['Project Title']
                  )}`}
                  onClick={() => handleLinkClick(portfolioItem)}
                >
                  <IfFeaturedMedia portfolioItem={portfolioItem} index={index} />
                </Link>
              </div>
            </InViewAnimationTwo>
            );
          })}
        </ClientMasonry>
      )}
    </div>
  );
};

export default PortfolioContent;
