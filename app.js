const express = require('express');
const mysql = require('mysql2'); // make sure you're using mysql2
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const { Console } = require('console');
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

app.get('/seedata',  (req, res) => {
    res.render(path.join(__dirname, 'views', 'see-data.ejs'));
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

app.get('/seeemployee',  (req, res) => {
    res.render(path.join(__dirname, 'views', 'see-employee.ejs'));

});
app.get('/see-inactive', (req, res) => {
    res.render(path.join(__dirname, 'views', 'see-inactive.ejs'));
})


app.post('/submit', (req, res) => {
    const {
        employeeNumber, employeeID, firstName, middleName, lastName, nickname, designation, department, workSchedule, jobGrade,
        jobLevel, classification, educationalAttainment, course, commencement, isActive, RegularizationDate, SSS, philhealth,
        TaxStatus, tinNumber, pagibig, birthday, age, religion, contactNumber, email, companyEmail, emergencyContact, emergencyNumber,
        los, pafSchedule, PAF2018, PAF2019, PAF2020, PAF2021, PAF2022, PAF2023, PAF2024, allowance, rate, seperationDate,
        seperationCategory, reasonOfSeparation
    } = req.body;
    console.log(reasonOfSeparation, seperationDate,seperationCategory);

    // Function to return "-" if value is empty, undefined, or null
    function defaultToDash(value) {
        return value === undefined || value === null || value === '' ? '-' : value;
    }

    // Ensure specific fields default to "-"
    const insertValues = [
        defaultToDash(employeeNumber), defaultToDash(employeeID), defaultToDash(firstName), defaultToDash(middleName), 
        defaultToDash(lastName), defaultToDash(nickname), defaultToDash(designation), defaultToDash(department), 
        defaultToDash(workSchedule), defaultToDash(jobGrade), defaultToDash(jobLevel), defaultToDash(classification), 
        defaultToDash(educationalAttainment), defaultToDash(course), defaultToDash(commencement), defaultToDash(isActive), 
        defaultToDash(RegularizationDate), defaultToDash(SSS), defaultToDash(philhealth), defaultToDash(TaxStatus), 
        defaultToDash(tinNumber), defaultToDash(pagibig), defaultToDash(birthday), defaultToDash(age), defaultToDash(religion), 
        defaultToDash(contactNumber), defaultToDash(email), defaultToDash(companyEmail), defaultToDash(emergencyContact), 
        defaultToDash(emergencyNumber), defaultToDash(los), defaultToDash(pafSchedule), 
        defaultToDash(PAF2018), defaultToDash(PAF2019), defaultToDash(PAF2020), defaultToDash(PAF2021), 
        defaultToDash(PAF2022), defaultToDash(PAF2023), defaultToDash(PAF2024), defaultToDash(allowance), 
        defaultToDash(rate), defaultToDash(seperationDate), defaultToDash(seperationCategory), defaultToDash(reasonOfSeparation)
    ];

    // SQL insert statement
    const insertSql = `
        INSERT INTO masterlist (
            \`#\`, \`EMP ID #.\`, \`Name\`, \`Middle Name\`, \`Surname\`, \`Nick Name\`, \`Designation\`, \`Department\`, 
            \`Work Schedule\`, \`Job Grade\`, \`Job Level Classification\`, \`Classification\`, \`Educational Attainment\`, \`Course\`, 
            \`Commencement of Work\`, \`Employment Status\`, \`Regularization\`, \`SSS number\`, \`PHILHEALTH no.\`, 
            \`Tax Status\`, \`TIN number\`, \`PAG IBIG number\`, \`Birthday\`, \`Age\`, \`Religion\`, \`Contact #\`, 
            \`PRIMARY EMAIL\`, \`COMPANY EMAIL\`, \`Person to notify in case of emergency\`, \`Number to contact\`, 
            \`Length of Service\`, \`Gender\`, \`PAF Schedule\`, \`PAF 2018\`, \`PAF 2019\`, \`PAF 2020\`, 
            \`PAF 2021\`, \`PAF 2022\`, \`PAF 2023\`, \`PAF 2024\`, \`Allowance\`, \`Rate\`, 
            \`Date of Separation\`, \`Separation Category\`, \`Reason of Separation\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL,?,?)
    `;

    db.query(insertSql, insertValues, (insertErr, insertResult) => {
        if (insertErr) {
            console.error('Error inserting data:', insertErr);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/success'); // Redirect to a success page or another route
    });
});


app.get('/dashboard', (req, res) => {
    if (req.session.loggedin) {     
        const query = `
        SELECT
            (SELECT SUM(CASE WHEN \`Status\` = 'active' THEN 1 ELSE 0 END) FROM masterlist) AS activeCount,
            (SELECT SUM(CASE WHEN \`Status\` = 'inactive' THEN 1 ELSE 0 END) FROM masterlist) AS inactiveCount,
            (SELECT COUNT(*) FROM masterlist) AS TotalEmployees,
            (SELECT COUNT(*) FROM users) AS RegisteredUsers
    `;
        db.query(query, (err, results) => {
            if (err) {
                return res.send('Error fetching data'); // Sending error response
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






//                             ------------------ SEE EMPLOYEE DETAILS in SEE Data FUNCTION ----------
app.get('/api/allemployees', (req, res) => {
    const query = `
        SELECT 
            \`EMP ID #.\` AS emp_id, 
            \`Name\`, 
            \`Middle Name\` AS middle_name, 
            \`Surname\` AS Surname, 
            \`Designation\`, 
            \`Department\`, 
            \`Work Schedule\` AS work_schedule,
            \`Status\` as status 
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

app.get('/employee-details', (req, res) => {
    const employeeId = req.query.employeeID;

    if (!employeeId) {
        return res.status(400).send('Employee ID is required');
    }

    const query = `
        SELECT 
                \`#\` AS emp_number,
                \`EMP ID #.\` AS emp_id, 
                \`Name\`, 
                \`Middle Name\` AS middle_name, 
                \`Surname\` AS surname, 
                \`Designation\`, 
                \`Department\`, 
                \`Work Schedule\` AS work_schedule,
                \`Status\`, 
                \`Nick Name\` AS nick_name, 
                \`Contact #\` AS contact_number,
                \`Birthday\` AS birthday,
                \`Gender\` AS gender, 
                \`Religion\` AS religion,
                \`PRIMARY EMAIL\` AS email,
                \`Person to notify in case of emergency\` AS PCE,
                \`Number to contact\` AS numberPCE,
                \`Educational Attainment\` AS educational_attainment,
                \`Course\` AS course,
                \`COMPANY EMAIL\` AS company_email,
                \`Job Grade\` AS job_grade,
                \`Job Level Classification\` AS job_lvl_classification,
                \`Classification\` AS classification,
                \`Commencement of Work\` AS COW,

                \`TIN number\` AS tin_number,
                \`SSS number\` AS sss_number,
                \`PHILHEALTH no.\` AS philhealth_number,
                \`Tax Status\` AS tax_status,
                \`PAG IBIG number\` AS pagibig_number,
                \`PAF Schedule\` AS paf_schedule,
                \`PAF 2018\` AS paf_2018,
                \`PAF 2019\` AS paf_2019,
                \`PAF 2020\` AS paf_2020,
                \`PAF 2021\` AS paf_2021,
                \`PAF 2022\` AS paf_2022,
                \`PAF 2023\` AS paf_2023,
                \`PAF 2024\` AS paf_2024,
                \`Allowance\` AS allowance,
                \`Rate\` AS rate,
                \`Date of Separation\` AS separationDate,
                \`Separation Category\` AS separation_category,
                \`Reason of Separation\` AS ros
            FROM 
                masterlist
        WHERE \`EMP ID #.\` = ?
    `;


    db.query(query, [employeeId], (err, results) => {
        if (err) {
            console.error('Error fetching employee details:', err.message);
            return res.status(500).send('Server Error');
        }

        if (results.length === 0) {
            return res.status(404).send('Employee not found');
        }

        // Format the birthday field to YYYY-MM-DD
        let employeeData = results[0];
        if (employeeData.birthday) {
            employeeData.birthday = new Date(employeeData.birthday).toISOString().split('T')[0];
        }
        if (employeeData.COW){
            employeeData.COW = new Date (employeeData.COW).toISOString().split('T')[0];
        }

        res.render('employee-details', { employee: employeeData });
    });
});


// ---------------------- SEE INACTIVE EMPLOYEES ----------------------------------------------

app.get('/api/inactive-employees', (req, res) => {
    const query = `
        SELECT \`#\`, \`EMP ID #.\`, \`Name\`, \`Middle Name\`, \`Surname\`, \`Designation\`, \`Job Grade\`, \`Status\` 
        FROM \`masterlist\` 
        WHERE \`Status\` = 'Inactive'
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching employees:', err.message);
            res.status(500).json({ error: 'Server Error', details: err.message });
            return;
        }
        
        res.json(results); // Send the results as JSON
    });
});




// --------------------------------           DELETE FUNCTION ------------------------------------


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
            \`Status\` AS Status, 
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


