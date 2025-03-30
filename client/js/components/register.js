function popup(message) {
    const alert = document.querySelector('.alert');
    alert.innerText = message;
    alert.classList.remove('hide');

    setTimeout(() => { alert.classList.add('hide'); }, 5000);
}

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
    const username = document.querySelector('[name="username"]').value.trim();
    const password = document.querySelector('[name="password"]').value;
    const rememberMe = document.querySelector('[name="rememberMe"]').checked;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, rememberMe })
        });

        const data = await response.json();
        if (response.ok) {
            const user = data.user;
            sessionStorage.setItem('isLoggedIn', true);
            sessionStorage.setItem('user', JSON.stringify(user));
            window.location.reload();
        } 
        else {
            popup(data.message);
        }
    } catch (err) {
        popup("Login failed, try again later.");
    }
});

document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.querySelector('[name="signupUser"]').value.trim();
    const password = document.querySelector('[name="signupPass"]').value.trim();
    const confirmPassword = document.querySelector('[name="resignupPass"]').value.trim();

    if (username.length < 5) return popup('Username must at least be 5 characters.');
    if (password.length < 8) return popup('Password must at least be 8 characters.');
    if (username.includes(' ')) return popup('Username must not contain any spaces.');
    if (username.match(/\W/)) return popup('Username must only contain alphanumeric characters.');
    if (password.includes(' ')) return popup('Password must not contain any spaces.');

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, confirmPassword })
        });

        const data = await response.json();
        if (response.ok) {
            const user = data.user;
            sessionStorage.setItem('isLoggedIn', true);
            sessionStorage.setItem('user', JSON.stringify(user));
            window.location.reload();
        } else {
            popup(data.message);
        }
    } catch (err) {
        console.error(err);
        popup("Sign up failed, try again later.");
    }
});

document.querySelectorAll('.post-button').forEach(button => {
    let isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (button.classList.contains('post-comment') && isLoggedIn === 'true') {
        let postId = button.getAttribute('commentpostid');
        button.href = `/post/${postId}`
    }
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

document.getElementById('sidebar-logout').addEventListener('click', async () => {
    const response = await fetch('/logout', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
        closeReg();
        sessionStorage.setItem('isLoggedIn', false);
        sessionStorage.removeItem('user');
        popup('Logged out successfully!');
        setTimeout(() => { window.location.replace('/'); }, 1000);
    }
    else {
        popup('Error in logging out: ' + response.error);
    }
});