import { navInjector } from "../components/nav-injector.js";
import { postInjector } from "../components/post-injector.js";

document.addEventListener('DOMContentLoaded', () => {

    navInjector();
    postInjector();
});

// shows edit profile buttons when it's logged-in user's profile
if (sessionStorage.getItem('isLoggedIn') === 'true') {
    const userInfo = JSON.parse(sessionStorage.getItem('user'));
    const paths = window.location.pathname.split('/');
    const username = paths[2];
    if (username === userInfo.username)
        document.getElementById("btnWrap").classList.remove("hide");
}

function viewState() {
    document.getElementById("profilePic").classList.remove("editable");
    document.getElementById("bio").classList.remove("editable");
    document.getElementById("deleteProfileBtn").classList.add("hide");
    // document.getElementById("changePassBtn").classList.add("hide");
    document.getElementById("editIconBtn").classList.add("hide");
    document.getElementById("discardChangesBtn").classList.add("hide");
    document.getElementById("editButton").innerText = "Edit Profile";
    bio.contentEditable = false;
}

let originalBio = document.getElementById('bio').innerHTML;
let originalIcon = document.getElementById('profilePic').src;
let changedIcon = false;

// for editing profile page
async function editProfile(e) {
    if (e.target.innerText === "Edit Profile") {
        document.getElementById("profilePic").classList.add("editable");
        document.getElementById("bio").classList.add("editable");
        document.getElementById("deleteProfileBtn").classList.remove("hide");
        // document.getElementById("changePassBtn").classList.remove("hide");
        document.getElementById("editIconBtn").classList.remove("hide");
        document.getElementById("discardChangesBtn").classList.remove("hide");
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
    }
    else { // save changes
        viewState();
        const bio = document.getElementById("bio").innerText;
        const fileInput = document.getElementById("uploadIconInput");
        const icon = fileInput.files[0]; 

        const formData = new FormData();
        formData.append('bio', bio);
        formData.append('username', JSON.parse(sessionStorage.getItem('user')).username);
        if (changedIcon) {
            formData.append('icon', icon); 
        }
        
        try {
            const response = await fetch("/editUser", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            const result = await response.json();
            const userInfo = JSON.parse(sessionStorage.getItem('user'));
            if (changedIcon) {
                userInfo.icon = result.icon;
                sessionStorage.setItem('user', JSON.stringify(userInfo));
            }

            originalBio = bio;
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile. Please try again.");
        }

        if (changedIcon) {
            const match = originalIcon.match(/\/image\/([a-zA-Z0-9]+)/);
            const imageId = match[1];
            if (!(imageId === '67caf0890c6cb1c003672e7c')) { // default icon
                try {
                    const response = await fetch("/deleteFile", {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ imageId })
                    });

                    await response.json();
                    if (response.ok) {

                        changedIcon = false;
                    }
                } catch (error) {
                    console.error("Error deleting file:", error);
                    alert(error);
                }
            }
        }

        window.location.reload();
    }
}
document.getElementById("editButton").addEventListener("click", editProfile);

document.getElementById('discardChangesBtn').addEventListener('click', () => {
    document.getElementById('bio').innerHTML = originalBio;
    document.getElementById('profilePic').src = originalIcon;
    changedIcon = false;
    viewState();
});

document.getElementById('editIconBtn').addEventListener('click', () => {
    document.getElementById('uploadIconInput').click();
});

document.getElementById('uploadIconInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalIcon = document.getElementById('profilePic').src;
            document.getElementById('profilePic').src = e.target.result;
            changedIcon = true;
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload a PNG or JPEG image.');
    }
});

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