
fetch('/api/active-employees')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('employee-table-body');
        data.forEach(employee => {
            const row = document.createElement('tr');

            // Add the row click event listener
            row.addEventListener('click', function() {
                handleRowClick(employee['EMP ID #.']);
            });

            row.innerHTML = `
                <td>${employee['#']}</td>
                <td>${employee['EMP ID #.']}</td>
                <td>${employee['Name']}</td>
                <td>${employee['Middle Name']}</td>
                <td>${employee['Surname']}</td>
                <td>${employee['Designation']}</td>
                <td>${employee['Job Grade']}</td>
                <td>${employee['Status']}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching employee data:', error);
    });


function handleRowClick(employeeID) {
    if (employeeID) {
        window.location.href = `/employee-details?employeeID=${employeeID}`;
    } else {
        console.error('Invalid Employee ID:', employeeID);
    }
}


function filterTable() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const table = document.getElementById('employeesTable');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName('td');
    let rowContainsSearchTerm = false;

    for (let j = 0; j < cells.length; j++) {
    if (cells[j].innerText.toLowerCase().includes(searchInput)) {
    rowContainsSearchTerm = true;
    break;
}
}

rows[i].style.display = rowContainsSearchTerm ? '' : 'none';
}
}


document.getElementById('searchInput').addEventListener('keyup', filterTable);
