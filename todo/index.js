const electron = require('electron');

const {app, BrowserWindow , ipcMain,Menu} = electron;

let mainWindow;
let addWindow;

app.on('ready',()=>{
 mainWindow = new BrowserWindow({});
mainWindow.loadURL(`file://${__dirname}/main.html`);
mainWindow.on('closed',()=> app.quit());

const mainMenu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(mainMenu);
});

function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add new Todo'
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on('closed',()=>addWindow=null);
}

ipcMain.on('todoadd',(event,todo)=>{
    mainWindow.webContents.send('todoadd',todo);
    addWindow.close();
});
const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {label: 'New Todo', click(){ createAddWindow();}},
           
            {
                label: 'Clear Todos',
                click() {
                  mainWindow.webContents.send('todo:clear');
                }
              },
              {
                label: 'Quit',
                accelerator: (()=>{
                    if(process.platform=== 'darwin'){
                        return 'Command+Q';
                    }
                    else{
                        return 'Ctrl+Q';
                    }
                })(),
                click(){
                    app.quit();
                }
            }
        ]
    }
];

if(process.platform==='darwin'){
    menuTemplate.unshift({});
}
if (process.env.NODE_ENV !== 'production'){
    menuTemplate.push({
        label: 'View',
        submenu: [
            {role: 'reload'},
            {
                label: 'Toggle Dev Tools',
                accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
                click(item,focussedwindow){
                    focussedwindow.toggleDevTools();
                }
            }
        ]
    });
}

