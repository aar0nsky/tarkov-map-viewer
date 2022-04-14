const {
  app,
  BrowserWindow,
  globalShortcut,
  protocol,
  Menu,
  MenuItem,
  screen,
  webContents,
  shell
} = require("electron")
const defaultMenu = require("electron-default-menu")
const path = require("path")
var fs = require("fs")
try {
  require("electron-reloader")(module)
} catch (_) {}

const initConfig = require("./config.json")
var runningConfig = initConfig
  ? initConfig
  : {
      mainWindow: { width: 800, height: 600 },
      maps: [
        "customs",
        "factory",
        "interchange",
        "lighthouse",
        "shoreline",
        "reserve",
        "woods",
        "labs"
      ]
    }

var mainWindow
var props = {
  title: "Tarkov Multi Tool",
  autoHideMenuBar: false,
  webPreferences: {
    nodeIntegration: true,
    preload: path.join(__dirname, "preload.js"),
    contextIsolation: false,
    nativeWindowOpen: true,
    webSecurity: false
  }
}
const loadConfig = (exports.loadConfig = () => {
  if (undefined === runningConfig.mainWindow) {
    runningConfig.mainWindow.width = 800
    runningConfig.mainWindow.height = 600
    runningConfig.mainWindow.x = 960
    runningConfig.mainWindow.y = 540
    
    fs.writeFile("config.json", JSON.stringify(runningConfig), "utf8", err => {
      if (err) return console.log(err)
    })
  }
    props = {...props, ...runningConfig.mainWindow}
})

const createWindow = (exports.createWindow = () => {

  loadConfig()

  const switchWindows = () => {
    let windows = mainWindow.getChildWindows()
    windows[0].show()
  }



  let mainWindow = new BrowserWindow(props)
  
  mainWindow.loadFile("index.html")
  mainWindow.show()

  mainWindow.webContents.setWindowOpenHandler(() => {
    // Get External display object
    let displays = screen.getAllDisplays()
    let externalDisplay = displays.find(display => {
      return display.bounds.x !== 0 || display.bounds.y !== 0
    })

    // Returns the screen where your window is located
    let winBounds = mainWindow.getBounds()
    let windowScreen = screen.getDisplayNearestPoint({
      x: winBounds.x,
      y: winBounds.y
    })

    if (windowScreen.id !== externalDisplay.id) {
      return {
        action: "allow"
      }
    } else {
      return {
        action: "allow",
        overrideBrowserWindowOptions: {
          x: externalDisplay.bounds.x,
          y: externalDisplay.bounds.y,
          autoHideMenuBar: true
        }
      }
    }
  })

  mainWindow.on("close", () => {
    let configPath = path.join(__dirname, "config.json")
    try {
      runningConfig.mainWindow = mainWindow.getBounds()
      fs.writeFileSync(configPath, JSON.stringify(runningConfig, null, 4))
    } catch (e) {
      console.log("cannot write to config.json")
      console.log(e)
    }
  })

  // grab default menu and add my custom menu item/shortcut
  const menu = defaultMenu(app, shell)

  menu.splice(
    4,
    0,
    new MenuItem({
      label: "Shortcuts",
      submenu: [
        {
          role: "Close",
          accelerator: "Esc",
          click: () => {
            let curWindow = BrowserWindow.getFocusedWindow()
            if (null !== curWindow && curWindow !== mainWindow) {
              curWindow.close()
            }
            else if(curWindow === mainWindow) {
              app.quit()
            }
          }
        }
      ]
    })
  )

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
})

app.whenReady().then(() => {
  protocol.registerFileProtocol("file", (request, callback) => {
    const pathname = decodeURI(request.url.replace("file:///", ""))
    callback(pathname)
  })
  createWindow()
         // Register a 'CommandOrControl+X' shortcut listener.
        globalShortcut.register('m', () => {
        switchWindows()
        })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})
