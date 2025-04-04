function popup(message) {
    const alert = document.querySelector('.alert');
    alert.innerText = message;
    alert.classList.remove('hide');

    setTimeout(() => { alert.classList.add('hide'); }, 5000);
}

async function getPostData(postId) {
    try {
        const response = await fetch(`/getPostData?postId=${postId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });            

        const data = await response.json();
        const { title, content } = data;
        return { title, content };
    } catch (err) {
        console.error(err);
        return null;
    }
}  

export const postInjector = () => {
    document.querySelectorAll('.post-options-button').forEach(button => {
        button.addEventListener('click', () => {
            const menu = button.closest('.post').querySelector('.post-menu');
            document.querySelectorAll('.post-menu').forEach(m => {
                if (m !== menu) {
                    m.classList.add('hide');
                }
            });

            if (menu) {
                menu.classList.toggle('hide');
            }
        })
    });

    document.querySelectorAll('.post-options').forEach(element => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        if(!isLoggedIn){
            element.classList.add('hide');
        }
    });

    // View a Single Post
    document.querySelectorAll('.viewPost').forEach(button => {
        button.addEventListener('click', () => {
            const post = button.closest('.post');
            const postId = button.getAttribute('viewPostId');
            sessionStorage.setItem("viewPostId", postId);
        });
    });

    document.querySelectorAll('.post-info-text').forEach(async element => {
        const postId = element.getAttribute('itemId');
        const postDate = element.parentElement.querySelector('.post-date'); 
        const postEditDate = element.parentElement.querySelector('.post-edit');

        try{
            const response = await fetch('/checkIfEditedPost', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId })
            });            

            const data = await response.json();
            if (data.edited) { 
                postEditDate.classList.remove('hide');
            }
        } catch (err) {
            console.error(err);
        }
    });
    
    // Post Menu Button: Edit
    document.querySelectorAll('.editBtn').forEach(button => {
        button.addEventListener('click', async () => {
            const post = button.closest('.post');
            const postId = button.getAttribute('editPostId');
            sessionStorage.setItem("editPostId", postId);

            const postData = await getPostData(postId);
            if (postData) {
                document.getElementById('editPostTextTitle').value = postData.title;
                document.getElementById('editPostTextContent').value = postData.content;
            } else {
                popup("Post data not found.");
            }
    
            // Get the tags from the post and display them in the edit modal
            const tags = post.querySelectorAll('.post-tag');
            const editPostTagsContainer = document.getElementById('editPostTagList');
            editPostTagsContainer.innerHTML = ''; // Clear existing tags
    
            console.log(editPostTagsContainer.classList);

            if (tags.length !== 0) editPostTagsContainer.classList.remove('hide');
            tags.forEach(tag => {
                const tagElement = document.createElement('div');
                tagElement.className = 'tag';
                tagElement.innerHTML = `<div class="tagValue">${tag.innerText}</div><span onclick="removeTag(this)"><button class="remove-tag-button">&times;</button></span>`;
                editPostTagsContainer.appendChild(tagElement);
            });
    
            // Show the edit modal
            document.getElementById('editModal').classList.remove('hide');
    
            document.querySelectorAll('.remove-tag-button').forEach(removeButton => {
                removeButton.addEventListener('click', (e) => {
                    e.target.closest('.tag').remove();
                });
            });
        });
    });
    
    document.getElementById('editPostForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const userInfo = JSON.parse(sessionStorage.getItem('user'));
        let authorName;
        if(userInfo){
            authorName = userInfo.username;
        }
        const postId = sessionStorage.getItem('editPostId');
        const title = document.getElementById('editPostTextTitle').value.trim();
        const content = document.getElementById('editPostTextContent').value.trim();
        
        const tags = Array.from(document.querySelectorAll('#editPostTagList .tag .tagValue')).map(tag => tag.textContent.trim());
    
        try {
            const response = await fetch('/editPost', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, title, content, tags, authorName })
            });            

            const data = await response.json();
            if (!response.ok || !data.edited) {
                popup(data.message);
                console.error('Error:', data.message);
                document.getElementById('editModal').classList.remove('hide');
            } else {
                popup(data.message);
                sessionStorage.removeItem("editPostId");
                document.getElementById('editModal').classList.add('hide');
                document.getElementById('editModal').querySelector('.postText-tagArea').classList.add('hide');
                setTimeout(() => { window.location.reload(); }, 2000);
            }
        } catch (err) {
            console.error(err);
            popup("Editing post failed, try again later.");
        }
    });
    
    // Edit Post Button: Cancel
    document.getElementById('cancelPostBtn').addEventListener('click', () => {
        document.getElementById('editModal').classList.add('hide');
        document.getElementById('editModal').querySelector('.postText-tagArea').classList.add('hide');
        sessionStorage.removeItem("editPostId");
    });
    
    // Post Menu Button: Delete
    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', () => {
            const post = button.closest('.post');
            const postId = button.getAttribute('deletePostId');
            sessionStorage.setItem("deletePostId", postId);

            if (button.closest('.post'))
                document.getElementById('deletePostModal').classList.remove('hide')
        });
    });

    // Delete Post Modal Button: Delete
    document.querySelectorAll('.deletePostBtn').forEach(button => {
        button.addEventListener('click', async () => {
            const userInfo = JSON.parse(sessionStorage.getItem('user'));
            let authorName;
            if(userInfo){
                authorName = userInfo.username;
            }
            const postId = sessionStorage.getItem('deletePostId');
            try {
                const response = await fetch('/deletePost', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId, authorName })
                });            

                const data = await response.json();
                if (!response.ok) {
                    popup(data.message);
                    console.error('Error:', data.message);
                } else {
                    popup("Post deleted successfully!");
                    sessionStorage.removeItem("deletePostId");
                    document.getElementById('deletePostModal').classList.add('hide');
                    setTimeout(() => { window.location.reload(); }, 2000);
                }
            } catch (err) {
                console.error(err);
                popup("Deleting a post failed, try again later.");
            }
        });
    });

    // Delete Post Modal Button: Cancel
    document.querySelectorAll('.dlt-cancelPostBtn').forEach(button => {
        button.addEventListener('click', () => {
            sessionStorage.removeItem("deletePostId");
            document.getElementById('deletePostModal').classList.add('hide');
        });
    });
    
    // Close a modal when the close button is clicked
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal.querySelector('.postText-tagArea')) modal.querySelector('.postText-tagArea').classList.add('hide');
            modal.classList.add('hide');
        });
    });

    // Like Button
    document.querySelectorAll('.post-like').forEach(async button => {
        const userInfo = JSON.parse(sessionStorage.getItem('user'));
        if (userInfo) {
            const postId = button.getAttribute('postId');

            try {
                const response = await fetch(`/api/likedPosts?postId=${postId}&authorName=${encodeURIComponent(userInfo.username)}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    popup(errorData.message);
                    return
                }
    
                const data = await response.json();
                const icon = button.querySelector('.post-button-icon');
    
                if (data.liked) {
                    icon.classList.add('reacted');
                    button.setAttribute('liked', "true");
                } else {
                    icon.classList.remove('reacted');
                    button.setAttribute('liked', "false");
                }
    
            } catch (error) {
                console.error("Error toggling like:", error);
            }
        }

        // Function when Like button is clicked
        button.addEventListener('click', async () => {    
            const postId = button.getAttribute('postId');
            let liked = button.getAttribute('liked') === "true";
    
            try {
                const response = await fetch('/toggleLike', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId, authorName: userInfo.username })
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    popup(errorData.message);
                    return
                }
    
                const data = await response.json();
                const icon = button.querySelector('.post-button-icon');
                const likeCountElement = button.querySelector('.post-count');

                const postDislikeButton = button.closest('.post').querySelector('.post-dislike');
                const postDislikeIcon = postDislikeButton.querySelector('.post-button-icon');
                const dislikeCountElement = postDislikeButton.querySelector('.post-count');
    
                if (data.liked) {
                    icon.classList.add('reacted');
                    button.setAttribute('liked', "true");
                    postDislikeButton.setAttribute('liked', "false");
                    postDislikeIcon.classList.remove('reacted');
                } else {
                    icon.classList.remove('reacted');
                    button.setAttribute('liked', "false");
                }
    
                likeCountElement.textContent = data.likeCount > 0 ? data.likeCount : "Like";
                dislikeCountElement.textContent = data.dislikeCount > 0 ? data.dislikeCount : "Dislike";
    
            } catch (error) {
                console.error("Error toggling like:", error);
            }
        });
    }); 

    // Dislike Button
    document.querySelectorAll('.post-dislike').forEach(async button => {
        const userInfo = JSON.parse(sessionStorage.getItem('user'));
        if (userInfo) {
            const postId = button.getAttribute('postId');

            try {
                const response = await fetch(`/api/dislikedPosts?postId=${postId}&authorName=${encodeURIComponent(userInfo.username)}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    popup(errorData.message);
                    return
                }
    
                const data = await response.json();
                const icon = button.querySelector('.post-button-icon');
    
                if (data.disliked) {
                    icon.classList.add('reacted');
                    button.setAttribute('disliked', "true");
                } else {
                    icon.classList.remove('reacted');
                    button.setAttribute('disliked', "false");
                }
    
            } catch (error) {
                console.error("Error toggling dislike:", error);
            }
        }

        // Function when Dislike button is clicked
        button.addEventListener('click', async () => {
            const postId = button.getAttribute('postId');
            let liked = button.getAttribute('disliked') === "true";
    
            try {
                const response = await fetch('/toggleDisLike', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId, authorName: userInfo.username })
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    popup(errorData.message);
                    return
                }
    
                const data = await response.json();
                const icon = button.querySelector('.post-button-icon');
                const dislikeCountElement = button.querySelector('.post-count');

                const postLikeButton = button.closest('.post').querySelector('.post-like');
                const postLikeIcon = postLikeButton.querySelector('.post-button-icon');
                const likeCountElement = postLikeButton.querySelector('.post-count');
    
                if (data.disliked) {
                    icon.classList.add('reacted');
                    button.setAttribute('disliked', "true");
                    postLikeButton.setAttribute('liked', "false");
                    postLikeIcon.classList.remove('reacted');
                } else {
                    icon.classList.remove('reacted');
                    button.setAttribute('disliked', "false");
                }
    
                likeCountElement.textContent = data.likeCount > 0 ? data.likeCount : "Like";
                dislikeCountElement.textContent = data.dislikeCount > 0 ? data.dislikeCount : "Dislike";
    
            } catch (error) {
                console.error("Error toggling like:", error);
            }
        });
    });   
};