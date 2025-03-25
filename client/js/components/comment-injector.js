export const commentInjector = () => {
    document.querySelectorAll('.comment-info-text').forEach(async element => {
        const commentId = element.getAttribute('itemId');
        const commentDate = element.parentElement.querySelector('.comment-date'); 
        const commentEditDate = element.parentElement.querySelector('.comment-edit');

        try{
            const response = await fetch('/checkIfEditedComment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentId })
            });            

            const data = await response.json();
            if (data.edited) { 
                commentEditDate.classList.remove('hide');
            }
        } catch (err) {
            console.error(err);
        }
    });

    document.querySelectorAll('.comment-options-button').forEach(async button => {
        button.addEventListener('click', async (e) => {
            const comment = button.closest('.comment');
            if (e.target.textContent === 'more_horiz') {
                comment.querySelector('.comment-menu').classList.toggle('hide'); // opens menu if it's the "..." icon
            }
            else if (e.target.textContent === 'done_outline') { // Saves the edited comment
                const contentDiv = comment.querySelector('.comment-content');
                contentDiv.classList.remove('editable');
                const newContent = contentDiv.innerText.trim();
                const commentId = comment.querySelector('.editCommBtn').getAttribute('editCommentId');
                const postId = sessionStorage.getItem('viewPostId');
                const userInfo = JSON.parse(sessionStorage.getItem('user'));
                let authorName;
                if (userInfo) {
                    authorName = userInfo.username;
                }

                try {
                    const response = await fetch('/editComment', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ commentId, postId, authorName, content: newContent })
                    });

                    const data = await response.json();
                    if (!response.ok) {
                        alert(data.message);
                        console.error('Error:', data.message);
                        return;
                    }

                    // Hide "done_outline" and show "more_horiz" again
                    Array.from(comment.querySelectorAll('.comment-options-button'))
                        .find(btn => btn.textContent === 'done_outline')
                        .classList.add('hide');
                    
                    Array.from(comment.querySelectorAll('.comment-options-button'))
                        .find(btn => btn.textContent === 'more_horiz')
                        .classList.remove('hide');

                    // Remove contenteditable and show "Edited" label
                    contentDiv.setAttribute('contenteditable', 'false');
                    comment.querySelector('.comment-edit').classList.remove('hide');

                    alert("Comment updated successfully!");

                } catch (err) {
                    console.error(err);
                    alert("Updating the comment failed, try again later.");
                }
            }
        });
    });

    // edit comment
    document.querySelectorAll('.editCommBtn').forEach(button => {
        button.addEventListener('click', (e) => {
            const comment = button.closest('.comment');

            const hiddenButton = comment.querySelector('.comment-options-button.hide');

            // Hide the "more_horiz" and show the "done_outline"
            comment.querySelector('.comment-options-button').classList.add('hide');
            comment.querySelector('.comment-menu').classList.add('hide');

            // Make the comment content editable
            const content = comment.querySelector('.comment-content');
            content.setAttribute('contentEditable', 'true');  // Make content editable
            content.classList.add('editable');
            content.focus();  // Focus on the content

            // Set cursor to the end of the content
            let range = document.createRange();
            let selection = window.getSelection();
            range.selectNodeContents(content);
            range.collapse(false);  // Move the cursor to the end
            selection.removeAllRanges();
            selection.addRange(range);

            // Show the hidden "done_outline" button
            hiddenButton.classList.remove('hide');
        });
    });

    document.querySelectorAll('.deleteCommBtn').forEach(button => {
        button.addEventListener('click', (e) => {
            const comment = button.closest('.comment');
            const commentId = button.getAttribute('deleteCommentId');
            sessionStorage.setItem("deleteCommentId", commentId);

            if (button.closest('.comment'))
                document.getElementById('deleteCommentModal').classList.remove('hide');
        });
    });

    // Delete Comment Modal Button: Delete
    document.querySelectorAll('.deleteCommentBtn').forEach(button => {
        button.addEventListener('click', async () => {
            const userInfo = JSON.parse(sessionStorage.getItem('user'));
            let authorName;
            if(userInfo){
                authorName = userInfo.username;
            }
            const postId = sessionStorage.getItem('viewPostId');
            const commentId = sessionStorage.getItem('deleteCommentId');
            try {
                const response = await fetch('/deleteComment', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ commentId, postId, authorName })
                });            

                const data = await response.json();
                if (!response.ok) {
                    alert(data.message);
                    console.error('Error:', data.message);
                } else {
                    alert("Comment deleted successfully!");
                    sessionStorage.removeItem("deleteCommentId");
                    document.getElementById('deleteCommentModal').classList.add('hide');
                    window.location.reload();
                }
            } catch (err) {
                console.error(err);
                alert("Deleting a comment failed, try again later.");
            }
        });
    });

    // Delete Comment Modal Button: Cancel
    document.querySelectorAll('.dlt-cancelCommentBtn').forEach(button => {
        button.addEventListener('click', () => {
            sessionStorage.removeItem("deleteCommentId");
            document.getElementById('deleteCommentModal').classList.add('hide');
        });
    });

    // Like Button
    document.querySelectorAll('.comment-like').forEach(async button => {
        const userInfo = JSON.parse(sessionStorage.getItem('user'));
        if (userInfo) {
            const commentId = button.getAttribute('commentId');

            try {
                const response = await fetch(`/api/likedComments?commentId=${commentId}&authorName=${encodeURIComponent(userInfo.username)}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    alert(errorData.message);
                    return
                }
    
                const data = await response.json();
                const icon = button.querySelector('.comment-button-icon');
    
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
            const commentId = button.getAttribute('commentId');
            let liked = button.getAttribute('liked') === "true";
    
            try {
                const response = await fetch('/toggleLikeComment', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ commentId, authorName: userInfo.username })
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    alert(errorData.message);
                    return
                }
    
                const data = await response.json();
                const icon = button.querySelector('.comment-button-icon');
                const likeCountElement = button.querySelector('.comment-count');

                const commentDislikeButton = button.closest('.comment').querySelector('.comment-dislike');
                const commentDislikeIcon = commentDislikeButton.querySelector('.comment-button-icon');
                const dislikeCountElement = commentDislikeButton.querySelector('.comment-count');
    
                if (data.liked) {
                    icon.classList.add('reacted');
                    button.setAttribute('liked', "true");
                    commentDislikeButton.setAttribute('liked', "false");
                    commentDislikeIcon.classList.remove('reacted');
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
    document.querySelectorAll('.comment-dislike').forEach(async button => {
        const userInfo = JSON.parse(sessionStorage.getItem('user'));
        if (userInfo) {
            const commentId = button.getAttribute('commentId');

            try {
                const response = await fetch(`/api/dislikedComments?commentId=${commentId}&authorName=${encodeURIComponent(userInfo.username)}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    alert(errorData.message);
                    return
                }
    
                const data = await response.json();
                const icon = button.querySelector('.comment-button-icon');
    
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
            const commentId = button.getAttribute('commentId');
            let liked = button.getAttribute('disliked') === "true";
    
            try {
                const response = await fetch('/toggleDisLikeComment', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ commentId, authorName: userInfo.username })
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    alert(errorData.message);
                    return
                }
    
                const data = await response.json();
                const icon = button.querySelector('.comment-button-icon');
                const dislikeCountElement = button.querySelector('.comment-count');

                const commentLikeButton = button.closest('.comment').querySelector('.comment-like');
                const commentLikeIcon = commentLikeButton.querySelector('.comment-button-icon');
                const likeCountElement = commentLikeButton.querySelector('.comment-count');
    
                if (data.disliked) {
                    icon.classList.add('reacted');
                    button.setAttribute('disliked', "true");
                    commentLikeButton.setAttribute('liked', "false");
                    commentLikeIcon.classList.remove('reacted');
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

    document.querySelectorAll('.comment-reply').forEach(button => {
        button.addEventListener('click', () => {
            const commentId = button.getAttribute('commentId');
            const replyInputBox = document.querySelector(`.reply-input-box[commentId="${commentId}"]`);
            
            document.querySelectorAll('.reply-input-box').forEach(box => {
                if (box !== replyInputBox) {
                    box.classList.add('hide');
                }
            });
            
            if (replyInputBox) {
                replyInputBox.classList.toggle('hide');
            }
        });
    });

    // replying to a comment
    document.querySelectorAll('.createReplyForm').forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const formData = new FormData(form);
            const commentId = form.getAttribute('commentId'); 
            const content = formData.get('reply-content'); 

            const userInfo = JSON.parse(sessionStorage.getItem('user'));
            let authorName;
            if(userInfo){
                authorName = userInfo.username;
            }
            
            if (!content.trim()) {
                alert("Reply content cannot be empty.");
                return;
            }

            const replyToRefPath = 'Comment';

            try {
                const response = await fetch('/createComment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        authorName: authorName,
                        postId: commentId,
                        content: content,
                        replyToRefPath: replyToRefPath
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    alert("Comment uploaded successfully!");
                    window.location.reload(); 
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error(err);
                alert("Uploading a comment failed, try again later.");
            }
        });
    });

};