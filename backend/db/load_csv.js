const fs = require('fs');
const path = require('path'); // import path, to work with file and folder paths
const csv = require('csv-parser');
const { pool } = require('./connection');

async function loadTableFromCSV(tableName, filePath, insertQuery, mapRow) { // async function - may perform DB or IO operations
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath) // this function rear a CSV file line by line and parse it
      .pipe(csv()) // read a CSV file line by line and parse it
      .on('data', (row) => results.push(row))
      .on('end', async () => {
        try { // try/catch for error handling
          for (const row of results) {
            const mapped = await mapRow(row);
            if (mapped) {
              await pool.query(insertQuery, mapped); // run SQL query on MySQL connection pool, returns rows
            }
          }
          resolve();
        } catch (err) { // try/catch for error handling
          reject(err);
        }
      });
  });
}

async function main() { // async function to may perform DB or IO operations
  try { // the try catch for error handling
    // for looad platforms
    await loadTableFromCSV(
      'platforms',
      path.join(__dirname, '../data/platforms.csv'),
      'INSERT IGNORE INTO platforms (platform_name) VALUES (?)',
      async (row) => [row.platform_name]
    );

    // for load clients
    await loadTableFromCSV(
      'clients',
      path.join(__dirname, '../data/clients.csv'),
      'INSERT INTO clients (full_name, document_type, document_number, address, phone, email) VALUES (?,?,?,?,?,?)',
      async (row) => [
        row.full_name,
        row.document_type,
        row.document_number,
        row.address.replace(/\n/g, ' '),
        row.phone,
        row.email
      ]
    );

    // for load invoices
    await loadTableFromCSV(
      'invoices',
      path.join(__dirname, '../data/invoices.csv'),
      'INSERT INTO invoices (invoice_number, client_id, billing_period, billed_amount, paid_amount, status) VALUES (?,?,?,?,?,?)',
      async (row) => {
        const [clients] = await pool.query('SELECT client_id FROM clients WHERE document_number = ?', [row.document_number]); // run SQL query on MySQL connection pool, returns rows
        if (clients.length === 0) return null;
        return [
          row.invoice_number,
          clients[0].client_id,
          row.billing_period,
          row.billed_amount,
          row.paid_amount,
          row.status === 'Pendiente' ? 'Pending' :
          row.status === 'Fallida' ? 'Failed' :
          row.status === 'Completada' ? 'Completed' : row.status
        ];
      }
    );

    // for load transactions
    await loadTableFromCSV(
      'transactions',
      path.join(__dirname, '../data/transactions.csv'),
      'INSERT INTO transactions (transaction_code, platform_id, invoice_id, amount, transaction_date, status) VALUES (?,?,?,?,?,?)',
      async (row) => {
        const [platforms] = await pool.query('SELECT platform_id FROM platforms WHERE platform_name = ?', [row.platform_name]); // run SQL query on MySQL connection pool, returns rows
        const [invoices] = await pool.query('SELECT invoice_id FROM invoices WHERE invoice_number = ?', [row.invoice_number]); // run SQL query on MySQL connection pool, returns rows
        if (platforms.length === 0 || invoices.length === 0) return null;
        return [
          row.transaction_code,
          platforms[0].platform_id,
          invoices[0].invoice_id,
          row.amount,
          row.transaction_date,
          row.status === 'Pendiente' ? 'Pending' :
          row.status === 'Fallida' ? 'Failed' :
          row.status === 'Completada' ? 'Completed' : row.status
        ];
      }
    );

    console.log('CSV data loaded successfully!');
    process.exit(0); // exit the Node.js process with success or failure code
  } catch (err) { // the try catch for error handling
    console.error(err);
    process.exit(1); // exit the Node.js process with success or failure code
  }
}

main();