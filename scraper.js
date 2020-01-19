const request = require('superagent');
const { parse } = require('node-html-parser');

const gimmeTheData = html => {
  const tableType = html.querySelectorAll('h3 .mw-headline')
    .map(node => node.rawText); // titles of table, outside table

  const rowColAttrs = html.querySelectorAll('td')
    .map(node => ({ ...node.attributes, value: node.rawText.replace(/\n/g, '').replace(/\[.*?\]/, '')})); // each table cell

  // console.log('what', rowColAttrs)

  const allRows = html.querySelectorAll('tr') // each table row
    .map(node => node.rawText
      .replace('\n', '')
      .split('\n')
      .filter(str => Boolean(str)));
    
  let typeIndex = -1;
  let tableHeaders = undefined
  let tableCellIdx = 0
  const typeAndTitle = allRows.map((row) => {
    if(row[0] === 'Title') {
      typeIndex++;
      tableHeaders = row;
    }
    else {
      return row.map((value) => {
        const regexpToMatch = new RegExp(/\[.*?\]/, 'g')
        const match = value.match(regexpToMatch)
        const bool = match ? value !== match[0] : true
        if(bool && rowColAttrs[tableCellIdx].value !== '') {
          console.log({
            cellWithinRow: value.replace(/\n/g, '').replace(/\[.*?\]/, ''), 
            cellValue: rowColAttrs[tableCellIdx].value
          })
          tableCellIdx++;
        }
      })
    }
  }).filter(obj => obj instanceof Object)
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
