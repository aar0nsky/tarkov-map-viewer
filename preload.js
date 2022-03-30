const config = require('./config.json')
const fs = require('fs')
const path = require('path')

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }

    document.getElementById('searchButton').addEventListener('click', () => {
      let searchTerm = document.getElementById('searchInput').value
      window.open(`https://escapefromtarkov.fandom.com/wiki/Special:Search?query=${searchTerm}&scope=internal&navigationSearch=true`, '_blank', 'height=1080,width=1920')
      return false
    })
    


    var filenames = new Array()
    
    
    Object.entries(config.maps).forEach(([key,value]) => {
      const mapGrid = document.getElementById('thumbs');
      
        Object.entries(config.extensions).forEach(([key,ext]) => {
          let filename = path.join('images', `${value}.${ext}`)
          
          try {
            if (fs.existsSync(filename)) {
              console.log(`Found: ${filename}`)
              filenames.push(`${value}.${ext}`)
              mapGrid.innerHTML = mapGrid.innerHTML + `<div class="mdl-cell mdl-cell--2-col" id="${value}"><a target="_blank"><h6>${value}</h6>
              <img src="${filename}" height="100px" width="100px" /></a></div>`
            }

          } catch(err) {
            console.error(`File does not exist ${filename}`)
            console.error(err)
          }
        })
      })
      console.log(filenames.toString())
      Object.entries(filenames).forEach(([key,value]) => {
        let id = value.split(".")
        document.getElementById(id[0]).addEventListener('click', () => {
          window.open(path.join('images', value), '_blank', 'popup,height=1080,width=1920,resizable=0')
          })
      }
      )
    })

    