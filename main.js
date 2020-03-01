const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path');
const fs = require('fs');
// require('electron-reload')(__dirname);

let mainWindow;
let addWindow;
let overviewWindow;
let initObj = [];

const parseTeamsFromFile = () => {
    const files = fs.readdirSync('./');
    if(files.indexOf('teams.json') !== -1){
        initObj = JSON.parse(fs.readFileSync('./teams.json', {encoding:'utf-8'}).toString())
    }
};

const saveTeams = (teamsObj) => {
    initObj = teamsObj;
    fs.writeFileSync('./teams.json', JSON.stringify(teamsObj, null, 4),{flag:'w'})
};

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    });
    mainWindow.maximize();

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('window-all-closed', function () {

    if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
    if (mainWindow === null) createWindow()
});


app.on('ready', () => {
    createWindow();
    parseTeamsFromFile();
    mainWindow.loadFile('./front/index.html');
    const mainM = Menu.buildFromTemplate([]);
    Menu.setApplicationMenu(mainM);
    mainWindow.on('closed', () => app.quit());
});

const createAddWindow = () => {
    addWindow = new BrowserWindow({
        width: 1280,
        height: 768,
        title: 'Добавление команд',
        webPreferences: {
            nodeIntegration: true
        }
    });
    addWindow.loadFile('./front/add.html');
    addWindow.on('close', () => {
        addWindow = null;
    });
    mainWindow.maximize();
};

const createOverviewWindow = (data) => {
    overviewWindow = new BrowserWindow({
        width: 1280,
        height: 768,
        title: 'Общий подсчет',
        webPreferences: {
            nodeIntegration: true
        }

    });
    overviewWindow.maximize();
    overviewWindow.loadFile('./front/overview.html');

    overviewWindow.on('close', () => {
        overviewWindow = null;
    })

};

ipcMain.on('retrieve', e => {
    e.reply('data', initObj);
});

ipcMain.on('store', (e, obj) => {
    saveTeams(obj);
    e.reply('saved', 'ok');
});

ipcMain.on('onModalClose', (e, data) => {
    mainWindow.webContents.send('onDataFromModal', data);
});

ipcMain.on('overviewModal', (data) => createOverviewWindow(data));

ipcMain.on('addTeamsModal', () => createAddWindow());

const mainMenuT = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add item',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear items',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q ' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'DevTools',
        click(item, focusedWindow) {
            focusedWindow.toggleDevTools()
        },
        accelerator: process.platform === 'darwin' ? 'Command+I ' : 'Ctrl+I'
    },
    {
        role: 'reload'
    }
];