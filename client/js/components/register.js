function closeReg() {
    document.getElementById("regWindow").classList.add("hide");
    document.getElementById("overlay").classList.add("hide");
}

function openReg() {
    document.getElementById("regWindow").classList.remove("hide");
    document.getElementById("overlay").classList.remove("hide");
}

function showLogin() {
    document.getElementById("login").classList.remove("hide");
    document.getElementById("signup").classList.add("hide");
}

function showSignup() {
    document.getElementById("signup").classList.remove("hide");
    document.getElementById("login").classList.add("hide");
}

const signUpButton = document.getElementById("signupbtn")
const loginButton = document.getElementById("loginbtn")

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    openReg();
    showLogin();
})

signUpButton.addEventListener("click", (e) => {
    e.preventDefault();
    openReg();
    showSignup();

})

document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.querySelector('[name="username"]').value;
    const password = document.querySelector('[name="password"]').value;

    if (username === 'user' && password === 'password') {
        sessionStorage.setItem('isLoggedIn', true);
        window.location.reload();
    } else {
        alert('Incorrect username or password');
    }
});

document.getElementById('signupForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.querySelector('[name="username"]').value;
    const password = document.querySelector('[name="password"]').value;

    if (username === 'user' && password === 'password') {
        sessionStorage.setItem('isLoggedIn', true);
        window.location.reload();
    } else {
        alert('Incorrect username or password');
    }
});

document.querySelectorAll('.post-button').forEach(button => {
    let isLoggedIn = sessionStorage.getItem('isLoggedIn')

    button.addEventListener('click', () => {
        if (isLoggedIn === 'false' || isLoggedIn === null) {
            openReg();
            showLogin();
        }
    })
});

if (document.getElementById('login-note-footer-button')) {
    document.getElementById('login-note-footer-button').addEventListener('click', () => {
        openReg();
        showLogin();
    })
}

document.getElementById('sidebar-logout').addEventListener('click', () => {

    sessionStorage.setItem('isLoggedIn', false);
    window.location.reload()
});


// navigates to profile page when an icon is clicked; not final
// function toProfile() {
//     window.location.href = "profile.html";
// }
// const icons = document.getElementsByClassName("icon");
// for (let i = 0; i < icons.length; i++) {
//     icons[i].addEventListener("click", toProfile);
// }

