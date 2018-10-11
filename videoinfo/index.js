const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');

const {app, BrowserWindow , ipcMain} = electron;

let mainWindow;

app.on('ready',()=>{
 mainWindow = new BrowserWindow({});
mainWindow.loadURL(`file://${__dirname}/index.html`)
});

ipcMain.on('videosubmitted',(event,path)=>{
    ffmpeg.ffprobe(path,(err,meta)=>{
        mainWindow.webContents.send('videodata',meta.format.duration);
    });
});