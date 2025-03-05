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
        document.getElementById("editIconBtn").classList.remove("hide");
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
    else { // save changes
        document.getElementById("profilePic").classList.remove("editable");
        document.getElementById("bio").classList.remove("editable");
        document.getElementById("deleteProfileBtn").classList.add("hide");
        // document.getElementById("changePassBtn").classList.add("hide");
        document.getElementById("editIconBtn").classList.add("hide");
        e.target.innerText = "Edit Profile";
        bio.contentEditable = false;
        profileImage.contentEditable = false;
    }
}
document.getElementById("editButton").addEventListener("click", editProfile);

// for switching of tabs
const profilePosts = document.getElementById('profilePosts');
const profileComments = document.getElementById('profileComments');
const postsTab = document.getElementById('postsTab');
const commentsTab = document.getElementById('commentsTab');

document.getElementById('postsTab').addEventListener('click', () => {
    profilePosts.classList.remove('hide');
    profileComments.classList.add('hide');
    postsTab.classList.add('selected');
    commentsTab.classList.remove('selected');
});

document.getElementById('commentsTab').addEventListener('click', () => {
    profilePosts.classList.add('hide');
    profileComments.classList.remove('hide');
    postsTab.classList.remove('selected');
    commentsTab.classList.add('selected');
});

async function deleteProfile(e) {
    // ADD CONFIRMATION MODAL
    const username = JSON.parse(sessionStorage.getItem('user')).username;
    try {
        const response = await fetch('/deleteUser', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });            

        const data = await response.json();
        if (!response.ok) {
            alert(data.message);
        } else {
            sessionStorage.setItem('isLoggedIn', false);
            sessionStorage.removeItem('user');
            window.location.replace('/');
        }
    } catch (err) {
        alert("Deleting user failed, try again later.");
    }
}
document.getElementById('deleteProfileBtn').addEventListener('click', deleteProfile);