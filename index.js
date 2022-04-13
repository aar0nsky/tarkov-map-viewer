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
// const { exit } = require('process')
try {
  require("electron-reloader")(module)
} catch (_) {}


var mainWindow

var config = require("./config.json")

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

if (undefined === config.mainWindow) {
  let config = { mainWindow: {} }
  config.mainWindow.width, (props.width = 800)
  config.mainWindow.height, (props.height = 600)
  fs.writeFile("config.json", JSON.stringify(config), "utf8", err => {
    if (err) return console.log(err)
  })
} else {
  props.width = config.mainWindow.width
  props.height = config.mainWindow.height
}



const createWindow = () => {
  mainWindow = new BrowserWindow(props)

  // const onWindowOpen = (event, url, frameName) => {
  //   event.preventDefault()
  //   const win = new BrowserWindow({
  //     show: false,
  //     frame: false,
  //     resizable: false,
  //     title: frameName
  //   })
  mainWindow.loadFile("index.html")
  // mainWindow.webContents.on('new-window', onWindowOpen)
  // event.newGuest = win

  // open windows on other display

  let displays = screen.getAllDisplays()
  let externalDisplay = displays.find(display => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })
  mainWindow.webContents.setWindowOpenHandler(() => {
    if (externalDisplay) {
      return new BrowserWindow({
        x: externalDisplay.bounds.x + 50,
        y: externalDisplay.bounds.y + 50
      })
    }
  })

  const menu = defaultMenu(app, shell)
  // menu.splice(4, 0, {
  //   label: "Custom",
  //   submenu: [
  //     {
  //       label: "Close",
  //       accelerator: "Esc",
  //       click: () => {
  //         let curWindow = BrowserWindow.getFocusedWindow()
  //         if (null !== curWindow) {
  //           curWindow.close()
  //         }
  //       }
  //     },
  //     {
  //       label: "Map",
  //       accelerator: "m",
  //       click: () => {
  //         return
  //       }
  //     }
  //   ]
  // })

  menu.splice(5,0,new MenuItem({
    label: 'Shortcuts',
    submenu: [{
      role: 'Close',
      accelerator: 'Esc',
      click: () => {
        let curWindow = BrowserWindow.getFocusedWindow();
        if(null !== curWindow){
          curWindow.close()
        }
    }
  }]
  }))

  // menu.append(new MenuItem({
  //   label: 'Custom',
  //   submenu: [{
  //     role: 'Close',
  //     accelerator: 'Esc',
  //     click: () => {
  //       let curWindow = BrowserWindow.getFocusedWindow();
  //       if(null !== curWindow){
  //         curWindow.close()
  //       }
  //   }
  // }]
  // }))

  // Menu.setApplicationMenu(menu)
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
}

app.whenReady().then(() => {
  protocol.registerFileProtocol("file", (request, callback) => {
    const pathname = decodeURI(request.url.replace("file:///", ""))
    callback(pathname)
  })

  var configPath = path.join(__dirname, "config.json")
  // try {
  //   config = //JSON.parse(fs.readFileSync(configPath, 'utf8'));
  //   require('config.js')

  // }
  // catch(e) {
  //   console.log("cannot read config.json", e)
  //   exit(1)
  // }
  createWindow()
  mainWindow.on("close", () => {
    var data = {
      bounds: mainWindow.getBounds()
    }
    try {
      fs.writeFileSync(initPath, JSON.stringify(data))
    } catch (e) {
      console.log("cannot write to init.json")
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})
