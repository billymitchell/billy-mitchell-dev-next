// src/app/portfolio/ProjectDisciplineButtons.js

const ProjectDisciplineButtons = ({ disciplines, onDisciplineSelect, activeDiscipline }) => {
  return (
    <>
      {['All', ...disciplines].map((discipline) => (
        <button
          key={discipline}
          type="button"
          onClick={() => onDisciplineSelect(discipline)}
          className={activeDiscipline === discipline ? 'active' : ''}
          aria-pressed={activeDiscipline === discipline}
        >
          {discipline}
        </button>
      ))}
    </>
  );
};

export default ProjectDisciplineButtons;
