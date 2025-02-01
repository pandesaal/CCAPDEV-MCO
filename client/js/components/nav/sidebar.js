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