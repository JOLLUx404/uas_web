const database = require('better-sqlite3');
const db = new database('database.db');

module.exports = db;