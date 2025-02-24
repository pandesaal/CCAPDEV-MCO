import { navInjector } from "../components/nav-injector.js";
import { postInjector } from "../components/post-injector.js";

document.addEventListener('DOMContentLoaded', () => {

    navInjector();
    postInjector();
});

// shows edit profile buttons when it's logged-in user's profile
if (sessionStorage.getItem('isLoggedIn') === 'true') {
    const userInfo = JSON.parse(sessionStorage.getItem('user'));
    if (window.location.pathname.slice(1) === userInfo.username)
        document.getElementById("btnWrap").classList.remove("hide");
}

// for editing profile page
function editProfile(e) {
    if (e.target.innerText === "Edit Profile") {
        document.getElementById("profilePic").classList.add("editable");
        document.getElementById("bio").classList.add("editable");
        document.getElementById("deleteProfileBtn").classList.remove("hide");
        // document.getElementById("changePassBtn").classList.remove("hide");
        e.target.innerText = "Save Changes";
        bio.contentEditable = true;

        // for blinking cursor during edit
        bio.focus();
        let range = document.createRange();
        let selection = window.getSelection();
        range.selectNodeContents(bio);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        
        profileImage.contentEditable = true;
    }
    else {
        document.getElementById("profilePic").classList.remove("editable");
        document.getElementById("bio").classList.remove("editable");
        document.getElementById("deleteProfileBtn").classList.add("hide");
        // document.getElementById("changePassBtn").classList.add("hide");
        e.target.innerText = "Edit Profile";
        bio.contentEditable = false;
        profileImage.contentEditable = false;
    }
}
document.getElementById("editButton").addEventListener("click", editProfile);