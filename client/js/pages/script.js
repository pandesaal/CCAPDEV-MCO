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