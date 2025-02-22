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

// toggling visibility of password fields
function togglePassInpField(inpField, icon) {
    if (inpField.type === 'password') {
        inpField.type = 'text';
        icon.textContent = 'visibility_off';
    }
    else {
        inpField.type = 'password';
        icon.textContent = 'visibility';
    }
}

document.getElementById('loginPassVisibility').addEventListener('click', (e) => {
    togglePassInpField(document.getElementById('loginPass'), document.getElementById('loginPassVisibility'));
});

document.getElementById('signupPassVisibility').addEventListener('click', (e) => {
    togglePassInpField(document.getElementById('signupPass'), document.getElementById('signupPassVisibility'));
});

document.getElementById('resignupPassVisibility').addEventListener('click', (e) => {
    togglePassInpField(document.getElementById('resignupPass'), document.getElementById('resignupPassVisibility'));
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.querySelector('[name="username"]').value;
    const password = document.querySelector('[name="password"]').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            sessionStorage.setItem('isLoggedIn', true);
            window.location.reload();
        } /* Remove this default login credentials */ else if (username === 'user' && password === 'password') {
            sessionStorage.setItem('isLoggedIn', true);
            window.location.reload();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert("Login failed, try again later.");
    }
});

document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.querySelector('[name="signupUser"]').value;
    const password = document.querySelector('[name="signupPass"]').value;
    const confirmPassword = document.querySelector('[name="resignupPass"]').value;

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, confirmPassword })
        });

        const data = await response.json();
        if (response.ok) {
            sessionStorage.setItem('isLoggedIn', true);
            window.location.reload();
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Sign up failed, try again later.");
    }
});

document.querySelectorAll('.post-button').forEach(button => {
    button.addEventListener('click', () => {
        let isLoggedIn = sessionStorage.getItem('isLoggedIn')
        console.log(isLoggedIn)
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
    closeReg();
    window.location.reload()
});