// Fetch the JSON data from the API and populate the table
fetch('/api/inactive-employees')
.then(response => response.json())
.then(data => {
    const tableBody = document.getElementById('employee-table-body');
    data.forEach(employee => {
        const row = document.createElement('tr');

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
