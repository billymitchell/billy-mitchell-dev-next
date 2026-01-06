const fs = require('fs');
const path = require('path');
const Airtable = require('airtable');
const { log } = require('console');
require('dotenv').config({ path: '.env.local' });

// Initialize Airtable client
const apiKey = process.env.NEXT_PUBLIC_AIR_TABLE_TOKEN;
const baseId = 'appvr5KrgKiJo1E7M';

if (!apiKey) {
  throw new Error(
    'Missing Airtable API key. Check your environment variables.'
  );
}

const base = new Airtable({ apiKey }).base(baseId);

//https://airtable.com/appvr5KrgKiJo1E7M/api/docs#javascript/table:projects:list

const fetchAndSaveData = async () => {
  try {
    const projectsData = await base('Projects')
      .select({
        filterByFormula:
          "AND({Published}, OR({Render On} = 'billymitchell.dev', {Render On} = 'Both'))",
      })
      .all();
    if (!projectsData.length) {
      throw new Error('No Projects returned for the current filter.');
    }
    //console.log("projectsData", projectsData);
    const companiesData = await base('Companies')
      .select({
        filterByFormula:
          "OR({Render On} = 'billymitchell.dev', {Render On} = 'Both')",
      })
      .all();
    if (!companiesData.length) {
      throw new Error('No Companies returned for the current filter.');
    }
    //console.log("companiesData", companiesData);
    const servicesData = await base('Services')
      .select({
        filterByFormula:
          "OR({Render On} = 'billymitchell.dev', {Render On} = 'Both')",
      })
      .all();
    if (!servicesData.length) {
      throw new Error('No Services returned for the current filter.');
    }
    //console.log("servicesData", servicesData);
    const projectsPath = path.join(
      __dirname,
      '../utilities/data/projectsData.json'
    );
    const companiesPath = path.join(
      __dirname,
      '../utilities/data/companiesData.json'
    );
    const servicesPath = path.join(
      __dirname,
      '../utilities/data/servicesData.json'
    );

    fs.writeFileSync(projectsPath, JSON.stringify(projectsData, null, 2));
    fs.writeFileSync(companiesPath, JSON.stringify(companiesData, null, 2));
    fs.writeFileSync(servicesPath, JSON.stringify(servicesData, null, 2));
  } catch (error) {
    throw error;
  }
};

fetchAndSaveData().catch((error) => {
  console.error('Airtable fetch failed:', error);
  process.exit(1);
});
