const { app, BrowserWindow, globalShortcut, protocol } = require('electron')
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
  globalShortcut.register('Escape', () => {
    let curWindow = BrowserWindow.getFocusedWindow();
    if(null !== curWindow){
      //BrowserWindow.getFocusedWindow().getPosition() // TODO: print to config.json
      // var bounds = { 'mainWindow' : curWindow.getBounds()}
      // if(undefined !== curWindow.getParentWindow()){
      //    bounds = { 'childWindow' : curWindow.getBounds()}
      // }
      // curWindow = BrowserWindow.getFocusedWindow()
      // console.log(curWindow.getBounds())
      
      // console.log(JSON.stringify(config))
      // config = {...bounds}
      // console.log(JSON.stringify(config))
      // fs.writeFile('config.json', JSON.stringify(config), 'utf8', (err) => {
      //   if(err) return console.log(err);
      // })
      
      curWindow.close()
      
    }
    console.log('Escape is pressed') 
  })
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