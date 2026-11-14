// app/portfolio/Portfolio.tsx (Client Component)
'use client';

import React, { useState } from 'react';
import PortfolioContent from '../portfolio/PortfolioContent.js';
import ProjectDisciplineButtons from '../portfolio/ProjectDisciplineButtons.js';
import Header from '../../components/header';


const Portfolio = ({ projects, disciplines }) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');

  // Handle discipline button click
  const handleDisciplineSelect = (discipline) => {
    setSelectedDiscipline(discipline);
  };

  return (
    <div id="portfolio" className="bg-black">
      <Header />
      <main>
      <div className="outer-container">
        <div className="inner-width">
          <h1>Development Portfolio</h1>
          <p>Explore my work in e-commerce, API integration, front-end development, and digital design.</p>
          <div className="button-container">
            {/* Render discipline buttons from ProjectDisciplineButtons component */}
            <ProjectDisciplineButtons
              disciplines={disciplines}
              onDisciplineSelect={handleDisciplineSelect}
              activeDiscipline={selectedDiscipline}
            />
          </div>
        </div>
      </div>
      <div className="outer-container">
        <div className="inner-width-full">
          {/* PortfolioContent now handles filtering based on selectedDiscipline */}
          <PortfolioContent projects={projects} selectedDiscipline={selectedDiscipline} />
          {/* <div className="text-center padding-top-15 padding-bottom-15">
            <a href="/portfolio/all">View All Other Published Portfolio Work</a>
          </div> */}
        </div>
      </div>
      </main>
    </div>
  );
};

export default Portfolio;
