const path = require('path');
const fs = require('fs');
const { app } = require('electron');

let db = null;
let dbPath = '';

async function initialize() {
  try {
    const initSqlJs = require('sql.js');
    dbPath = path.join(app.getPath('userData'), 'unicare.db');
    console.log('Database path:', dbPath);

    const SQL = await initSqlJs();

    // Load existing database or create new one
    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
      console.log('Loaded existing database');
    } else {
      db = new SQL.Database();
      console.log('Created new database');
    }

    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');

    // Run schema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      db.exec(schema);
      console.log('Database schema applied successfully');
    } else {
      console.warn('Schema file not found at:', schemaPath);
    }

    // Save to disk
    saveDatabase();

    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return createMockDatabase();
  }
}

function saveDatabase() {
  if (!db || !dbPath) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (e) {
    console.error('Failed to save database:', e);
  }
}

function createMockDatabase() {
  // In-memory mock for when sql.js is not available
  return {
    run: () => {},
    exec: () => [],
    getDatabase: () => null,
    _isMock: true,
  };
}

function getDatabase() {
  return db;
}

module.exports = { initialize, getDatabase, saveDatabase };
