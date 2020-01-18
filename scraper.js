const request = require('superagent');
const { parse } = require('node-html-parser');

const gimmeTheData = html => {
  const tableType = html.querySelectorAll('h3 .mw-headline')
    .map(node => node.rawText); // titles of table, outside table

  const rowColAttrs = html.querySelectorAll('td')
    .map(node => ({ ...node.attributes, value: node.rawText})); // each table cell

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
        const noDumbValue = new RegExp(/\[.*?\]/, 'g')
        if(!value.match(noDumbValue) && rowColAttrs[tableCellIdx].value !== '\n') {
          console.log({cellWithinRow: value, cellValue: rowColAttrs[tableCellIdx].value})
          tableCellIdx++;
        }
      })
      // return {
      //   title: row[0],
      //   type: tableType[typeIndex]
      // }
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
