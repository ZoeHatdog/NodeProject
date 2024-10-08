const express = require('express');
const mysql = require('mysql2'); // make sure you're using mysql2
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const { Console, error } = require('console');


const app = express();

const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;



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

app.use(bodyParser.urlencoded({ extended: true }));
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
    if(req.session.loggedin){
        res.render(path.join(__dirname, 'views', 'see-data.ejs'));
    } 
    else {
        res.redirect('/login');
    }
});

app.get('/registration', (req, res) => {
    if(req.session.loggedin){
        res.render('registration.ejs'); 
    }
    else{
    
        return res.redirect('/login');
    }
});
app.get('/add',  (req, res) => {
    if (req.session.loggedin){
        res.render(path.join(__dirname, 'views', 'add.ejs'));}
    else{
        return res.redirect('/login');
    }
});

app.get('/delete',  (req, res) => {
    if(req.session.loggedin){
        res.render('delete');
    }
    else{
        return res.redirect('/login');
    }
});

app.get('/messaging', (req, res) => {
    if(req.session.loggedin){
        res.render(path.join(__dirname, 'views', 'messaging.ejs'));
    }
    else{
        return
    }
})

app.get('/seeemployee',  (req, res) => {
    res.render(path.join(__dirname, 'views', 'see-employee.ejs'));
});
app.get('/see-inactive', (req, res) => {
    res.render(path.join(__dirname, 'views', 'see-inactive.ejs'));
})
app.get('/see-active', (req,res) => {
    res.render(path.join(__dirname, 'views', 'see-active.ejs'));
})
app.get('/see-chart', (req, res) => {
    res.render(path.join(__dirname, 'views', 'see-chart.ejs' ));
})
app.get('/see-per-chart', (req, res) => {
    res.render(path.join(__dirname, 'views', 'see-per-chart.ejs'));
})


