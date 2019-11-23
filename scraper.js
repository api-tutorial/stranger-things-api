const request = require('superagent');
const { parse } = require('node-html-parser');

const gimmeTheData = html => {
  const title = html.querySelectorAll('h3 .mw-headline')
    .map(node => node.rawText);
  const tables = html.querySelectorAll('.wikitable')
    .map(node => node.rawText)[1];
    // .map(any => typeof any);
  // const keys = tables.querySelectorAll('tr')
  //   .map(node => node.rawText)[0];
  
  return tables;
  // .map(node => node);
};
  
const scraper = () => {
  return request
    .get('https://disney.fandom.com/wiki/Disney%2B')
    .then(res => res.text)
    .then(parse)
    .then(gimmeTheData)
    .then(console.log);
};

scraper();

module.exports = { scraper };
