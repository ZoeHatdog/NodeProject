document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/allemployees')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); 
        })
        .then(data => {
            const tableBody = document.querySelector('#employeesTable tbody');
            tableBody.innerHTML = ''; 

            data.forEach(employee => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${employee.emp_id}</td>
                    <td>${employee.Name}</td>
                    <td>${employee.middle_name}</td>
                    <td>${employee.surname}</td>
                    <td>${employee.nick_name}</td>
                    <td>${employee.Designation}</td>
                    <td>${employee.Department}</td>
                    <td>${employee.work_schedule}</td>
                    <td>${employee.Job_Grade}</td>
                    <td>${employee.job_level_classification}</td>
                    <td>${employee.Classification}</td>
                    <td>${employee.Educational_Attainment}</td>
                    <td>${employee.Course}</td>
                    <td>${employee.Commencement_of_Work}</td>
                    <td>${employee.SSS_number}</td>
                    <td>${employee.PHILHEALTH_number}</td>
                    <td>${employee.Tax_Status}</td>
                    <td>${employee.TIN_number}</td>
                    <td>${employee.PAG_IBIG_number}</td>
                    <td>${employee.Birthday}</td>
                    <td>${employee.Age}</td>
                    <td>${employee.Locker_No}</td>
                    <td>${employee.Religion}</td>
                    <td>${employee.Contact_Number}</td>
                    <td>${employee.Primary_Email}</td>
                    <td>${employee.Company_Email}</td>
                    <td>${employee.Emergency_Contact}</td>
                    <td>${employee.Emergency_Contact_Number}</td>
                    <td>${employee.Length_of_Service}</td>
                    <td>${employee.Gender}</td>
                    <td>${employee.NO}</td>
                    <td>${employee.emp_id_2}</td>
                    <td>${employee.Name3}</td>
                    <td>${employee.TIN_number}</td>
                    <td>${employee.Tax_Status4}</td>
                    <td>${employee.Regularization}</td>
                    <td>${employee.Commencement}</td>
                    <td>${employee.PAF_Schedule}</td>
                    <td>${employee.Employment_Status6}</td>
                    <td>${employee.Signature}</td>
                    <td>${employee.Date_Received}</td>
                    <td>${employee.PAF_2018}</td>
                    <td>${employee.PAF_2019}</td>
                    <td>${employee.PAF_2020}</td>
                    <td>${employee.PAF_2021}</td>
                    <td>${employee.PAF_2022}</td>
                    <td>${employee.PAF_2023}</td>
                    <td>${employee.PAF_2024}</td>
                    <td>${employee.Allowance}</td>
                    <td>${employee.Rate}</td>
                    <td>${employee.Percentage}</td>
                    <td>${employee.Status_201}</td>
                    <td>${employee.Date_of_Separation}</td>
                    <td>${employee.Separation_Category}</td>
                    <td>${employee.Reason_of_Separation}</td>
                    
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching employees:', error);
            alert('There was an error fetching the employee data. Please try again later.');
        });
});

function filterTable() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const table = document.getElementById('employeesTable');
    const rows = table.getElementsByTagName('tr');

    // Loop through all table rows (except the first, which contains headers)
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let rowContainsSearchTerm = false;

        // Loop through all cells in the row
        for (let j = 0; j < cells.length; j++) {
            if (cells[j].innerText.toLowerCase().includes(searchInput)) {
                rowContainsSearchTerm = true;
                break;
            }
        }

        // Show or hide the row based on whether it contains the search term
        rows[i].style.display = rowContainsSearchTerm ? '' : 'none';
    }
}

// Attach the filterTable function to the search input's keyup event
document.getElementById('searchInput').addEventListener('keyup', filterTable);