app.post('/submit', (req, res) => {
    const {
        employeeNumber, employeeID, firstName, nameMiddle, lastName, nickname, designation, department, workSchedule, jobGrade,
        jobLevel, classification, educationalAttainment, course, commencement, isActive, RegularizationDate, SSS, philhealth,
        taxStatus, tinNumber, pagibig, birthday, age, address, paddress, religion, contactNumber, email, companyEmail, emergencyContact, emergencyNumber,
        los, gender, pafSchedule, PAF2018, PAF2019, PAF2020, PAF2021, PAF2022, PAF2023, PAF2024, allowance, rate, separationDate,
        separationCategory, reasonOfSeparation, employmentStatus, salary
    } = req.body;

    


    console.log("ADD - JSON BODY",req.body); // This is just print to know the data values in the form of add.ejs
    
    // Function to return "-" if value is empty, undefined, or null
    function defaultToDash(value) {
        return value === undefined || value === null || value === '' ? '-' : value;
        
    }

    // Function to add 3 months to a given date
    function threeMonths(value) {
        if (value) {
            var commencementDate = new Date(value);
            commencementDate.setMonth(commencementDate.getMonth() + 3);
            var year = commencementDate.getFullYear();
            var month = (commencementDate.getMonth() + 1).toString().padStart(2, '0');
            var day = commencementDate.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day} 00:00:00`;
        }
        return '-';
    }

    // Function to add 5 months to a given date
    function fiveMonths(value) {
        if (value) {
            var commencementDate = new Date(value);
            commencementDate.setMonth(commencementDate.getMonth() + 5);
            var year = commencementDate.getFullYear();
            var month = (commencementDate.getMonth() + 1).toString().padStart(2, '0');
            var day = commencementDate.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day} 00:00:00`;
        }
        return '-';
    }
    function plusZeroTime(value){
        if (value){
            var commencementDate = new Date(value);
            var year = commencementDate.getFullYear();
            var month = (commencementDate.getMonth() + 1).toString().padStart(2, '0');
            var day = commencementDate.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day} 00:00:00`;
        }
    }

    // Ensure specific fields default to "-"
    const insertValues = [
        defaultToDash(employeeNumber), defaultToDash(employeeID), defaultToDash(firstName), defaultToDash(nameMiddle), 
        defaultToDash(lastName), defaultToDash(nickname), defaultToDash(designation), defaultToDash(department), 
        defaultToDash(workSchedule), defaultToDash(jobGrade), defaultToDash(jobLevel), defaultToDash(classification), 
        defaultToDash(educationalAttainment), defaultToDash(course), plusZeroTime(commencement), defaultToDash(employmentStatus), 
        defaultToDash(plusZeroTime(RegularizationDate)), defaultToDash(SSS), defaultToDash(philhealth), defaultToDash(taxStatus), 
        defaultToDash(tinNumber), defaultToDash(pagibig), defaultToDash(plusZeroTime(birthday)), defaultToDash(age), defaultToDash(religion), 
        defaultToDash(contactNumber), defaultToDash(email), defaultToDash(companyEmail), defaultToDash(emergencyContact), 
        defaultToDash(emergencyNumber), defaultToDash(los), defaultToDash(gender), 
        defaultToDash(pafSchedule), defaultToDash(PAF2018), defaultToDash(PAF2019), defaultToDash(PAF2020), 
        defaultToDash(PAF2021), defaultToDash(PAF2022), defaultToDash(PAF2023), defaultToDash(PAF2024), 
        defaultToDash(allowance), defaultToDash(rate), defaultToDash(isActive), 
        defaultToDash(separationDate), defaultToDash(separationCategory), defaultToDash(reasonOfSeparation),
        defaultToDash(employeeNumber), `Q${defaultToDash(employeeID)}`, `${lastName}, ${firstName} ${nameMiddle}`, 
        defaultToDash(tinNumber), defaultToDash(taxStatus), defaultToDash(plusZeroTime(RegularizationDate)), defaultToDash(plusZeroTime(commencement)), 
        threeMonths(commencement), fiveMonths(commencement), defaultToDash(address), defaultToDash(paddress), defaultToDash(employmentStatus), defaultToDash(salary)
        
    ];
    
    console.log(insertValues);


    //Check Parameters
    const requiredFields = [
        { field: firstName, name: 'First Name' },
        { field: lastName, name: 'Last Name' },
        { field: employeeNumber, name: 'Employee Number' },
        { field: employeeID, name: 'Employee ID' },
        { field: birthday, name: 'Birthday'},
        { field: commencement, name: 'Commencement of Work'}
    ];
    
    let missingFields = [];
    
    for (const { field, name } of requiredFields) {
        if (!field) {
            missingFields.push(name);
        }
    }
    
    if (missingFields.length > 0) {
        return res.json({
            success: false,
            message: `The following required fields must be filled out: ${missingFields.join(', ')}`
        });
    }
    
    // Continue processing if all fields are filled
    

    // SQL insert statement
    const insertSql = `
    INSERT INTO masterlist (
        \`#\`, \`EMP ID #.\`, \`Name\`, \`Middle Name\`, \`Surname\`, \`Nick Name\`, \`Designation\`, \`Department\`, 
        \`Work Schedule\`, \`Job Grade\`, \`Job Level Classification\`, \`Classification\`, \`Educational Attainment\`, \`Course\`, 
        \`Commencement of Work\`, \`Employment Status\`, \`Regularization\`, \`SSS number\`, \`PHILHEALTH no.\`, 
        \`Tax Status\`, \`TIN number\`, \`PAG IBIG number\`, \`Birthday\`, \`Age\`, \`Religion\`, \`Contact #\`, 
        \`PRIMARY EMAIL\`, \`COMPANY EMAIL\`, \`Person to notify in case of emergency\`, \`Number to contact\`, 
        \`Length of Service\`, \`Gender\`, \`PAF Schedule\`, \`PAF 2018\`, \`PAF 2019\`, \`PAF 2020\`, 
        \`PAF 2021\`, \`PAF 2022\`, \`PAF 2023\`, \`PAF 2024\`, \`Allowance\`, \`Rate\`, \`Status\`,
        \`Date of Separation\`, \`Separation Category\`, \`Reason of Separation\`, \`NO\`, \`EMP ID #.2\`, \`Name3\`, \`TIN#\`, 
        \`TAX STATUS4\`, \`Regularization5\`, \`Commencement\`, \`3 Months Evaluation\`,\`5 Months Evaluation\`, \`Address\`, \`Permanent Address\`, \`Employment Status6\`, \`Basic Salary\`
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
`;  



    db.beginTransaction((err) =>{
        if (err){
            return res.status(500).send('Transaction Error' + err);
        }
        db.query(insertSql, insertValues, (insertErr, insertResult) => {
            if (insertErr) {
                return db.rollback(() => {
                    console.error('Error inserting data:', insertErr);
                    return res.status(500).send('Internal Server Error');
                });
            }
    
            db.commit((commitErr) => {
                if (commitErr) {
                    return db.rollback(() => {
                        console.error('Error committing transaction:', commitErr);
                        return res.status(500).send('Internal Server Error');
                    });
                }
                console.log('Transaction Completed');
                res.json({ success: true });
            });
        });
    })
    
});

app.post('/update', (req, res) =>{ 

    const {
        employeeNumber, employeeID, firstName, middleName, lastName, nickname, designation, department, workSchedule, jobGrade,
        jobLevel, classification, educationalAttainment, course, commencement, isActive, RegularizationDate, SSS, philhealth,
        taxStatus, tinNumber, pagibig, birthday, age, address, paddress, religion, contactNumber, email, companyEmail, emergencyContact, emergencyNumber,
        los, gender, pafSchedule, PAF2018, PAF2019, PAF2020, PAF2021, PAF2022, PAF2023, PAF2024, allowance, rate, separationDate,
        separationCategory, reasonOfSeparation, salary, employmentStatus
    } = req.body;
    console.log("UPDATE - JSON BODY",req.body);
    // Function to return "-" if value is empty, undefined, or null
    function defaultToDash(value) {
        return value === undefined || value === null || value === '' ? '-' : value;
    }
    
    // Function to add 3 months to a given date
    function threeMonths(value) {
        if (value) {
            var commencementDate = new Date(value);
            commencementDate.setMonth(commencementDate.getMonth() + 3);
            var year = commencementDate.getFullYear();
            var month = (commencementDate.getMonth() + 1).toString().padStart(2, '0');
            var day = commencementDate.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day} 00:00:00`;
        }
        return '-';
    }
    
    // Function to add 5 months to a given date
    function fiveMonths(value) {
        if (value) {
            var commencementDate = new Date(value);
            commencementDate.setMonth(commencementDate.getMonth() + 5);
            var year = commencementDate.getFullYear();
            var month = (commencementDate.getMonth() + 1).toString().padStart(2, '0');
            var day = commencementDate.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day} 00:00:00`;
        }
        return '-';
    }
    function plusZeroTime(value){
        if (value){
            var commencementDate = new Date(value);
            var year = commencementDate.getFullYear();
            var month = (commencementDate.getMonth() + 1).toString().padStart(2, '0');
            var day = commencementDate.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day} 00:00:00`;
        }
    }
    
    // Ensure specific fields default to "-"
    const insertValues = [
        defaultToDash(employeeID), defaultToDash(firstName), defaultToDash(middleName), 
        defaultToDash(lastName), defaultToDash(nickname), defaultToDash(designation), defaultToDash(department), 
        defaultToDash(workSchedule), defaultToDash(jobGrade), defaultToDash(jobLevel), defaultToDash(classification), 
        defaultToDash(educationalAttainment), defaultToDash(course), plusZeroTime(commencement), 
        defaultToDash(employmentStatus), plusZeroTime(defaultToDash(RegularizationDate)), defaultToDash(SSS), defaultToDash(philhealth), 
        defaultToDash(taxStatus), defaultToDash(tinNumber), defaultToDash(pagibig), plusZeroTime(defaultToDash(birthday)), 
        defaultToDash(age), defaultToDash(religion), defaultToDash(contactNumber), defaultToDash(email), 
        defaultToDash(companyEmail), defaultToDash(emergencyContact), defaultToDash(emergencyNumber), 
        defaultToDash(los), defaultToDash(gender), defaultToDash(pafSchedule), defaultToDash(PAF2018), 
        defaultToDash(PAF2019), defaultToDash(PAF2020), defaultToDash(PAF2021), defaultToDash(PAF2022), 
        defaultToDash(PAF2023), defaultToDash(PAF2024), defaultToDash(allowance), defaultToDash(rate), 
        defaultToDash(isActive), defaultToDash(separationDate), defaultToDash(separationCategory), 
        defaultToDash(reasonOfSeparation), defaultToDash(employeeNumber), `Q${defaultToDash(employeeID)}`, 
        `${lastName}, ${firstName} ${middleName}`, defaultToDash(tinNumber), defaultToDash(taxStatus), 
        defaultToDash(RegularizationDate), defaultToDash(commencement), threeMonths(commencement), 
        fiveMonths(commencement), defaultToDash(address), defaultToDash(paddress),defaultToDash(employmentStatus), defaultToDash(salary)
    ];
    
    // Check for required fields
    const requiredFields = [
        { field: firstName, name: 'First Name' },
        { field: lastName, name: 'Last Name' },
        { field: employeeNumber, name: 'Employee Number' },
        { field: employeeID, name: 'Employee ID' },
        { field: birthday, name: 'Birthday' },
        { field: commencement, name: 'Commencement of Work' }
    ];
    
    let missingFields = [];
    
    for (const { field, name } of requiredFields) {
        if (!field) {
            missingFields.push(name);
        }
    }
    
    if (missingFields.length > 0) {
        return res.json({
            success: false,
            message: `The following required fields must be filled out: ${missingFields.join(', ')}`
        });
    }
    
    // Add the employeeNumber to the end of the array to use in the WHERE clause
    insertValues.push(employeeNumber);
    
    // SQL update statement
    const updateSql = `
        UPDATE masterlist 
        SET 
            \`EMP ID #.\` = ?, \`Name\` = ?, \`Middle Name\` = ?, \`Surname\` = ?, \`Nick Name\` = ?, 
            \`Designation\` = ?, \`Department\` = ?, \`Work Schedule\` = ?, \`Job Grade\` = ?, 
            \`Job Level Classification\` = ?, \`Classification\` = ?, \`Educational Attainment\` = ?, 
            \`Course\` = ?, \`Commencement of Work\` = ?, \`Employment Status\` = ?, \`Regularization\` = ?, 
            \`SSS number\` = ?, \`PHILHEALTH no.\` = ?, \`Tax Status\` = ?, \`TIN number\` = ?, 
            \`PAG IBIG number\` = ?, \`Birthday\` = ?, \`Age\` = ?, \`Religion\` = ?, \`Contact #\` = ?, 
            \`PRIMARY EMAIL\` = ?, \`COMPANY EMAIL\` = ?, \`Person to notify in case of emergency\` = ?, 
            \`Number to contact\` = ?, \`Length of Service\` = ?, \`Gender\` = ?, \`PAF Schedule\` = ?, 
            \`PAF 2018\` = ?, \`PAF 2019\` = ?, \`PAF 2020\` = ?, \`PAF 2021\` = ?, \`PAF 2022\` = ?, 
            \`PAF 2023\` = ?, \`PAF 2024\` = ?, \`Allowance\` = ?, \`Rate\` = ?, \`Status\` = ?, 
            \`Date of Separation\` = ?, \`Separation Category\` = ?, \`Reason of Separation\` = ?, 
            \`NO\` = ?, \`EMP ID #.2\` = ?, \`Name3\` = ?, \`TIN#\` = ?, \`TAX STATUS4\` = ?, 
            \`Regularization5\` = ?, \`Commencement\` = ?, \`3 Months Evaluation\` = ?, 
            \`5 Months Evaluation\` = ?, \`Address\` = ?, \`Permanent Address\` = ?, \`Employment Status6\` = ?, \`Basic Salary\` = ?
        WHERE 
            \`#\` = ?
    `;
    
    // Execute the update query
    db.query(updateSql, insertValues, (updateErr, updateResult) => {
        if (updateErr) {
            console.error('Error updating data:', updateErr);
            return res.status(500).send('Internal Server Error');
        }
        res.json({ success: true });
        // Redirect to a success page or another route if needed
    });
    
})



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
                return res.send('Error fetching data');
            }
    
            const { activeCount, inactiveCount, TotalEmployees, RegisteredUsers } = results[0];
    
            // Disable caching
            res.set('Cache-Control', 'no-store');
    
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
  
    if (chartId === 'chart1') {
      query = `
        SELECT 
          CASE
            WHEN age BETWEEN 20 AND 24 THEN '20-24'
            WHEN age BETWEEN 25 AND 29 THEN '25-29'
            WHEN age BETWEEN 30 AND 34 THEN '30-34'
            WHEN age BETWEEN 35 AND 39 THEN '35-39'
            WHEN age BETWEEN 40 AND 44 THEN '40-44'
            WHEN age BETWEEN 45 AND 49 THEN '45-49'
            WHEN age BETWEEN 50 AND 54 THEN '50-54'
            WHEN age BETWEEN 55 AND 59 THEN '55-59'
            ELSE '60+'
          END as age_range, 
          COUNT(*) as count 
        FROM masterlist 
        GROUP BY age_range
      `;
    } else if (chartId === 'chart2') {
      query = `
        SELECT 
          department, 
          COUNT(*) as count 
        FROM masterlist 
        WHERE department IN ('admin', 'engineering', 'FEME', 'manufacturing', 'QA', 'R&D', 'Sales', 'Top Management', 'IT')
        GROUP BY department
      `;
    } else if (chartId === 'chart3') {
      query = `
        SELECT 
          YEAR(\`Commencement of Work\`) AS year,
          COUNT(*) AS number_of_employees
        FROM 
          masterlist
        GROUP BY 
          YEAR(\`Commencement of Work\`)
        ORDER BY 
          year;
      `;
    } else if (chartId === 'chart4') {
      query = `
        SELECT 
          department,
          gender,
          COUNT(*) as count 
        FROM 
          masterlist 
        GROUP BY 
          department, gender 
        ORDER BY 
          department, gender;
      `;
    } else if (chartId === "chart5"){
      query = `
      SELECT 
        \`length of service\` AS service_length,
        COUNT(*) AS number_of_employees
      FROM 
        masterlist
      WHERE 
        \`length of service\` IS NOT NULL 
        AND \`length of service\` != ''
      GROUP BY 
        \`length of service\`
      ORDER BY 
        \`number_of_employees\`;
    `;
    } else if (chartId === 'employmentStatus') {
      query = `
          SELECT 
              Department, 
              \`Employment Status6\` as employment_status, 
              COUNT(*) as count 
          FROM masterlist 
          WHERE \`Employment Status6\` IN ('Regular', 'Probationary')
          GROUP BY Department, employment_status
      `;
  }
  
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
        return;
      }
      console.log(results);
  
      if (chartId === 'employmentStatus'){
        const chartData = formatDataForApexCharts(results);
        res.json(chartData);
      } else{
      res.json(results);
      }
    });
});



