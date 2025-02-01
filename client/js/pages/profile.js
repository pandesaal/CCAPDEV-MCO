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