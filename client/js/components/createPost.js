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

// addTag() funxtion for Create Post and Edit Post Features
function addTag(input, list) {
    let tagInput = document.getElementById(input);
    let tagValue = tagInput.value.trim();

    if (tagValue === "") return;

    // Create tag element
    let tagElement = document.createElement("div");
    tagElement.className = "tag";
    tagElement.innerHTML = `${tagValue}<span onclick="removeTag(this)"><button class="remove-tag-button">×</button></span>`;

    // Append tag to tagsArea
    document.getElementById(list).appendChild(tagElement);

    // Clear input field
    tagInput.value = "";
}

function removeTag(element) {
    element.parentElement.remove();
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