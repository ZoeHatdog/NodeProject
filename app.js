const express = require('express');
const mysql = require('mysql2'); // make sure you're using mysql2
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const port = 3000;

const app = express();

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'welcome.2024', // your MySQL password
    database: 'employee_management'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/dashboard', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, 'views', 'dashboard.ejs'));
    } else {
        res.redirect('/login');
    }
});

app.get('/api/username', (req, res) => {
    if (req.session.loggedin) {
        res.json({ username: req.session.username });
    } else {
        res.status(401).json({ error: 'Not logged in' });
    }
});

app.post('/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.redirect('/login?error=' + encodeURIComponent('Passwords do not match'));
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.redirect('/login?error=' + encodeURIComponent('Error hashing password'));
        }

        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
            if (err) {
                return res.redirect('/login?error=' + encodeURIComponent('Error registering user'));
            }
            return res.redirect('/login?success=' + encodeURIComponent('User registered!'));
        });
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.redirect('/login?error=' + encodeURIComponent('Error querying database'));
        }

        if (results.length > 0) {
            bcrypt.compare(password, results[0].password, (err, result) => {
                if (result) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    return res.redirect('/dashboard');
                } else {
                    res.redirect('/login?error=' + encodeURIComponent('Incorrect password!'));
                }
            });
        } else {
            res.redirect('/login?error=' + encodeURIComponent('User not found!'));
        }
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});