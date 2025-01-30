document.addEventListener('DOMContentLoaded', () => {
    fetch('../../html/components/nav.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
        })
        .catch(err => {
            console.error("Error loading navbar:", err);
        });
});

document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('postList');
    const createPostBtn = document.getElementById('createPostBtn');
    const postModal = document.getElementById('postModal');
    const closePostModal = document.querySelector('.close'); // Close button for post modal
    const uploadPostBtn = document.getElementById('uploadPostBtn');
    const discardPostBtn = document.getElementById('discardPostBtn');
    const postText = document.getElementById('postText');
    const editModal = document.getElementById('editModal');
    const editPostText = document.getElementById('editPostText');
    const doneEditBtn = document.getElementById('doneEditBtn');
    const closeEditModal = editModal.querySelector('.close'); // Close button for edit modal
    let currentPost;

    createPostBtn.onclick = function() {
        postModal.style.display = "block";
    }

    closePostModal.onclick = function() {
        postModal.style.display = "none";
        postText.value = '';
    }

    closeEditModal.onclick = function() {
        editModal.style.display = "none";
        editPostText.value = '';
        currentPost = null; // Reset currentPost when closing edit modal
    }

    uploadPostBtn.onclick = function() {
        const text = postText.value.trim();
        if (text) {
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            postDiv.textContent = text;

            const dropdown = document.createElement('div');
            dropdown.className = 'dropdown';
            dropdown.innerHTML = `
                <button>⋮</button>
                <div class="dropdown-content">
                    <button class="editBtn">Edit</button>
                    <button class="deleteBtn">Delete</button>
                </div>
            `;
            postDiv.appendChild(dropdown);
            postList.appendChild(postDiv);
            postText.value = '';
            postModal.style.display = "none";

            dropdown.querySelector('.editBtn').onclick = function() {
                currentPost = postDiv;
                editPostText.value = text;
                editModal.style.display = "block";
            }

            dropdown.querySelector('.deleteBtn').onclick = function() {
                postList.removeChild(postDiv);
            }
        }
    }

    doneEditBtn.onclick = function() {
        if (currentPost) {
            currentPost.firstChild.textContent = editPostText.value;
            editModal.style.display = "none";
            currentPost = null;
        }
    }

    discardPostBtn.onclick = function() {
        postModal.style.display = "none";
        postText.value = '';
    }
});