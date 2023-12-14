const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'gestiontaxes',
    port:3306
});

db.connect((err) => {
  if (err) {
    console.log('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM personne', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(results);
    }
  });
});
// Login API endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
  
    // Check if the username exists
    db.query('SELECT * FROM User WHERE email = ?', [email], (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (results.length > 0) {
          // Compare the provided password with the hashed password from the database
          bcrypt.compare(password, results[0].password, (bcryptErr, bcryptRes) => {
            if (bcryptErr) {
              res.status(500).send(bcryptErr);
            } else {
              if (bcryptRes) {
                res.status(200).send('Login successful');
              } else {
                res.status(401).send('Incorrect password');
              }
            }
          });
        } else {
          res.status(404).send('User not found');
        }
      }
    });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


