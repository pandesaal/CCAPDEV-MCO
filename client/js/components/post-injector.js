export const postInjector = () => {

    document.querySelectorAll('.post-options-button').forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.post').querySelector('.post-menu').classList.toggle('hide')
        })
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

            console.log("Post id: " + postId);
            console.log("dateEdited: " + data.dateEdited);
        } catch (err) {
            console.error(err);
        }
    });
    
    // Post Menu Button: Edit
    document.querySelectorAll('.editBtn').forEach(button => {
        button.addEventListener('click', () => {
            const post = button.closest('.post');
            const postId = button.getAttribute('editPostId');
            sessionStorage.setItem("editPostId", postId);

            const title = post.querySelector('.post-title h3').innerText;
            const content = post.querySelector('.post-content').innerText;
    
            document.getElementById('editPostTextTitle').value = title;
            document.getElementById('editPostTextContent').value = content;
    
            // Get the tags from the post and display them in the edit modal
            const tags = post.querySelectorAll('.post-tag');
            const editPostTagsContainer = document.getElementById('editPostTagList');
            editPostTagsContainer.innerHTML = ''; // Clear existing tags
    
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
                    e.target.closest('.tag').remove(); // Remove the tag element
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
            if (!response.ok) {
                alert(data.message);
                console.error('Error:', data.message);
            } else {
                alert("Post updated successfully!");
                console.log('Post updated successfully:', data);
                sessionStorage.removeItem("editPostId");
                document.getElementById('editModal').classList.add('hide');
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
            alert("Editing post failed, try again later.");
        }
    });
    
    // Edit Post Button: Cancel
    document.getElementById('cancelPostBtn').addEventListener('click', () => {
        document.getElementById('editModal').classList.add('hide');
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
                    alert(data.message);
                    console.error('Error:', data.message);
                } else {
                    alert("Post deleted successfully!");
                    console.log('Post deleted successfully:', data);
                    sessionStorage.removeItem("deletePostId");
                    document.getElementById('deletePostModal').classList.add('hide');
                    window.location.reload();
                }
            } catch (err) {
                console.error(err);
                alert("Deleting a post failed, try again later.");
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
                    alert(errorData.message);
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


        button.addEventListener('click', async () => {
            const userInfo = JSON.parse(sessionStorage.getItem('user'));
            if (!userInfo) {
                alert("Log in to like a post.");
                return;
            }
    
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
                    alert(errorData.message);
                    return
                }
    
                const data = await response.json();
                const icon = button.querySelector('.post-button-icon');
                const likeCountElement = button.querySelector('.post-count');
    
                if (data.liked) {
                    icon.classList.add('reacted');
                    button.setAttribute('liked', "true");
                } else {
                    icon.classList.remove('reacted');
                    button.setAttribute('liked', "false");
                }
    
                likeCountElement.textContent = data.likeCount > 0 ? data.likeCount : "Like";
    
            } catch (error) {
                console.error("Error toggling like:", error);
            }
        });
    });    
};