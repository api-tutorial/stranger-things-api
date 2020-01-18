const request = require('superagent');
const { parse } = require('node-html-parser');

const gimmeTheData = html => {
  const tableType = html.querySelectorAll('h3 .mw-headline')
    .map(node => node.rawText); // titles of table, outside table

  const rowColAttrs = html.querySelectorAll('td')
    .map(node => ({ ...node.attributes, value: node.rawText})); // each table cell

  console.log('what', rowColAttrs)

  const allRows = html.querySelectorAll('tr') // each table row
    .map(node => node.rawText
      .replace('\n', '')
      .split('\n')
      .filter(str => Boolean(str)));

  const tableTitles = allRows.filter(row => row[0] === 'Title'); // titles from tables TH
  const data = allRows.filter(row => row[0] !== 'Title'); // all rows, NOT including table header rows 
  
  let typeIndex = -1;
  const typeAndTitle = allRows.map((row) => {
    if(row[0] === 'Title') typeIndex++;
    else {
      return {
        title: row[0],
        type: tableType[typeIndex]
      }
    }
  }).filter(obj => obj instanceof Object)
  // console.log('WHAT', typeAndTitle)
};
  
const scraper = () => {
  return request
    .get('https://disney.fandom.com/wiki/Disney%2B')
    .then(res => res.text)
    .then(parse)
    .then(gimmeTheData)
};

scraper();

module.exports = { scraper };
