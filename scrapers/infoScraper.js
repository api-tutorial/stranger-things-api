const { parse } = require('node-html-parser');
const request = require('superagent');
const nameScraper = require('./nameScraper')
const { reformatData, getDataToFormat } = require('./utils')

const infoScraper = async() => {
  // const names = await nameScraper()

  try {
    // return Promise.all(
      // names.map(name => {
        return request.get(`https://strangerthings.fandom.com/wiki/Phil_Callahan`)
        .then(res => res.text)
        .then(parse)
        .then(html => getDataToFormat(html, 'Phil Callahan'))
        .then(reformatData)
        .then(console.log)
        .catch(err => console.log({ err }))
      // }))
    }
  catch(err) {
    console.error(err)
  }
};

infoScraper();

// module.exports = infoScraper;
