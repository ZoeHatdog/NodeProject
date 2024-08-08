document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/employees')
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
                    <td>${employee.name}</td>
                    <td>${employee.middle_name}</td>
                    <td>${employee.surname}</td>
                    <td>${employee.Designation}</td>
                    <td>${employee.Department}</td>
                    <td>${employee.work_schedule}</td>
                    <td><button class="btn btn-danger delete-btn" data-id="${employee.emp_id}">Delete</button></td> <!-- Bootstrap delete button -->
                `;
                tableBody.appendChild(row);
            });

            // Add event listener for delete buttons
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const empId = this.getAttribute('data-id');
                    deleteEmployee(empId);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching employees:', error);
            alert('There was an error fetching the employee data. Please try again later.');
        });
});

// Function to handle employee deletion
function deleteEmployee(empId) {
    fetch(`/delete-employee`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emp_id: empId }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert('Employee deleted successfully');
        location.reload(); // Reload the page to reflect changes
    })
    .catch(error => {
        console.error('Error deleting employee:', error);
        alert('There was an error deleting the employee. Please try again later.');
    });
}

// Function to filter table rows based on search input
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
