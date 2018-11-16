var electron = require('electron');

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

process.env.KEY = 'ABC';
process.env.NODE_ENV = 'production';
process.env.PORT = 1337;
process.env.TARGET = 'electron';
process.env.DEBUG = '*';
process.env.DB = app.getPath('appData') + '/Lumi/db/pouchdb';

const isDevelopment = process.env.NODE_ENV !== 'production';
let mainWindow;
let server;

function createMainWindow() {
    const window = new BrowserWindow();

    if (isDevelopment) {
        window.webContents.openDevTools();
    }

    if (isDevelopment) {
        window.loadURL(`http://localhost:8080`);
    } else {
        window.loadURL('http://localhost:1337');
    }

    window.on('closed', () => {
        mainWindow = null;
    });

    window.webContents.on('devtools-opened', () => {
        window.focus();
        setImmediate(() => {
            window.focus();
        });
    });

    return window;
}

// quit application when all windows are closed
app.on('window-all-closed', function() {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow();
    }
});

// create main BrowserWindow when electron is ready
app.on('ready', function() {
    server = require(__dirname + '/server/boot.js');

    server.boot(function() {
        mainWindow = createMainWindow();
    });
});
