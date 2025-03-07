export const commentInjector = () => {
    document.querySelectorAll('.comment-options-button').forEach(async button => {
        if (button.textContent === 'more_horiz') {
            const userInfo = JSON.parse(sessionStorage.getItem('user'));
            let currentUserName; 
            if(userInfo){
                currentUserName = userInfo.username;
            }
            const authorId = button.getAttribute('authorId');

            try{
                const response = await fetch('/checkCommentAccess', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ currentUserName, authorId })
                });            

                const data = await response.json();
                if (response.ok) {
                    if (!data) { 
                        button.classList.add('hide');
                    }
                } else {
                    button.classList.add('hide');
                }
            } catch (err) {
                console.error(err);
            }
        }

        button.addEventListener('click', async (e) => {
            const comment = button.closest('.comment');
            if (e.target.textContent === 'more_horiz') {
                comment.querySelector('.comment-menu').classList.toggle('hide'); // opens menu if it's the "..." icon
            }
            else if (e.target.textContent === 'done_outline') { // Saves the edited comment
                const contentDiv = comment.querySelector('.comment-content');
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
                    console.log('Comment deleted successfully:', data);
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
};

/*
const getRandomDate = (startYear, endYear) => {
    const start = new Date(startYear, 0, 1).getTime();
    const end = new Date(endYear, 11, 31).getTime();
    const randomTimestamp = Math.random() * (end - start) + start;
    const randomDate = new Date(randomTimestamp);
    return randomDate.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

export const comments = [
    {
      id: 1,
      username: 'User12345',
      content: "Feeling the pressure with finals coming up. Anyone else? How do you manage the stress?",
      datePosted: getRandomDate(2020, 2025),
      likes: 15
    },
    {
      id: 2,
      username: 'study_hard_24',
      content: "Just pulled an all-nighter. I feel like I can't function properly without coffee now. Who else is on this grind?",
      datePosted: getRandomDate(2020, 2025),
      likes: 12
    },
    {
      id: 3,
      username: 'User12345',
      content: "Why does it always feel like the workload is uneven in group projects? It's so frustrating when no one pulls their weight.",
      datePosted: getRandomDate(2020, 2025),
      likes: 22
    },
    {
      id: 4,
      username: 'artistic_angel',
      content: "Whenever I'm overwhelmed with school work, I turn to drawing. It helps me relax and recharge. Anyone else use art as an escape?",
      datePosted: getRandomDate(2020, 2025),
      likes: 18
    },
    {
      id: 5,
      username: 'study_squad',
      content: "Got any advice on how to balance school and personal life? I need a good routine to stick to.",
      datePosted: getRandomDate(2020, 2025),
      likes: 8
    }
];
*/