const { app, BrowserWindow, Tray, Menu, globalShortcut } = require('electron');
const path = require('path');

let win;
let tray = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
    },
    frame: false,
    alwaysOnTop: true,
    type: 'dialog',
  });

  win.setMenuBarVisibility(false); // hides the menu bar
  win.loadURL('https://chat.openai.com');

  // handle minimize to tray
  win.on('minimize', function (event) {
    event.preventDefault();
    win.hide();
  });

  win.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide();
    }

    return false;
  });
}

app.whenReady().then(() => {
  createWindow();

  tray = new Tray(path.join(__dirname, 'icon.png')); // use your tray icon here
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App', click: function () {
        win.show();
      }
    },
    {
      label: 'Quit', click: function () {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('ChatGPT Wrapper');
  tray.setContextMenu(contextMenu);

  tray.on('click', function () {
    win.isVisible() ? win.hide() : win.show();
  });

    // Register global shortcuts
  globalShortcut.register('Super+Shift+Y', () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
