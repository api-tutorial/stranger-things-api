const { parse } = require('node-html-parser');
const request = require('superagent');

module.exports = () => {
  return request.get(`https://strangerthings.fandom.com/wiki/Category:Characters`)
    .then(res => res.text)
    .then(parse)
    .then(findCharLink)
    .then(findCharNames)
};

const findCharLink = html => html.querySelectorAll('.category-page__member-link');
const findCharNames = objs => {
  const names = objs.map(obj => obj.childNodes[0].rawText);
  return names.filter(name => !name.includes('Category:') && !name.includes('Minor Characters'));
};