function formatDataForApexCharts(data){
    const departments = [...new Set(data.map(item => item.Department))];
    const series = [
        {
            name: 'Regular',
            data: departments.map(dept => {
                const record = data.find(item => item.Department === dept && item.employment_status === 'Regular');
                return record ? record.count : 0;
            })
        },
        {
            name: 'Probationary',
            data: departments.map(dept => {
                const record = data.find(item => item.Department === dept && item.employment_status === 'Probationary');
                return record ? record.count : 0;
            })
        }
    ];
  
    return {
        categories: departments,
        series: series
    };
}


app.get('/per-chart-data', (req, res) => {
    const chartID = req.query.chartID;
    console.log('Received chartID:', chartID); // Debugging line
    
    if (!chartID) {
        res.status(400).send('Invalid or missing chartID');
        return;
    }

    let query = '';
    if (chartID === 'chart1') {
        query = `
        SELECT
            Department, 
            \`Educational Attainment\` as educational_attainment, 
            COUNT(*) as count 
        FROM masterlist 
        GROUP BY department, educational_attainment
        ORDER BY department;
        `;
    } else if (chartID === 'chart2') {
        query = `
        SELECT
            Department, 
            \`Job Grade\` as job_grade, 
            COUNT(*) as count 
        FROM masterlist 
        GROUP BY job_grade, department;

        `;
    } else if (chartID === 'chart3') {
        query = `
        SELECT
            Department, 
            \`Job Level Classification\` as job_lvl, 
            COUNT(*) as count 
        FROM masterlist 
        GROUP BY job_lvl, department
        ORDER BY job_lvl;
        `;
    } else {
        res.status(400).send('Invalid chartID');
        return;
    }

    db.query(query, (error, results) => {
        if (error) {
            res.status(500).send('QUERY ERROR');
            console.error(error);
            return;
        }
        console.log('Query results:', results);
        res.json(results);
    });
});





