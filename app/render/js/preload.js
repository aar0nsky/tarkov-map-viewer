const fs = require("fs")
const path = require("path")
const shell = require("electron").shell
const { ipcRenderer } = require("electron")
const CONFIG_PATH = ipcRenderer.sendSync("configPath")

window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ["chrome", "node", "electron"]) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }

    replaceText("app-version", process.env.npm_package_version)

    document.getElementById("searchButton").addEventListener("click", () => {
        let searchTerm = document.getElementById("searchInput")
        let searchWindow = window.open(
            `https://escapefromtarkov.fandom.com/wiki/Special:Search?query=${searchTerm.value}&scope=internal&navigationSearch=true`,
            "_blank",
            "height=1080,width=1920"
        )
        return false
    })

    document.getElementById("editConfig").addEventListener("click", () => {
        shell.openPath(path.resolve(CONFIG_PATH))
    })
    var config

    if (fs.existsSync(CONFIG_PATH)) {
        config = require(CONFIG_PATH)
    } else {
        config = {}
    }

    var filenames = new Array()
    config.maps = config.maps
        ? config.maps
        : [
              "customs",
              "factory",
              "interchange",
              "lighthouse",
              "shoreline",
              "reserve",
              "woods",
              "labs"
          ]
    config.extensions = ["png", "jpg", "bmp", "gif"]

    Object.entries(config.maps).forEach(([key, value]) => {
        const mapGrid = document.getElementById("thumbs")

        Object.entries(config.extensions).forEach(([key, ext]) => {
            let filename = path.resolve(
                path.resolve(__dirname, "../assets", `${value}.${ext}`)
            )

            try {
                if (fs.existsSync(filename)) {
                    console.log(`Found: ${filename}`)
                    filenames.push(`${value}.${ext}`)
                    mapGrid.innerHTML =
                        mapGrid.innerHTML +
                        `<div class="mdl-cell mdl-cell--2-col" id="${value}"><a target="_blank"><h6>${value}</h6>
                <img src="${filename}" height="100px" width="100px" /></a></div>`
                }
            } catch (err) {
                console.error(`File does not exist ${filename}`)
                console.error(err)
            }
        })
    })

    Object.entries(filenames).forEach(([key, value]) => {
        let id = value.split(".")
        document.getElementById(id[0]).addEventListener("click", () => {
            let filepath = path.resolve(
                path.join(__dirname, "../assets", `${value}`)
            )
            let mapWindow = window.open(
                filepath,
                "_blank",
                "height=1080,width=1920,resizable=0"
            )
        })
    })
})
