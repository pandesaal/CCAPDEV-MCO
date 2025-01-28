function openReg() {
    document.getElementById("regWindow").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeReg() {
    document.getElementById("regWindow").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    closeIframe();
}

function showLogin() {
    document.getElementById("login").style.display = "grid";
    document.getElementById("signup").style.display = "none";
}

function showSignup() {
    document.getElementById("signup").style.display = "grid";
    document.getElementById("login").style.display = "none";
}

const commLinks = document.querySelectorAll(".buttons a");

commLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        openReg();
    })
});