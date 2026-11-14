// src/components/home/FetchCompanies.tsx

// Import the pre-fetched Airtable data
import companiesData from '../utilities/data/companiesData.json';
import InViewAnimationTwo from '../utilities/InViewAnimationTwo.js';

const localLogos = {
  'companies/ftg': '/companies/ftg.svg',
  'companies/intel': '/companies/intel.svg',
  'companies/Centricity': '/companies/Centricity.svg',
  'companies/ase': '/companies/ase.svg',
  'companies/Royal_Caribbean_International': '/companies/Royal_Caribbean_International.png',
};


const FetchCompanies = function () {
  //Filter for featured companies (checking fields.Feature)
  const featuredCompanies = companiesData.filter(
    (company) => company.fields?.Feature === true
  );

  // Render featured companies
  return (
    <div className="companies-container grid-container col-5 col-gap-60 small-col-3 small-col-gap-25">
      {featuredCompanies.map((portfolio_item, index) => (
        <InViewAnimationTwo
        key={portfolio_item.id || portfolio_item._rawJson?.id || index}
        rootMargin="-25% 0%"
        delay={`delay-${index * 50 + 200}ms`}
        className="init-invisible flex"
        >
        <img
          className={`companies fluid justify-self-center align-self-center ${portfolio_item.fields?.[
            'Company Name'
          ]
            ?.toString()
            .toLowerCase()
            .replace('&', 'and')
            .replace(/\s/gi, '-')}`}
          src={localLogos[portfolio_item.fields['Company Logo']] ?? `https://res.cloudinary.com/billymitchell/image/upload/f_png,w_800,c_limit/${portfolio_item.fields['Company Logo']}`}
          alt={portfolio_item.fields['Company Name']?.toString()}
          loading="lazy"
          decoding="async"
        />
        </InViewAnimationTwo>
      ))}
    </div>
  );
};

export default FetchCompanies;
