
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

const app = express();

// Load environment variables
app.use(express.json());
dotenv.config();

// Connect to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check if db connection works
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }

    console.log('Connected to MySQL successfully as id:', db.threadId);
});

// Route to check if the server started successfully
app.get('/', (req, res) => {
    res.send('Server started successfully');
});

// QUESTION1 1- Retrieve all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

//  question 2. Retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });



//   QUESTION 3. Filter patients by First Name
app.get('/patients/search', (req, res) => {
    const firstName = req.query.first_name;
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name =  ?';
    db.query(query, [firstName], (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });


//   QUESTION 4. Retrieve all providers by their specialty
app.get('/providers/search', (req, res) => {
    const specialty = req.query.specialty;
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    db.query(query, [specialty], (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });



// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
