import Link from 'next/link';
import HeroWordmark from './HeroWordmark';
import ParticlePortrait from './ParticlePortrait';
import { developerTitle, headshotPath } from '../utilities/site';

export default function Homesplash() {
  return (
    <section className="home-hero outer-container">
      <div className="inner-width-1000 hero-layout">
        <div className="hero-copy">
          <HeroWordmark />
          <h2>{developerTitle}</h2>
          <p className="hero-specialty">E-commerce systems, API integrations, and automation</p>
          <p className="hero-availability">Baltimore, MD · Open to developer roles and freelance contracts</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/portfolio">View work</Link>
            <a className="button" href="/files/Billy-Mitchell-Resume.pdf">Résumé</a>
          </div>
        </div>
        <ParticlePortrait src={headshotPath} />
      </div>
    </section>
  );
}