/* --------------------------------------------------- PERFORMANCE CHART --------------------------------------

  app.get('/per-chart-data', (req, res) => {
    const chartId = req.query.chartId;
  
    let query = '';
    if (chartId === '1') {
        query = `
        SELECT
            Department, 
            \`Educational Attainment\` as educational_attainment, 
            COUNT(*) as count 
        FROM masterlist 
        GROUP BY department, educational_attainment
        ORDER BY department;
        `;
    } else if (chartId === '2') {
        query = `
        SELECT
            Department, 
            \`Job Grade\` as job_grade, 
            COUNT(*) as count 
        FROM masterlist 
        GROUP BY job_grade, department;
        `;
    } else {
        return res.status(400).json({ error: 'Invalid chartId' });
    }

    db.query(query, (err, results) => {
        if (err) throw err;
        console.log(chartData);
        const chartData = processChartData(results, chartId);
        res.json(chartData);
    
    });
});

    function processChartData(data, chartId) {
    const departments = [];
    const series = {};

    data.forEach(row => {
        if (!departments.includes(row.Department)) {
        departments.push(row.Department);
        }

        if (chartId === '1') {
        if (!series[row.educational_attainment]) {
            series[row.educational_attainment] = [];
        }
        series[row.educational_attainment].push(row.count);
        } else if (chartId === '2') {
        if (!series[row.job_grade]) {
            series[row.job_grade] = [];
        }
        series[row.job_grade].push(row.count);
        }
    });

    return {
        categories: departments,
        series: Object.keys(series).map(key => ({
        name: key,
        data: series[key]
        }))
    };
    }
*/
  

  


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
                \`Address\` AS address,
                \`Permanent Address\` AS paddress,
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
                \`Regularization\` as regularization,

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
                \`Reason of Separation\` AS ros,
                \`Basic Salary\` AS salary,
                \`Employment Status\` AS employmentStatus,
                \`Regularization\` as RegularizationDate,
                \`Status\` as status,
                \`Length of Service\` as LOS
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
        console.log(employeeData.birthday);
        console.log(employeeData.COW);
        console.log(employeeData.RegularizationDate);
        console.log(employeeData.separationDate);
        console.log(employeeData.employmentStatus);
        if (employeeData.birthday) {
            employeeData.birthday = new Date(employeeData.birthday).toISOString().split('T')[0];
        }
        if (employeeData.COW){
            employeeData.COW = new Date (employeeData.COW).toISOString().split('T')[0];
        }
        if (employeeData.RegularizationDate){
            employeeData.RegularizationDate = new Date (employeeData.RegularizationDate).toISOString().split('T')[0];
        }
        
        if (employeeData.separationDate){
            if(employeeData.separationDate != "-"){
                employeeData.separationDate = new Date (employeeData.RegularizationDate).toISOString().split('T')[0];
            }
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

// =================================See ACTIVE EMPLOYEEs==================================


app.get('/api/active-employees', (req, res) => {
    const query = `
        SELECT \`#\`, \`EMP ID #.\`, \`Name\`, \`Middle Name\`, \`Surname\`, \`Designation\`, \`Job Grade\`, \`Status\` 
        FROM \`masterlist\` 
        WHERE \`Status\` = 'Active'
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
app.post('/delete-employee', (req, res) => {
    const empId = req.body.emp_id;

    // Assuming you have a function to delete the employee from the database
    const query = 'DELETE FROM masterlist WHERE `EMP ID #.` = ?';
    
    db.query(query, [empId], (error, result) => {
        if (error) {
            console.error('Error deleting employee:', error);
            return res.json({ success: false, message: 'Error deleting employee from the database' });
        }

        if (result.affectedRows > 0) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: 'Employee not found' });
        }
    });
});



