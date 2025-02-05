const createPostBtn = document.getElementById('createPostBtn');
const closePostModal = document.querySelector('.close'); // Close button for post modal
const discardPostBtn = document.getElementById('discardPostBtn');
const postModal = document.getElementById('postModal');
const postText = document.getElementById('postText');

createPostBtn.onclick = function() {
    postModal.classList.remove('hide');
}

closePostModal.onclick = function() {
    postModal.classList.add('hide');
    postText.value = '';
}

discardPostBtn.onclick = function() {
    postModal.classList.add('hide');
    postText.value = '';
}