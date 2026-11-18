import projectsData from '../utilities/data/projectsData.json';
import VisitReadout from './VisitReadout';

const publishedProjects = projectsData.filter(({ fields }) => fields.Published);
const disciplines = new Set(
  publishedProjects.flatMap(({ fields }) => fields['Creative Discipline'] ?? [])
);

export default function PortfolioReadout() {
  return (
    <aside className="portfolio-readout" aria-labelledby="portfolio-readout-title">
      <h3 id="portfolio-readout-title" className="terminal-title">
        Portfolio readout
      </h3>
      <div className="terminal-content">
        <p className="terminal-command" aria-hidden="true">$ portfolio --summary</p>
        <dl className="readout-stats">
          <div><dd>{publishedProjects.length}</dd><dt>Projects</dt></div>
          <div><dd>{disciplines.size}</dd><dt>Disciplines</dt></div>
          <div><dd>40+</dd><dt>Client stores</dt></div>
        </dl>
        <VisitReadout />
      </div>
    </aside>
  );
}
