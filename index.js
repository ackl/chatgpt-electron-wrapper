const { app, BrowserWindow, Tray, Menu, globalShortcut } = require('electron');
const path = require('path');

let win;
let tray = null;

let alwaysOnTop = true;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
    },
    alwaysOnTop,
    type: 'dialog',
  });

  win.setMenuBarVisibility(false); // hides the menu bar
  win.loadURL('https://chatgpt.com');

  // handle minimize to tray
  win.on('minimize', function (event) {
    event.preventDefault();
    win.hide();
  });

  win.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      app.hide();
    }

    return false;
  });
}

app.whenReady().then(() => {
  createWindow();

  tray = new Tray(path.join(__dirname, 'trayicon.png')); // use your tray icon here
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App', click: function () {
        win.show();
      }
    },
    {
      label: 'Toggle always on top', click: function () {
        if (alwaysOnTop) {
          win.setAlwaysOnTop(false, 'screen');
        } else {
          win.setAlwaysOnTop(true, 'screen-saver', 1);
        }

        alwaysOnTop = !alwaysOnTop;
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

    // Register global shortcuts
  globalShortcut.register('Super+Shift+Y', () => {
    if (win.isVisible()) {
      app.hide();
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
  app.quit();
});
