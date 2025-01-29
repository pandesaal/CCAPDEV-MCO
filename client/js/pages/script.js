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

function editProfile(e) {
    if (e.target.innerText === "Edit Profile") {
        e.target.innerText = "Save Changes";
        bio.contentEditable = true;
        profileImage.contentEditable = true;
    }
    else {
        e.target.innerText = "Edit Profile";
        bio.contentEditable = false;
        profileImage.contentEditable = false;
    }
}
document.getElementById("editButton").addEventListener("click", editProfile);