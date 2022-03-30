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
    
    document.getElementById('customs').addEventListener('click', () => {
      const customsWin = window.open(`customs.html`, '_blank', 'popup,height=1080,width=1920,resizable=0')
      return false
    })
  

  })
