const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')
var fs = require("fs");
const { exit } = require('process');
const { ChildProcess } = require('child_process');
const config = require('./config.json')
try {
  require('electron-reloader')(module)
} catch (_) {}

app.whenReady().then(() => {
  var initPath = path.join(__dirname, "init.json");
  var data;
  try {
    //data = JSON.parse(fs.readFileSync(initPath, 'utf8'));
    
  }
  catch(e) {
    console.log("cannot read init.json", e)
    exit(1)
  }

  createWindow()
  globalShortcut.register('Escape', () => {
    if(null !== BrowserWindow.getFocusedWindow()){
      BrowserWindow.getFocusedWindow().close()
    }
    console.log('Escape is pressed')
  })
})



const createWindow = () => {
  // let bounds = (data && data.bounds) ? data.bounds : {width: 800, height: 600}
  // let props = { 
  //   ...bounds,     
  //   webPreferences: {
  //   preload: path.join(__dirname, 'preload.js')
  // }}
  let props = {
    width: config.width ? config.width : 800, 
    height: config.height ? config.height : 600,
    title: "Tarkov Map Viewer",
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false
    }
  }
  console.log(props)

  let win = new BrowserWindow(props)

  // let child = new BrowserWindow({parent:win})
  // child.loadFile('customs.html')
  // child.show()
  win.loadFile('src/index.html')
}



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