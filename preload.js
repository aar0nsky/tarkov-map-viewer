const config = require('./config.json')
const fs = require('fs')
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
    


    

    Object.entries(config.maps).forEach(([key,value]) => {
      const mapGrid = document.getElementById('thumbs');
      var imageName = (
        Object.entries(config.extensions).forEach(([key,ext]) => {
          let filename = `images\/${value}.${ext}`;
          
          try {
            if (fs.existsSync(filename)) {
              console.log(`Found: ${filename}`)
              mapGrid.innerHTML = mapGrid.innerHTML + `<div class="mdl-cell mdl-cell--1-col">${value}</div>
              <div class="mdl-cell mdl-cell--1-col"><a target="_blank" id="${value}"><img src="../${filename}" height="100px" width="100px" /></a></div>`
            }

          } catch(err) {
            console.error(`File does not exist ${filename}`)
            console.error(err)
          }
        })
      )
      const thisValue = value;
      document.getElementById(thisValue).addEventListener('click', () => {
        window.open(`${thisValue}.html`, '_blank', 'popup,height=1080,width=1920,resizable=0')
        })
      

      })

    })
