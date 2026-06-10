const { saveDatabase } = require('../database');

function setupDatabaseIPC(ipcMain, db) {
  // Helper to convert sql.js results to simple objects
  function resultToObjects(result) {
    if (!result || result.length === 0) return [];
    const { columns, values } = result[0];
    return values.map(row => {
      const obj = {};
      columns.forEach((col, i) => { obj[col] = row[i]; });
      return obj;
    });
  }

  ipcMain.handle('db:run', (event, sql, params = []) => {
    try {
      db.run(sql, Array.isArray(params) ? params : [params]);
      // Get last insert rowid
      const lastId = db.exec('SELECT last_insert_rowid() as id');
      const changes = db.getRowsModified();
      saveDatabase();
      return {
        success: true,
        changes,
        lastInsertRowid: lastId.length > 0 ? lastId[0].values[0][0] : 0,
      };
    } catch (error) {
      console.error('DB run error:', error.message);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('db:get', (event, sql, params = []) => {
    try {
      const result = db.exec(sql, Array.isArray(params) ? params : [params]);
      const rows = resultToObjects(result);
      return { success: true, data: rows.length > 0 ? rows[0] : null };
    } catch (error) {
      console.error('DB get error:', error.message);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('db:all', (event, sql, params = []) => {
    try {
      const result = db.exec(sql, Array.isArray(params) ? params : [params]);
      const rows = resultToObjects(result);
      return { success: true, data: rows };
    } catch (error) {
      console.error('DB all error:', error.message);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('db:exec', (event, sql) => {
    try {
      db.exec(sql);
      saveDatabase();
      return { success: true };
    } catch (error) {
      console.error('DB exec error:', error.message);
      return { success: false, error: error.message };
    }
  });
}

module.exports = { setupDatabaseIPC };
