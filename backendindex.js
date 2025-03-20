// Backend con gestión de stock, clientes con deudas y reportes en Excel
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const excelJS = require('exceljs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./tienda.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

const crearTablas = () => {
    db.run(`CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        precio REAL,
        stock INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        producto_id INTEGER,
        cantidad INTEGER,
        total REAL,
        fecha TEXT,
        FOREIGN KEY (producto_id) REFERENCES productos (id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        rol TEXT
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        deuda REAL
    )`);
};

crearTablas();

app.post('/productos', (req, res) => {
    const { nombre, precio, stock } = req.body;
    db.run(`INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)`, [nombre, precio, stock], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: this.lastID, nombre, precio, stock });
        }
    });
});

app.get('/productos', (req, res) => {
    db.all(`SELECT * FROM productos`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.post('/ventas', (req, res) => {
    const { producto_id, cantidad, total } = req.body;
    const fecha = new Date().toISOString();
    
    db.run(`INSERT INTO ventas (producto_id, cantidad, total, fecha) VALUES (?, ?, ?, ?)`,
        [producto_id, cantidad, total, fecha], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            db.run(`UPDATE productos SET stock = stock - ? WHERE id = ?`, [cantidad, producto_id], (err) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.json({ id: this.lastID, producto_id, cantidad, total, fecha });
                }
            });
        }
    });
});

app.post('/clientes', (req, res) => {
    const { nombre, deuda } = req.body;
    db.run(`INSERT INTO clientes (nombre, deuda) VALUES (?, ?)`, [nombre, deuda], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: this.lastID, nombre, deuda });
        }
    });
});

app.get('/clientes/deudores', (req, res) => {
    db.all(`SELECT * FROM clientes WHERE deuda > 0`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.get('/reportes/ventas', async (req, res) => {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Ventas');

    worksheet.columns = [
        { header: 'ID Venta', key: 'id', width: 10 },
        { header: 'ID Producto', key: 'producto_id', width: 10 },
        { header: 'Cantidad', key: 'cantidad', width: 10 },
        { header: 'Total', key: 'total', width: 15 },
        { header: 'Fecha', key: 'fecha', width: 20 }
    ];

    db.all(`SELECT * FROM ventas`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            worksheet.addRows(rows);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=reportes_ventas.xlsx');
            workbook.xlsx.write(res).then(() => res.end());
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
