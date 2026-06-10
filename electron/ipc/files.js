const { dialog, app } = require('electron');
const path = require('path');
const fs = require('fs');

function setupFileIPC(ipcMain) {
  const reportsDir = path.join(app.getPath('userData'), 'reports');

  // Ensure reports directory exists
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  ipcMain.handle('files:getReportsDir', () => {
    return reportsDir;
  });

  ipcMain.handle('files:saveReport', async (event, fileName, data) => {
    try {
      const filePath = path.join(reportsDir, fileName);
      const buffer = Buffer.from(data, 'base64');
      fs.writeFileSync(filePath, buffer);
      return { success: true, filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('files:readReport', async (event, filePath) => {
    try {
      if (!fs.existsSync(filePath)) {
        return { success: false, error: 'File not found' };
      }
      const data = fs.readFileSync(filePath);
      return { success: true, data: data.toString('base64') };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('files:openFile', async () => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          { name: 'Documents', extensions: ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'bmp'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, error: 'No file selected' };
      }

      const selectedPath = result.filePaths[0];
      const fileName = path.basename(selectedPath);
      const ext = path.extname(selectedPath).toLowerCase();

      // Copy to reports directory
      const destPath = path.join(reportsDir, `${Date.now()}_${fileName}`);
      fs.copyFileSync(selectedPath, destPath);

      const data = fs.readFileSync(destPath);

      return {
        success: true,
        filePath: destPath,
        fileName,
        fileType: ext.replace('.', ''),
        data: data.toString('base64'),
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('files:exportData', async (event, data, defaultFileName) => {
    try {
      const result = await dialog.showSaveDialog({
        defaultPath: defaultFileName,
        filters: [
          { name: 'CSV', extensions: ['csv'] },
          { name: 'JSON', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      });

      if (result.canceled) {
        return { success: false, error: 'Export cancelled' };
      }

      fs.writeFileSync(result.filePath, data, 'utf8');
      return { success: true, filePath: result.filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}

module.exports = { setupFileIPC };
