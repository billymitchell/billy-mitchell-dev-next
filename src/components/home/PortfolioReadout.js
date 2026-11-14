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
        <dl className="terminal-metrics">
          <div><dt>Published projects</dt><dd>{publishedProjects.length}</dd></div>
          <div><dt>Disciplines</dt><dd>{disciplines.size}</dd></div>
          <div><dt>Active client stores at Centricity</dt><dd>40+</dd></div>
        </dl>
        <VisitReadout />
        <p className="terminal-note">Viewport and scroll progress are measured locally for this visit.</p>
      </div>
    </aside>
  );
}