// -------------------------->     FOR MESSAGING APP <----------------------------------------


// DATABASE FOR MESSAGES 
const messageDB = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Use your MySQL username
    password: 'welcome.2024', // Use your MySQL password
    database: 'chatgroup'
});

messageDB.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

io.on('connection', (socket) => {
    // Notify all clients that a new user has joined
    io.emit('chat message', 'A new user has joined the chat.');
  
    // Fetch previous messages from MySQL and send them to the newly connected client
    messageDB.query('SELECT * FROM messages ORDER BY timestamp ASC LIMIT 100', (err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return;
        }
        // Send the fetched messages to the connected client
        socket.emit('load previous messages', results);
    });
  
    // Handle new incoming message
    socket.on('chat message', (msg) => {
        // Insert the new message into the MySQL database
        messageDB.query('INSERT INTO messages (message) VALUES (?)', [msg], (err, result) => {
            if (err) {
                console.error('Error saving message:', err);
                return;
            }
            // Broadcast the new message to all connected clients
            io.emit('chat message', msg);
        });
    });
  
    // Handle message clearing event
    socket.on('clear messages', () => {
        // Clear all messages from the MySQL database
        messageDB.query('DELETE FROM messages', (err) => {
            if (err) {
                console.error('Error clearing messages:', err);
                return;
            }
            // Notify all clients to clear their chat windows
            io.emit('messages cleared');
        });
    });
  
    // Notify all clients when a user disconnects
    socket.on('disconnect', () => {
        io.emit('chat message', 'A user has left the chat.');
    });
});

