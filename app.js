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

app.get('/registration', (req, res) => {
    res.render('registration.ejs'); // Renders the 'registration.ejs' file
});
app.get('/add',  (req, res) => {
    res.render(path.join(__dirname, 'views', 'add.ejs'));

});

app.get('/delete',  (req, res) => {
    res.render('delete');
});

app.post('/submit', (req, res) =>{

    const {employeeNumber, employeeID, firstName, middleName, lastName, designation,department, workSchedule,jobGrade,classification,educationalAttainment, 
        course,commencement, sss,philhealth,taxStatus,tinNumber,pagibig,birthday,age, religion, contactNumber, email,companyEmail,
        emergencyContact, emergencyNumber, los, gender, regularization, pafSchedule, employmentStatus,PAF2021,PAF2022,PAF2023,
        PAF2024, allowance, rate
    } = req.body;
    console.log(employeeNumber, employeeID, firstName, middleName, lastName, designation,department, workSchedule,jobGrade,classification,educationalAttainment, 
        course,commencement, sss,philhealth,taxStatus,tinNumber,pagibig,birthday,age, religion, contactNumber, email,companyEmail,
        emergencyContact, emergencyNumber, los, gender, regularization, pafSchedule, employmentStatus,PAF2021,PAF2022,PAF2023,
        PAF2024, allowance, rate)

});

app.get('/dashboard', (req, res) => {
    if (req.session.loggedin) {     
        const query = `
        SELECT
            (SELECT SUM(CASE WHEN \`201 Status2\` = 'active' THEN 1 ELSE 0 END) FROM masterlist) AS activeCount,
            (SELECT SUM(CASE WHEN \`201 Status2\` = 'inactive' THEN 1 ELSE 0 END) FROM masterlist) AS inactiveCount,
            (SELECT COUNT(*) FROM masterlist) AS TotalEmployees,
            (SELECT COUNT(*) FROM users) AS RegisteredUsers
    `;
        db.query(query, (err, results) => {
            if (err) {
                res.send('Error fetching data'); // Sending error response
                // No return here, which can lead to multiple sends
            }
            const { activeCount, inactiveCount, TotalEmployees, RegisteredUsers } = results[0];
            res.render('dashboard', { 
                username: req.session.username, 
                activeCount, 
                inactiveCount, 
                TotalEmployees, 
                RegisteredUsers 
            });

        });
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

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out.');
        }
        res.redirect('/login'); // Redirect to login page after logout
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out.');
        }
        res.redirect('/login'); // Redirect to login page after logout
    });
});




app.get('/data', (req, res) => {
    const chartId = req.query.chartId;
    let query = '';

    if (chartId === 'chart3') {
        query = `
            SELECT 
                YEAR(\`Commencement of Work\`) AS year,
                COUNT(*) AS number_of_employees
            FROM 
                geninfolist
            WHERE 
                \`Commencement of Work\` IS NOT NULL 
                AND \`Commencement of Work\` != ''
                AND \`Commencement of Work\` REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$'
            GROUP BY 
                YEAR(\`Commencement of Work\`)
            ORDER BY 
                year;
        `;
    } else if (chartId === 'chart5') {
        query = `
            SELECT 
                \`length of service\` AS service_length,
                COUNT(*) AS number_of_employees
            FROM 
                geninfolist
            WHERE 
                \`length of service\` IS NOT NULL 
                AND \`length of service\` != ''
            GROUP BY 
                \`length of service\`
            ORDER BY 
                service_length;
        `;
    }

    db.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});



// Endpoint to fetch employees
app.get('/api/employees', (req, res) => {
    const query = `
        SELECT 
            \`EMP ID #.\` AS emp_id, 
            \`name\`, 
            \`Middle Name\` AS middle_name, 
            \`Surname\` AS surname, 
            \`Designation\`, 
            \`Department\`, 
            \`Work Schedule\` AS work_schedule 
        FROM masterlist
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching employees:', err.message);
            res.status(500).json({ error: 'Server Error', details: err.message });
            return;
        }
        res.json(results);
    });
});


// Endpoint to handle employee deletion
app.post('/delete-employee', express.json(), (req, res) => {
    const emp_id = req.body.emp_id;
    const query = 'DELETE FROM masterlist WHERE `EMP ID #.` = ?';

    db.query(query, [emp_id], (err, results) => {
        if (err) {
            console.error('Error deleting employee:', err.message);
            res.status(500).json({ error: 'Server Error', details: err.message });
            return;
        }
        res.json({ message: 'Employee deleted successfully' });
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});


