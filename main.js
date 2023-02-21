const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 660,
        height: 410,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('index.html');

    // Open the DevTools in development mode
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    createWindow();

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

// Listen for the get-video-file event from the renderer process
ipcMain.on('get-video-file', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            {
                name: 'Videos',
                extensions: ['mp4', 'avi', 'mkv', 'mov', 'wmv'],
            },
        ],
    });

    if (!result.canceled) {
        const filePath = result.filePaths[0];
        const fileStats = await fs.promises.stat(filePath);

        // Check that the selected file is less than 1GB in size
        if (fileStats.size > 1_000_000_000_000) {
            dialog.showErrorBox(
                'File too large',
                'The selected file is too large to play. Please select a file less than 1GB in size.'
            );
            return;
        }

        // Send the video file path to the renderer process
        mainWindow.webContents.send('video-file', filePath);
    }
});
