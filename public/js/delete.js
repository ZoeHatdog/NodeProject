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
