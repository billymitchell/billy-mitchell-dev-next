const cloud = 'https://res.cloudinary.com/billymitchell/image/upload/f_auto,q_auto,w_96,c_limit/tech-stack';

const skillGroups = [
  {
    title: 'Languages & frameworks',
    skills: [
      { name: 'JavaScript', logo: `${cloud}/Unofficial_JavaScript_logo_2_fetebo` },
      { name: 'React', logo: `${cloud}/React-icon_sppngx` },
      { name: 'HTML', logo: `${cloud}/HTML5_logo_and_wordmark_hpthcm` },
      { name: 'CSS', logo: `${cloud}/CSS3_logo_and_wordmark_mkbbgs` },
      { name: 'Liquid', icon: 'M12 3C9 7 6 10 6 14a6 6 0 0 0 12 0c0-4-3-7-6-11Z M9 15a3 3 0 0 0 3 3' },
    ],
  },
  {
    title: 'APIs & integrations',
    skills: [
      { name: 'REST APIs', icon: 'm8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16' },
      { name: 'Third-party integrations', icon: 'm10 13 4-4m-6 6-1 1a3 3 0 0 1-4-4l3-3a3 3 0 0 1 4 0m4 6a3 3 0 0 0 4 0l3-3a3 3 0 0 0-4-4l-1 1' },
      { name: 'Microservices', icon: 'M9 3h6v6H9zM3 15h6v6H3zm12 0h6v6h-6zM12 9v3m-6 3v-3h12v3' },
      { name: 'Workflow automation', icon: 'm13 2-9 12h7l-1 8 10-12h-7l1-8Z' },
    ],
  },
  {
    title: 'Tools & platforms',
    skills: [
      { name: 'Shopify', icon: 'M5 7h14l2 14H3L5 7Zm4 1V6a3 3 0 1 1 6 0v2' },
      { name: 'Git', logo: `${cloud}/Git-logo-01_vzwkrs` },
      { name: 'Content management systems', icon: 'M4 5h16v14H4zM4 9h16m-12 4h8m-8 3h5' },
      { name: 'Hosting & deployment', icon: 'M4 5h16v5H4zm0 9h16v5H4zm3-7h.01M7 16h.01m10-9h.01M17 16h.01' },
      { name: 'AI-assisted coding', icon: 'M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z' },
    ],
  },
];

export default function TechStack() {
  return (
    <section id="tech-stack" className="home-page-section outer-container">
      <div className="inner-width-1000">
        <h2 className="h3">Technical Skills</h2>
        <div className="skill-groups">
          {skillGroups.map(({ title, skills }) => (
            <div className="skill-group" key={title}>
              <h3>{title}</h3>
              <ul>
                {skills.map(({ name, logo, icon }) => (
                  <li key={name}>
                    {logo ? (
                      <img src={logo} alt="" width={20} height={20} loading="lazy" decoding="async" />
                    ) : (
                      <svg aria-hidden="true" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                        <path d={icon} />
                      </svg>
                    )}
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
