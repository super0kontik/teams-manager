const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')

let mainWindow;
let addWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true
    }
  });

  mainWindow.on('closed', function () { mainWindow = null })
}

app.on('window-all-closed', function () {

    if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
    if (mainWindow === null) createWindow()
});

app.on('ready', ()=>{
    createWindow();
    mainWindow.loadFile('./front/index.html');
    const mainM = Menu.buildFromTemplate(mainMenuT);
    Menu.setApplicationMenu(mainM);
    mainWindow.on('closed',()=>app.quit());
});

const createAddWindow = () =>{
    addWindow = new BrowserWindow({
        width: 400,
        height: 300,
        title: 'Add item',
        webPreferences: {
            nodeIntegration: true
        }
    });
    addWindow.loadFile('./add.html');
    addWindow.on('close',()=>{
        addWindow = null;
    })

};

ipcMain.on('item:add',(e,item)=>{
    mainWindow.webContents.send('item:add',item);
});

const mainMenuT = [
    {
      label:'File',
        submenu:[
                {
                    label:'Add item',
                    click(){
                        createAddWindow();
                    }
                },
                {
                    label:'Clear items',
                    click(){
                        mainWindow.webContents.send('item:clear');
                    }
                },
                {
                    label:'Quit',
                    accelerator: process.platform === 'darwin'?'Command+Q ':'Ctrl+Q',
                    click(){
                        app.quit();
                    }
                }
            ]
    },
    {
        label:'DevTools',
        click(item,focusedWindow){
            focusedWindow.toggleDevTools()
        },
        accelerator: process.platform === 'darwin'?'Command+I ':'Ctrl+I'
    },
    {
        role:'reload'
    }
];