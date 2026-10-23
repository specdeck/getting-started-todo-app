const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION || '/etc/todos/todo.db';

let db;

function toItem(row) {
    return Object.assign({}, row, {
        completed: row.completed === 1,
    });
}

async function init() {
    const dirName = require('path').dirname(location);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }

    db = new DatabaseSync(location);

    if (process.env.NODE_ENV !== 'test')
        console.log(`Using sqlite database at ${location}`);

    db.exec(
        'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean)',
    );
}

async function teardown() {
    db.close();
}

async function getItems() {
    return db.prepare('SELECT * FROM todo_items').all().map(toItem);
}

async function getItem(id) {
    const row = db.prepare('SELECT * FROM todo_items WHERE id=?').get(id);
    return row && toItem(row);
}

async function storeItem(item) {
    db.prepare(
        'INSERT INTO todo_items (id, name, completed) VALUES (?, ?, ?)',
    ).run(item.id, item.name ?? null, item.completed ? 1 : 0);
}

async function updateItem(id, item) {
    db.prepare('UPDATE todo_items SET name=?, completed=? WHERE id = ?').run(
        item.name ?? null,
        item.completed ? 1 : 0,
        id,
    );
}

async function removeItem(id) {
    db.prepare('DELETE FROM todo_items WHERE id = ?').run(id);
}

module.exports = {
    init,
    teardown,
    getItems,
    getItem,
    storeItem,
    updateItem,
    removeItem,
};
