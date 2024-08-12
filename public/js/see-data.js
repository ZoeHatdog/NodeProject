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

                row.addEventListener('click', function() {
                    console.log('Employee ID:', employee.emp_id); // Debugging
                    handleRowClick(employee.emp_id);
                });

                row.innerHTML = `
                  <td>${employee.emp_id}</td>
                  <td>${employee.Name}</td>
                  <td>${employee.middle_name}</td>
                  <td>${employee.Surname}</td>
                  <td>${employee.Designation}</td>
                  <td>${employee.Department}</td>
                  <td>${employee.work_schedule}</td>
                  <td>${employee.status}</td>
                  
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching employees:', error);
        });

    function handleRowClick(employeeID) {
        if (employeeID) {
            window.location.href = `/employee-details?employeeID=${employeeID}`;
        } else {
            console.error('Invalid Employee ID:', employeeID);
        }
    }
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

