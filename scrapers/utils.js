const lodash = require('lodash');

const cleanUp = str => str.replace(':', '').trim();
const removeSymbol = arr => arr.map(str => str && (str.includes('†') ? str.replace('†', '').trim() : str.trim()))
const removeHtmlTags = str => (
  str.replace('<small>', '')
    .replace('</small>', '')
    .replace('<p>', '')
    .replace('</p>', '')
    .replace('<br />', '')
    .replace('<br>', '')
);
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

      // label === 'residence' ? console.log({ value, htmlVal }) : null

      if(label === 'appearsInEpisodes') {
        let newVal = value.trim().split(' ').map(s => s.replace(',', ''))
        acc[label] = genFinalValue(label, newVal)
      }
      else if(htmlVal.includes('<a href') && htmlVal.includes('<p>') && !htmlVal.includes('<br')) {
        let newVal = value.split(')').filter(s => s).map(s => s.includes('(') ? s + ')' : s)
        acc[label] = genFinalValue(label, newVal)
      }
      else if(htmlVal.includes('<br')) {
        if(label === 'affiliation') {
          let newVal = htmlVal.split('>').map(str => str.trim())
            .filter(str => str[0] !== '<' && str[0] !== '/' && str.length > 0 && !str.includes('(formerly)'))
            .map(str => str.replace('</a', '').replace('</small', ''))
          newVal = newVal.map(str => {
            if(str.includes('<a href')) return
            else return removeHtmlTags(str)
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
            else return removeHtmlTags(str)
          })
          newVal = removeSymbol(newVal).filter(s => s)
          acc[label] = genFinalValue(label, newVal)
        }
      }
      else if(value.includes(')') && label !== 'height') {
        let newVal = value.split(')').map(s => s.length > 0 ? (s + ')').trim() : undefined).filter(s => s && s !== ')')
        if(label === 'residence') {
          if(htmlVal.includes('<li>')) {
            newVal = value.split(')').map(s => s.includes('(') ? cleanUp(s) + ')' : cleanUp(s)).filter(s => s)
            acc[label] = newVal
          } else {
            newVal = newVal.map(s => cleanUp(s))
            acc[label] = genFinalValue(label, value)
          }
        }
        else {
          newVal = removeSymbol(newVal.map(s => cleanUp(s)))
          acc[label] = genFinalValue(label, value)
        }
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

