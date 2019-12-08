const request = require('superagent');
const { parse } = require('node-html-parser');

const gimmeTheData = html => {
  const tableType = html.querySelectorAll('h3 .mw-headline')
    .map(node => node.rawText);

  const rowColAttrs = html.querySelectorAll('td')
    .map(node => node.attributes);

  const allRows = html.querySelectorAll('tr')
    .map(node => node.rawText
      .replace('\n', '')
      .split('\n')
      .filter(str => Boolean(str)));

  const tableTitles = allRows.filter(row => row[0] === 'Title');
  const data = allRows.filter(row => row[0] !== 'Title');

  const rowSpanData = rowColAttrs.filter((att, i) => {
      if (att.hasOwnProperty('rowspan')) {
        const flatData = data.flat();
        att.value = flatData[i];
        att.startsAtIndex = i;
        return att;
      }
  });
  console.log(rowSpanData);
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
