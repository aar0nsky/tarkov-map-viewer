const { app, BrowserWindow, globalShortcut, protocol, Menu, MenuItem } = require('electron')
const path = require('path')
var fs = require("fs");
const { exit } = require('process')
try {
  require('electron-reloader')(module)
} catch (_) {}

var config = require("./config.json")

var props = {
  title: "Tarkov Multi Tool",
  autoHideMenuBar: true,
  webPreferences: {
    nodeIntegration: true,
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: false,
    nativeWindowOpen: true,
    webSecurity: false
  }
}

if(undefined === config.mainWindow) {
  props.width = 800
  props.height = 600
}
else {
  props.width = config[mainWindow].width 
  props.height = config[mainWindow].height
}

const createWindow = () => {
  // let bounds = (data && data.bounds) ? data.bounds : {width: 800, height: 600}
  // let props = { 
  //   ...bounds,     
  //   webPreferences: {
  //   preload: path.join(__dirname, 'preload.js')
  // }}
  console.log(props)

  let win = new BrowserWindow(props)


  // let child = new BrowserWindow({parent:win})
  // child.loadFile('customs.html')
  // child.show()
  win.loadFile('index.html')
}

const menu = new Menu()
menu.append(new MenuItem({
  label: 'Electron',
  submenu: [{
    role: 'Close',
    accelerator: process.platform === 'darwin' ? 'Esc' : 'Esc',
    click: () => { 
      let curWindow = BrowserWindow.getFocusedWindow();
      if(null !== curWindow){
        curWindow.close()
      }
  }
}]
}))

Menu.setApplicationMenu(menu)


app.whenReady().then(() => {
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''));
    callback(pathname);
  })

  var configPath = path.join(__dirname, "config.json");
  // try {
  //   config = //JSON.parse(fs.readFileSync(configPath, 'utf8'));
  //   require('config.js')
    
  // }
  // catch(e) {
  //   console.log("cannot read config.json", e)
  //   exit(1)
  // }
  createWindow()
})









app.on('window-all-closed', () => {
  // var data = {
  //   bounds: win.getBounds()
  // };
  // try {
  //   fs.writeFileSync(initPath, JSON.stringify(data));
  // }
  // catch(e) {
  //   console.log("cannot write to init.json")
  // }
  if (process.platform !== 'darwin') app.quit()
})