const {
    app,
    BrowserWindow,
    Menu,
    MenuItem,
    screen,
    webContents,
    protocol,
    shell
} = require("electron")
const defaultMenu = require("electron-default-menu")
const path = require("path")
const fs = require("fs")
// ad blocking
const { ElectronBlocker, fullLists } = require("@cliqz/adblocker-electron")
const fetch = require("cross-fetch")
try {
    require("electron-reloader")(module)
} catch (_) {}

const CONFIG_PATH = app.isPackaged
    ? path.join(process.resourcesPath, "config.json")
    : path.join(app.getAppPath(), "config.json")

const { ipcMain } = require("electron")

ipcMain.on("configPath", (event) => {
    event.returnValue = CONFIG_PATH
})
ipcMain.on("getAppVersion", (event) => {
    event.returnValue = app.getVersion()
})
const initConfig = require(CONFIG_PATH)
if (initConfig) {
    console.log(JSON.stringify(initConfig))
}
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

var props = {
    title: "Tarkov Multi Tool",
    autoHideMenuBar: false,
    webPreferences: {
        nodeIntegration: true,
        preload: path.resolve(__dirname, path.join("render/js", "preload.js")),
        contextIsolation: false,
        nativeWindowOpen: true,
        webSecurity: false
    }
}
const loadConfig = (exports.loadConfig = () => {
    if (typeof runningConfig.mainWindow === "undefined") {
        runningConfig.mainWindow.width = 800
        runningConfig.mainWindow.height = 600
        runningConfig.mainWindow.x = 0
        runningConfig.mainWindow.y = 0

        fs.writeFile(
            path.join(CONFIG_PATH),
            JSON.stringify(runningConfig),
            "utf8",
            (err) => {
                if (err) return console.log(err)
            }
        )
    }
    props = { ...props, ...runningConfig.mainWindow }
})

const createWindow = (exports.createWindow = async () => {
    loadConfig()

    let mainWindow = new BrowserWindow(props)
    // ad blocking
    const blocker = await ElectronBlocker.fromLists(fetch, fullLists, {
        enableCompression: true
    })
    blocker.enableBlockingInSession(mainWindow.webContents.session)
    //-
    mainWindow.loadFile(path.resolve(__dirname, "render/html/index.html"))
    mainWindow.show()

    mainWindow.webContents.setWindowOpenHandler(() => {
        // Get External display object
        let displays = screen.getAllDisplays()
        let externalDisplay = displays.find((display) => {
            return display.bounds.x !== 0 || display.bounds.y !== 0
        })

        // Returns the screen where your window is located
        let winBounds = mainWindow.getBounds()
        let windowScreen = screen.getDisplayNearestPoint({
            x: winBounds.x,
            y: winBounds.y
        })

        let options = {
            action: "allow",
            parent: mainWindow,
            overrideBrowserWindowOptions: {
                x: 0,
                y: 0,
                autoHideMenuBar: true
            }
        }

        if (windowScreen.id === externalDisplay.id) {
            options.overrideBrowserWindowOptions.x = externalDisplay.bounds.x
            options.overrideBrowserWindowOptions.y = externalDisplay.bounds.y
        }

        return options
    })

    mainWindow.on("close", () => {
        try {
            runningConfig.mainWindow = mainWindow.getBounds()
            fs.writeFileSync(
                CONFIG_PATH,
                JSON.stringify(runningConfig, null, 4)
            )
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
                        } else if (curWindow === mainWindow) {
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
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
})

app.setAppUserModelId("Tarkov Map Viewer")
