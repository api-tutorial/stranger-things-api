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

  const isTrash = (value) => {
    const regexpToMatch = new RegExp(/\[.*?\]/, 'g')
    const match = value.match(regexpToMatch)
    return match ? value !== match[0] : true
  }
    
  let typeIndex = -1;
  let tableHeaders = undefined
  let tableCellIdx = 0
  let obj = {}
  let columnIdx = 0
  const typeAndTitle = allRows.map((row) => {
    if(row[0] === 'Title') {
      typeIndex++;
      tableHeaders = row;
    }
    else {
      return row.map((value, idx) => {
        if(isTrash(value) && rowColAttrs[tableCellIdx].value !== '') {
          let cleanVal = value.replace(/\n/g, '').replace(/\[.*?\]/, '') 
          if(rowColAttrs[tableCellIdx].rowspan) {
            console.log(rowColAttrs[tableCellIdx].value, cleanVal) 
            // need to know what column and save it as that value in our next obj
          }
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
