// the backend server.js
const express = require('express'); // this import express and web framework to build the API
const cors = require('cors'); // import cors, enable Cross-Origin Resource Sharing so frontend can call the API
const path = require('path'); // import path to work with file and folder paths
const { pool } = require('./db/connection');
require('dotenv').config(); // load environment variables from .env file

const app = express(); // create an express app
app.use(cors()); // enable CORS for all routes (allows browser requests from other origins)
app.use(express.json()); // enable JSON body parsing for incoming requests

// Serve frontend
app.use(express.static(path.join(__dirname, '..', 'frontend'))); // serve static files from the frontend folder (HTML/CSS/JS)

// CRUD Invoices 
app.get('/api/invoices', async (req, res) => { // declare an HTTP endpoint (route)
  try { // try/catch for error handling
    const [rows] = await pool.query(` // run SQL query on MySQL connection pool, returns rows
      SELECT i.*, c.full_name, c.document_number
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.client_id
      ORDER BY i.invoice_id DESC
    `);
    res.json(rows); // send JSON response to the client
  } catch (err) { // try catch for error handling
    console.error(err);
    res.status(500).send('Error fetching invoices'); // send an HTTP error status and message
  }
});

app.get('/api/invoices/:id', async (req, res) => { // declare an HTTP endpoint (route)
  try { // try/catch for error handling
    const [rows] = await pool.query(` // run SQL query on MySQL connection pool, returns rows
      SELECT i.*, c.full_name, c.document_number
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.client_id
      WHERE i.invoice_id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).send('Invoice not found'); // send an HTTP error status and message
    res.json(rows[0]); // send JSON response to the client
  } catch (err) { // try/catch for error handling
    console.error(err);
    res.status(500).send('Error fetching invoice'); // send an HTTP error status and message
  }
});

app.post('/api/invoices', async (req, res) => { // declare an HTTP endpoint (route)
  const { invoice_number, client_id, billing_period, billed_amount, paid_amount, status } = req.body;
  try { // try catch for error handling
    const [result] = await pool.query(` // run SQL query on MySQL connection pool, returns rows
      INSERT INTO invoices (invoice_number, client_id, billing_period, billed_amount, paid_amount, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [invoice_number, client_id, billing_period, billed_amount, paid_amount, status]);
    res.status(201).json({ invoice_id: result.insertId });
  } catch (err) { // try catch for error handling
    console.error(err);
    res.status(500).send('Error creating invoice'); // send an HTTP error status and message
  }
});

app.put('/api/invoices/:id', async (req, res) => { // declare an HTTP endpoint (route)
  const { invoice_number, client_id, billing_period, billed_amount, paid_amount, status } = req.body;
  try { // try catch for error handling
    const [result] = await pool.query(` // run SQL query on MySQL connection pool, returns rows
      UPDATE invoices
      SET invoice_number=?, client_id=?, billing_period=?, billed_amount=?, paid_amount=?, status=?
      WHERE invoice_id=?
    `, [invoice_number, client_id, billing_period, billed_amount, paid_amount, status, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).send('Invoice not found'); // send an HTTP error status and message
    res.json({ message: 'Invoice updated' }); // send JSON response to the client
  } catch (err) { // try catch for error handling
    console.error(err);
    res.status(500).send('Error updating invoice'); // send an HTTP error status and message
  }
});

app.delete('/api/invoices/:id', async (req, res) => { // declare an HTTP endpoint (route)
  try { // try/catch for error handling
    const [result] = await pool.query(`DELETE FROM invoices WHERE invoice_id=?`, [req.params.id]); // run SQL query on MySQL connection pool, returns rows
    if (result.affectedRows === 0) return res.status(404).send('Invoice not found'); // send an HTTP error status and message
    res.json({ message: 'Invoice deleted' }); // send JSON response to the client
  } catch (err) { // try catch for error handling
    console.error(err);
    res.status(500).send('Error deleting invoice'); // send an HTTP error status and message
  }
});

// Advanced queries
app.get('/api/clients/total-paid', async (req, res) => { // declare an HTTP endpoint (route)
  try { // try catch for error handling
    const [rows] = await pool.query(` // run SQL query on MySQL connection pool, returns rows
      SELECT c.client_id, c.full_name, COALESCE(SUM(i.paid_amount),0) AS total_paid
      FROM clients c
      LEFT JOIN invoices i ON c.client_id = i.client_id
      GROUP BY c.client_id, c.full_name
      ORDER BY total_paid DESC
    `);
    res.json(rows); // send JSON response to the client
  } catch (err) { // try catch for error handling
    console.error(err);
    res.status(500).send('Error fetching totals'); // send an HTTP error status and message
  }
});

app.get('/api/invoices/pending', async (req, res) => { // declare an HTTP endpoint (route)
  try { // try catch for error handling
    const [rows] = await pool.query(` // run SQL query on MySQL connection pool, returns rows
      SELECT i.*, c.full_name, c.document_number
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.client_id
      WHERE i.status IN ('Pending','Partial')
      ORDER BY i.invoice_id DESC
    `);
    res.json(rows); // send JSON response to the client
  } catch (err) { // try catch for error handling
    console.error(err);
    res.status(500).send('Error fetching pending invoices'); // send an HTTP error status and message
  }
});

app.get('/api/platforms/transactions', async (req, res) => { // declare an HTTP endpoint (route)
  try { // try catch for error handling
    const [rows] = await pool.query(` // run SQL query on MySQL connection pool, returns rows
      SELECT p.platform_id, p.platform_name, COUNT(t.transaction_id) AS total_transactions, COALESCE(SUM(t.amount),0) AS total_amount
      FROM platforms p
      LEFT JOIN transactions t ON p.platform_id = t.platform_id
      GROUP BY p.platform_id, p.platform_name
      ORDER BY total_transactions DESC
    `);
    res.json(rows); // send JSON response to the client
  } catch (err) { // try catch for error handling
    console.error(err);
    res.status(500).send('Error fetching transactions by platform'); // send an HTTP error status and message
  }
});

// Start server
const PORT = process.env.PORT || 3000; // read port from environment or use 3000 as default
app.listen(PORT, () => console.log(`Server on ${PORT}`)); // start the HTTP server and listen for requests

