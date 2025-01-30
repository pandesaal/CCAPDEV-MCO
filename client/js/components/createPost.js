document.addEventListener('DOMContentLoaded', () => {
    const createPostBtn = document.getElementById('createPostBtn');
    const closePostModal = document.querySelector('.close'); // Close button for post modal
    const discardPostBtn = document.getElementById('discardPostBtn');
    const postModal = document.getElementById('postModal');
    const postText = document.getElementById('postText');

    createPostBtn.onclick = function() {
        postModal.style.display = "block";
    }

    closePostModal.onclick = function() {
        postModal.style.display = "none";
        postText.value = '';
    }

    discardPostBtn.onclick = function() {
        postModal.style.display = "none";
        postText.value = '';
    }
});