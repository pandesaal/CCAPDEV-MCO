import { navInjector } from "../components/nav-injector.js";
import { postInjector, posts } from "../components/post-injector.js";

document.addEventListener('DOMContentLoaded', () => {

    const filteredPosts = posts.filter(post => post.username === 'User12345')

    navInjector();
    postInjector(filteredPosts);
});

// for editing profile page
function editProfile(e) {
    if (e.target.innerText === "Edit Profile") {
        document.getElementById("profilePic").classList.add("editable");
        document.getElementById("bio").classList.add("editable");
        document.getElementById("deleteProfileBtn").classList.remove("hide");
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
        e.target.innerText = "Edit Profile";
        bio.contentEditable = false;
        profileImage.contentEditable = false;
    }
}
document.getElementById("editButton").addEventListener("click", editProfile);