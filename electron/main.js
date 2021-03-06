var electron = require('electron');
var cp = require('child_process');
var sudo = require('sudo-prompt');
var machineId = require('node-machine-id').machineId;
var autoUpdater = require('electron-updater').autoUpdater;
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

const PORT = 80;
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const isDevelopment = process.env.NODE_ENV !== 'production';
let mainWindow;
let server;

var options = {
    name: 'Lumi'
};

function createMainWindow() {
    const window = new BrowserWindow({
        width: 1000,
        height: 800
        // titleBarStyle: 'hidden'
    });

    if (isDevelopment) {
        window.webContents.openDevTools();
    }

    // if (isDevelopment) {
    //     window.loadURL(`http://localhost:8080`);
    // } else {
    window.loadURL('http://localhost:' + PORT);
    // }

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
    machineId().then(id => {
        console.log('booting server with key ', id);
        autoUpdater.checkForUpdatesAndNotify();
        process.env.KEY = id;
        process.env.PORT = 80;
        process.env.TARGET = 'electron';
        process.env.DEBUG = '*';
        process.env.DB = app.getPath('appData') + '/Lumi/db/';
        process.env.DATA_DIR = app.getPath('appData') + '/Lumi/data';

        // var server = cp.fork(__dirname + '/server/boot.js', {
        //     env: {
        //         PORT: PORT,
        //         TARGET: 'electron',
        //         DEBUG: 'lumi:*',
        //         DB: app.getPath('appData') + '/Lumi/db/pouchdb',
        //         DATA_DIR: app.getPath('appData') + '/Lumi/data',
        //         KEY: id,
        //         NODE_ENV: process.env.NODE_ENV || 'production'
        //     }
        // });

        // server.on('message', message => {
        //     console.log('message', message);
        //     mainWindow = createMainWindow();
        // });

        var server = require(__dirname + '/server/boot.js');

        server.boot(() => {
            mainWindow = createMainWindow();
        });
    });

    // sudo.exec(__dirname + '/server/boot.js', options, function(
    //     error,
    //     stdout,
    //     stderr
    // ) {
    //     if (error) throw error;
    //     console.log('stdout: ' + stdout);

    // });
});
