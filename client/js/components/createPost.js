const discardPostBtn = document.getElementById('discardPostBtn');
const postModal = document.getElementById('postModal');
const postTextTitle = document.getElementById('postTextTitle');
const postTextContent = document.getElementById('postTextContent');
const postTextTagInput = document.getElementById('postTextTagInput');

function openCreatePostModal() {
    postModal.classList.remove('hide');
}

function closeCreatePostModal() {
    postModal.classList.add('hide');
    postTextTitle.value = '';
    postTextContent.value = '';
    postTextTitle.value = '';
    postTextTagInput.value = '';
}

function discardCreatePostModal() {
    postModal.classList.add('hide');
    postTextTitle.value = '';
    postTextContent.value = '';
    postTextTitle.value = '';
    postTextTagInput.value = '';
}

function uploadCreatePostModal() {
    postModal.classList.add('hide');
    postTextTitle.value = '';
    postTextContent.value = '';
    postTextTitle.value = '';
    postTextTagInput.value = '';
}
