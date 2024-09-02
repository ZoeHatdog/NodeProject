document.addEventListener('DOMContentLoaded', function() {
    loadEmployees(); // Load employee data when the page is ready

    // Event listener for filter input
    document.getElementById('searchInput').addEventListener('keyup', filterTable);
});

// Function to load employee data and populate the table
function loadEmployees() {
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
                    <td>${employee.Status}</td>
                    <td><button class="btn btn-danger delete-btn" data-id="${employee.emp_id}">Delete</button></td> <!-- Bootstrap delete button -->
                `;
                tableBody.appendChild(row);
            });

            // Add event listener for delete buttons
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const empId = this.getAttribute('data-id');
                    confirmDelete(empId);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching employees:', error);
            alert('There was an error fetching the employee data. Please try again later.');
        });
}

// Function to show SweetAlert2 confirmation and handle employee deletion
function confirmDelete(empId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteEmployee(empId);
        }
    });
}

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
        if (data.success) {
            Swal.fire(
                'Deleted!',
                'Employee has been deleted.',
                'success'
            ).then(() => {
                // Reload the table data
                location.reload();
            });
        } else {
            Swal.fire('Error!', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error deleting employee:', error);
        Swal.fire('Error!', 'There was an error deleting the employee. Please try again later.', 'error');
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
