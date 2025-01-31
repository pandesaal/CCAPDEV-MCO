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

// for editing profile page
function editProfile(e) {
    if (e.target.innerText === "Edit Profile") {
        document.getElementById("profilePic").classList.add("editable");
        document.getElementById("bio").classList.add("editable");
        e.target.innerText = "Save Changes";
        bio.contentEditable = true;
        profileImage.contentEditable = true;
    }
    else {
        document.getElementById("profilePic").classList.remove("editable");
        document.getElementById("bio").classList.remove("editable");
        e.target.innerText = "Edit Profile";
        bio.contentEditable = false;
        profileImage.contentEditable = false;
    }
}
document.getElementById("editButton").addEventListener("click", editProfile);

// navigates to profile page when an icon is clicked; not final
// function toProfile() {
//     window.location.href = "profile.html";
// }
// const icons = document.getElementsByClassName("icon");
// for (let i = 0; i < icons.length; i++) {
//     icons[i].addEventListener("click", toProfile);
// }

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