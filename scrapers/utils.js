const lodash = require('lodash');

const removeSymbol = arr => arr.map(str => str.replace(' †', ''))
const removeHtmlTags = str => str.replace('<small>', '').replace('</small>', '').replace('<p>', '').replace('</p>', '')
const genFinalValue = (label, val) => {
  if(['otherRelations', 'aliases', 'appearsInEpisodes', 'occupation', 'affiliation'].includes(label)) {
    return val instanceof Array ? val : [val]
  } else {
    return val instanceof Array ? val[0] : val
  }
};

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
    return labels.reduce((acc, l, i) => {
      const label = lodash.camelCase(l)
      const value = values[i].text
      const htmlVal = values[i].innerHTML
      if(label === 'appearsInEpisodes') {
        let newVal = value.trim().split(' ').map(s => s.replace(',', ''))
        acc[label] = genFinalValue(label, newVal)
      }
      else if(htmlVal.includes('<br />') || htmlVal.includes('<br>')) {
        if(label === 'affiliation') {
          let newVal = htmlVal.split('>').map(str => str.trim())
            .filter(str => str[0] !== '<' && str[0] !== '/' && str.length > 0 && !str.includes('(formerly)'))
            .map(str => str.replace('</a', '').replace('</small', ''))
          newVal = newVal.map(str => {
            if(str.includes('<a href')) return
            else return str
          })
          acc[label] = genFinalValue(label, newVal.filter(s => s))
        }
        else if(!htmlVal.includes('<a href')) {
          let newVal = htmlVal.split('<br />')
            .filter(s => s).map(s => removeHtmlTags(s))
          newVal = removeSymbol(newVal)
          acc[label] = genFinalValue(label, newVal)
        }
        else {
          let newVal = htmlVal.split('>').map(str => str.trim())
            .filter(str => str[0] !== '<' && str[0] !== '/' && str.length > 0 && !str.includes('('))
            .map(str => str.replace('</a', '').replace('</small', '').replace('<small', '').replace('✝ ', ''))
            .filter(str => !str.includes('<small'))
          newVal = newVal.map(str => {
            if(str.includes('<a href')) return
            else return str
          })
          acc[label] = genFinalValue(label, newVal.filter(s => s))
        }
      }
      else if(value.includes(')') && label !== 'height') {
        let newVal = value.split(')').map(s => s.length > 0 ? (s + ')').trim() : undefined).filter(s => s && s !== ')')
        if(label === 'residence') {
          newVal = newVal.map(s => s.replace(': ', '').trim())
        }
        newVal = removeSymbol(newVal)
        acc[label] = genFinalValue(label, value)
      }
      else {
        acc[label] = genFinalValue(label, value)
      }
      return acc;
    }, obj);
  }
  else undefined
};

module.exports = {
  reformatData,
  getDataToFormat
}

// Name: Nicole - otherRelations needs to be split
// Eleven otherRelations: cross

