# PD_Maria_Yanes_Cienaga - Backend and Frontend

## Project Description
This project is a small system for invoices and payments.  
It uses **MySQL** for data storage, **Node.js** and **Express** for the API, and a simple **HTML + JavaScript** frontend for the dashboard.  
You can manage invoices (create, read, update, delete) and run advanced queries.

---

## Technologies
- **Backend:** Node.js, Express, MySQL2, CSV-Parser
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Database:** MySQL
- **Tools:** Postman (for testing)

---

## 📂 How to Get the Project

## 1. Requirements

- Install Node.js (version 18 or LTS version)) (https://nodejs.org).
- Install MySQL Server
- npm (comes with Node.js), open a terminal and check:
  ```bash
  node -v
  mysql --version
  ```

---

## 2. Install and Run

### Step 1 - Download or Clone
You can clone from Git or unzip the project file.


### Option Clone from GitHub
1. Open your terminal.
2. Type:
   ```bash
   git clone https://github.com/Gabrielayanesp/database_payments.git
   ```
3. Press **Enter**.
4. Open the new folder:
   ```bash
   cd pd_maria_yanes_cienaga
   ```
   
```

### Option From ZIP file
1. Download the `.zip` file.
2. Go to your **Downloads** folder.
3. Right click on the file → **Extract All**.
4. Choose a folder to extract.
5. Open the folder in your code editor (for example VSCode).

---

### Step 2 - Create `.env` file
Make a file named `.env` in the main folder.  
Write your MySQL and server information:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=pd_maria_yanes_cienaga
PORT=3000
```

---

### Step 3 - Install dependencies
In the terminal, go to the project folder and type:

```bash
npm install
```

---

### Step 4 - Create the database
Run the SQL script to create tables:

```bash
mysql -u root -p < docs/pd_maria_yanes_cienaga.sql
```
Write your MySQL password when asked.

---

### Step 5 - Load CSV data
Run the load script to put CSV data into the database:

```bash
node backend/db/load_csv.js
```

If you see **CSV data loaded successfully!** → It worked.

---

### Step 6 - Start the server
Run:

```bash
npm start
```

You will see:
```
Server on 3000
```

---

### Step 7 - Open and test
You can now open the frontend in your browser or use Postman.

Example API links:
- `http://localhost:3000/api/invoices`
- `http://localhost:3000/api/invoices/pending`
- `http://localhost:3000/api/clients/total-paid`
- `http://localhost:3000/api/platforms/transactions`

---

## 3. Important Notes

- **All code is commented line by line.**  
  You can open any file in the backend or frontend and see explanations for each line.
- CSV files must have correct headers:
  - `platforms.csv` → column `platform_name`
  - Status in English: `Pending`, `Completed`, `Failed`
- Use the same `document_number` in `clients.csv` and `invoices.csv` so they match.

---

## 4. Folder Structure

```
pd_maria_yanes_cienaga/
│
├── backend/           # API code
│   ├── db/            # Database connection and CSV loader
│   └── server.js      # Main API server
│
├── frontend/          # HTML, CSS, JS for client
│
├── docs/              # SQL script
│
├── .env               # Environment variables
├── package.json       # Node.js dependencies and scripts
└── README.md
```

---

## 5. Scripts

- `npm start` → Start the backend server.
- `node backend/db/load_csv.js` → Load CSV data into MySQL.

---

## 👤 Developer Info
- **Name:** Maria Gabriela Yanes
- **Location:** Ciénaga
- **Module:** M4 Databases SQL & NoSQL

---