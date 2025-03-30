const discardPostBtn = document.getElementById('discardPostBtn');
const postModal = document.getElementById('postModal');
const postTextTitle = document.getElementById('postTextTitle');
const postTextContent = document.getElementById('postTextContent');
const postTextTagList = document.getElementById('createPostTagList');
const postTextTagInput = document.getElementById('createPostTagInput');

function popup(message) {
    const alert = document.querySelector('.alert');
    alert.innerText = message;
    alert.classList.remove('hide');

    setTimeout(() => { alert.classList.add('hide'); }, 5000);
}

function openCreatePostModal() {
    postModal.classList.remove('hide');
}

function closeCreatePostModal() {
    postModal.classList.add('hide');
    postTextTitle.value = '';
    postTextContent.value = '';
    postTextTagList.innerHTML = '';
    postTextTagInput.value = '';
}

// addTag() function for Create Post and Edit Post Features
function addTag(input, list) {
    let tagInput = document.getElementById(input);
    let tagValue = tagInput.value.trim();

    if (tagValue === "") return;

    // Create tag element
    let tagElement = document.createElement("div");
    tagElement.className = "tag";
    tagElement.innerHTML = `<div class="tagValue">${tagValue}</div><span onclick="removeTag(this)"><button class="remove-tag-button">&times;</button></span>`;

    // Append tag to tagsArea
    document.getElementById(list).classList.remove('hide');
    document.getElementById(list).appendChild(tagElement);

    // Clear input field
    tagInput.value = "";
}

function removeTag(element) {
    if (element.parentElement.parentElement.children.length - 1 == 0) {
        element.parentElement.parentElement.classList.add('hide');
    }

    element.parentElement.remove();
}

function discardCreatePostModal() {
    postModal.classList.add('hide');
    postTextTitle.value = '';
    postTextContent.value = '';
    postTextTagList.innerHTML = '';
    postTextTagList.classList.add('hide');
    postTextTagInput.value = '';
}

function uploadCreatePostModal() {
    postModal.classList.add('hide');
    postTextTagList.classList.add('hide');
    
    postTextTitle.value = '';
    postTextContent.value = '';
    postTextTagList.innerHTML = '';
    postTextTagInput.value = '';
}

document.getElementById('createPostForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const userInfo = JSON.parse(sessionStorage.getItem('user'));
    const authorName = userInfo.username;
    const title = document.querySelector('[name="postTextTitle"]').value.trim();
    const content = document.querySelector('[name="postTextContent"]').value.trim(); 
    
    const tags = Array.from(document.querySelectorAll('.postText-tagArea .tag .tagValue')).map(tag => tag.textContent.trim());

    try {
        const response = await fetch('/createPost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ authorName, title, content, tags }) 
        });

        const data = await response.json();
        if (response.ok) {
            popup("Post uploaded successfully!");
            uploadCreatePostModal(); 
            setTimeout(() => { window.location.replace('/'); }, 2000); 
        } else {
            popup(data.message);
        }
    } catch (err) {
        console.error(err);
        popup("Uploading a post failed, try again later.");
    }
});