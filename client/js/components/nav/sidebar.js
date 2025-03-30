const sidebarButton = document.getElementById("sidebar-button")
const sidebarClose = document.getElementById("sidebar-close")
const sidebarOverlay = document.getElementById("sidebar-overlay")

const sidebar = document.getElementById("sidebar-wrapper")

sidebarButton.addEventListener("click", () => {
    sidebar.classList.toggle("hide")
})

sidebarClose.addEventListener("click", () => {
    sidebar.classList.toggle("hide")
})

sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.toggle("hide")
})

const darkMode = document.getElementById('sidebar-dark-mode');

if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}

darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});
