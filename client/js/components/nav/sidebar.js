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

const darkMode = document.getElementById('nav-dark-mode');

if (localStorage.getItem('darkMode') === 'enabled') {
    document.documentElement.classList.add('dark-mode');
    document.html
}

darkMode.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
    
    if (document.documentElement.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});
