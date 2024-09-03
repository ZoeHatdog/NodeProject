// SIDEBAR TOGGLE

let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');

function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add('sidebar-responsive');
    sidebarOpen = true;
  }
}

function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove('sidebar-responsive');
    sidebarOpen = false;
  }
}

function logout() {
  fetch('/logout', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
  }).then(response => {
      if (response.ok) {
          window.location.href = '/login'; // Redirect to login page
      }
  }).catch(error => {
      console.error('Error:', error);
  });
}



// ---------- Header-Icons -------

/*function toggleDropdown() {
  document.getElementById("dropdownMenu").classList.toggle("show");
}



window.onclick = function(event) {
  if (!event.target.matches('#accountCircle')) {
      var dropdowns = document.getElementsByClassName("dropdown");
      for (var i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
          }
      }
  }
}*/



