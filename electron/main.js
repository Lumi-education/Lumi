var electron = require('electron');
var cp = require('child_process');
var sudo = require('sudo-prompt');
var machineId = require('node-machine-id').machineId;

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

// process.env.KEY = 'ABC';
// process.env.NODE_ENV = process.env.NODE_ENV || 'production';
// process.env.PORT = 80;
// process.env.TARGET = 'electron';
// process.env.DEBUG = '*';
// process.env.DB = app.getPath('appData') + '/Lumi/db/pouchdb';
// process.env.DATA_DIR = app.getPath('appData') + '/Lumi/data';

const PORT = 80;

const isDevelopment = process.env.NODE_ENV !== 'production';
let mainWindow;
let server;

var options = {
    name: 'Lumi'
};

function createMainWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 600
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
        var server = cp.fork(__dirname + '/server/boot.js', {
            env: {
                PORT: PORT,
                TARGET: 'electron',
                DEBUG: 'lumi:*',
                DB: app.getPath('appData') + '/Lumi/db/pouchdb',
                DATA_DIR: app.getPath('appData') + '/Lumi/data',
                KEY: id,
                NODE_ENV: process.env.NODE_ENV || 'production'
            }
        });

        server.on('message', message => {
            console.log('message', message);
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
    //     mainWindow = createMainWindow();
    // });
});