// AUTO UPDATE OF COMMENCEMENT OF WORK AND LENGTH OF SERVICE
// Single function to calculate and optionally update "Length of Service"
function processLengthOfService() {
    // MySQL query to get "EMP ID #." and "Commencement of Work" from masterlist
    const query = `SELECT \`EMP ID #.\`, \`Commencement of Work\` FROM masterlist`;

    db.query(query, (err, results) => {
        if (err) {
            throw err;
        }

        results.forEach(row => {
            const commencementDate = new Date(row['Commencement of Work']);
            const lengthOfService = calculateYearsOfService(commencementDate);

            // Log the calculated length of service
            console.log(`EMP ID #: ${row['EMP ID #.']}, Length of Service: ${lengthOfService} years`);

            // Optional: Update the "Length of Service" column in the database
            const updateQuery = `UPDATE masterlist SET \`Length of Service\` = ? WHERE \`EMP ID #.\` = ?`;
            db.query(updateQuery, [lengthOfService, row['EMP ID #.']], (updateErr) => {
                if (updateErr) {
                    throw updateErr;
                }
                console.log(`Updated EMP ID #: ${row['EMP ID #.']} with Length of Service: ${lengthOfService} years`);
            });
        });
    });
}

// Helper function to calculate the length of service in years
function calculateYearsOfService(startDate) {
    const today = new Date();
    let years = today.getFullYear() - startDate.getFullYear();
    const monthsDifference = today.getMonth() - startDate.getMonth();

    // Adjust if the month hasn't been reached yet in the current year
    if (monthsDifference < 0 || (monthsDifference === 0 && today.getDate() < startDate.getDate())) {
        years--;
    }

    return years;
}

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
    console.log("Function Running");
    processLengthOfService();
});


