import ClientMasonry from '../../components/utilities/clientMasonry';
import InViewAnimationTwo from '../../components/utilities/InViewAnimationTwo.js';
import Link from 'next/link';

const CLOUD = 'https://res.cloudinary.com/billymitchell';

const FeaturedMedia = ({ project, index }) => {
  const { image, title } = project;
  if (!image) return <p className="title"><strong>{title}</strong></p>;

  // Videos and GIFs show a still frame in the grid
  const isVideo = /\.(mp4|webm|mov|gif)$/i.test(image);
  const src = isVideo
    ? `${CLOUD}/video/upload/so_0,f_jpg,q_auto:low,w_800,c_limit/v1750459284/portfolio/${image}`
    : `${CLOUD}/image/upload/f_auto,q_auto:good,w_800,c_limit/v1750459284/portfolio/${image}`;

  return (
    <>
      <img
        className="fluid"
        src={src}
        alt=""
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

const breakpointCols = {
  default: 3,
  1100: 3,
  700: 2,
  500: 1,
};

// `projects` arrives already filtered to published work and sorted newest first
const PortfolioContent = ({ projects, selectedDiscipline }) => {
  const visibleProjects =
    selectedDiscipline === 'All'
      ? projects
      : projects.filter((project) =>
          project.disciplines.includes(selectedDiscipline)
        );

  return (
    <div className="portfolio-item-container">
      {visibleProjects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <ClientMasonry
          breakpointCols={breakpointCols}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {visibleProjects.map((project, index) => (
            <InViewAnimationTwo
              key={project.id}
              delay={`delay-${index * 50 + 200}ms`}
              className="init-invisible"
            >
              <div id={project.id} className="portfolio-item">
                <Link href={`/portfolio/${project.slug}`}>
                  <FeaturedMedia project={project} index={index} />
                </Link>
              </div>
            </InViewAnimationTwo>
          ))}
        </ClientMasonry>
      )}
    </div>
  );
};

export default PortfolioContent;
