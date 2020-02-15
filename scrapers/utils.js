const lodash = require('lodash');

const removeSymbol = arr => arr.map(str => str.replace(' †', ''))
const removeHtmlTags = str => str.replace('<small>', '').replace('</small>', '').replace('<p>', '').replace('</p>', '')

const getDataToFormat = (html, name) => {
  const labels = html.querySelectorAll('.pi-data-label').map(l => l.structuredText)
  const values = html.querySelectorAll('div .pi-data-value')
  const photoInfo = html.querySelectorAll('.pi-image-thumbnail').length 
    ? html.querySelectorAll('.pi-image-thumbnail')[0].rawAttrs.split('"')[1] 
    : 'https://upload.wikimedia.org/wikipedia/commons/3/38/Stranger_Things_logo.png' // default logo image
  return { labels, values, photoInfo, name };
}

const reformatData = ({ labels, values, photoInfo, name }) => {
  if(labels.length === values.length) {
    const obj = {};
    obj.photo = photoInfo;
    obj.name = name;
    labels.map((l, i) => {
      const label = lodash.camelCase(l)
      const value = values[i].text
      const htmlVal = values[i].innerHTML
      if(label === 'appearsInEpisodes') {
        let newVal = value.trim().split(' ')
        obj[label] = newVal.length > 0 ? newVal : newVal[0]
      }
      else if(htmlVal.includes('<br />')) {
        if(label === 'affiliation') {
          let newVal = htmlVal.split('>').map(str => str.trim())
            .filter(str => str[0] !== '<' && str[0] !== '/' && str.length > 0 && !str.includes('(formerly)'))
            .map(str => str.replace('</a', '').replace('</small', ''))
          newVal = newVal.map(str => {
            if(str.includes('<a href')) return
            else return str
          })
          obj[label] = newVal.filter(s => s)
        }
        else if(!htmlVal.includes('<a href')) {
          const newVal = htmlVal.split('<br />')
            .filter(s => s).map(s => removeHtmlTags(s))
          obj[label] = removeSymbol(newVal)
        }
      }
      else if(value.includes(')') && label !== 'height') {
        let newVal = value.split(')').map(s => s.length > 0 ? (s + ')').trim() : undefined).filter(s => s && s !== ')')
        if(label === 'residence') {
          newVal = newVal.map(s => s.replace(': ', '').trim())
        }
        newVal = removeSymbol(newVal)
        obj[label] = newVal.length === 1 ? newVal[0] : newVal
      }
      else {
        obj[label] = value
      }
    });
    return obj;
  }
  else undefined
};

module.exports = {
  reformatData,
  getDataToFormat
}
