const getRandomDate = (startYear, endYear) => {
    const start = new Date(startYear, 0, 1).getTime();
    const end = new Date(endYear, 11, 31).getTime();
    const randomTimestamp = Math.random() * (end - start) + start;
    const randomDate = new Date(randomTimestamp);
    return randomDate.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

export const posts = [
    {
        id: 1,
        username: 'User12345',
        title: "Stressed Over Finals",
        content: "Feeling the pressure with finals coming up. Anyone else? How do you manage the stress?",
        datePosted: getRandomDate(2020, 2025),
        likes: 15,
        tags: ["finals", "stress", "study"]
    },
    {
        id: 2,
        username: 'study_hard_24',
        title: "Late-Night Study Sessions",
        content: "Just pulled an all-nighter. I feel like I can't function properly without coffee now. Who else is on this grind?",
        datePosted: getRandomDate(2020, 2025),
        likes: 12,
        tags: ["study", "coffee", "latenight"]
    },
    {
        id: 3,
        username: 'User12345',
        title: "Group Projects Are the Worst",
        content: "Why does it always feel like the workload is uneven in group projects? It's so frustrating when no one pulls their weight.",
        datePosted: getRandomDate(2020, 2025),
        likes: 22,
        tags: ["group project", "frustration", "workload"]
    },
    {
        id: 4,
        username: 'artistic_angel',
        title: "Stress Relief Through Art",
        content: "Whenever I'm overwhelmed with school work, I turn to drawing. It helps me relax and recharge. Anyone else use art as an escape?",
        datePosted: getRandomDate(2020, 2025),
        likes: 18,
        tags: ["art", "stress relief", "creativity"]
    },
    {
        id: 5,
        username: 'study_squad',
        title: "Time Management Tips",
        content: "Got any advice on how to balance school and personal life? I need a good routine to stick to.",
        datePosted: getRandomDate(2020, 2025),
        likes: 8,
        tags: ["timemanagement", "schoollife", "routine"]
    }
];

// ===== New: Comment Functionality Global Variables =====
const currentUser = "User12345"; // Adjust as needed for the logged-in user
let commentsByPost = {};       // Store comments for each post by post id

/**
 * Recursively render comments (and nested replies) into a container.
 * @param {Array} comments - Array of comment objects.
 * @param {number|null} parentId - Parent comment's id (null for top-level).
 * @param {HTMLElement} container - Container to render comments into.
 */
function renderComments(comments, parentId = null, container) {
    container.innerHTML = "";
    comments
        .filter(comment => comment.parentId === parentId)
        .forEach(comment => {
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comment");
            commentDiv.dataset.commentId = comment.id;
            commentDiv.innerHTML = `
        <div class="comment-header">
          <strong>${comment.user}</strong>
          <span>${new Date(comment.timestamp).toLocaleString()}</span>
        </div>
        <div class="comment-body">${comment.text}${comment.edited ? " (edited)" : ""}</div>
        <div class="comment-actions">
          <button class="reply-btn">Reply</button>
          ${comment.user === currentUser ? `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          ` : ""}
        </div>
        <div class="nested-comments"></div>
      `;
            container.appendChild(commentDiv);
            const nestedContainer = commentDiv.querySelector(".nested-comments");
            renderComments(comments, comment.id, nestedContainer);
        });
}

export const postInjector = (postsArray = posts) => {
    const postsContainer = document.getElementById('posts-wrapper');
    postsContainer.innerHTML = "";

    fetch('../../html/components/post.html')
        .then(response => response.text())
        .then(template => {
            // Replace template placeholders with post data
            let allPostsString = postsArray.map(post =>
                template
                    .replace('{{post-id}}', post.id)
                    .replace('{{username}}', post.username)
                    .replace('{{date-posted}}', post.datePosted)
                    .replace('{{post-title}}', post.title)
                    .replace('{{post-content}}', post.content)
                    .replace('{{post-tags}}', post.tags.map(tag => {
                        return `<a href="#" class="post-tag">${tag}</a>`;
                    }).join(''))
            ).join('');

            // Create a DocumentFragment from the template string and append it
            const allPostsHTML = document.createRange().createContextualFragment(allPostsString);
            postsContainer.appendChild(allPostsHTML);

            // Attach event listeners for post options (unchanged)
            document.querySelectorAll('.post-options-button').forEach(button => {
                button.addEventListener('click', () => {
                    button.closest('.post').querySelector('.post-menu').classList.toggle('hide');
                });
            });

            // Truncate post content if needed
            document.querySelectorAll('.post-content').forEach(post => {
                const maxLength = 200;
                const originalText = post.innerText;
                if (originalText.length > maxLength) {
                    const truncatedText = originalText.substring(0, maxLength) + '... ';
                    post.innerHTML = post.innerHTML.replace(post.innerText, truncatedText);
                    const readMore = post.querySelector('.content-readmore');
                    if (readMore) {
                        readMore.classList.remove('hide');
                        readMore.addEventListener('click', () => {
                            readMore.classList.add('hide');
                            post.innerHTML = post.innerHTML.replace(truncatedText, originalText);
                        });
                    }
                }
            });

            // Attach event listeners for toggling each post's comment section
            document.querySelectorAll('.comment-btn').forEach(button => {
                button.addEventListener('click', () => {
                    // Find the parent .post element, then the comment section inside it
                    const postElem = button.closest('.post');
                    const commentSection = postElem.querySelector('.comments-wrapper');
                    commentSection.classList.toggle('hide');
                });
            });

            // Attach event listener for comment form submission for each post
            document.querySelectorAll('.comment-form').forEach(form => {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const postElem = form.closest('.post');
                    const postId = postElem.getAttribute('data-post-id');
                    // Initialize comments array for this post if not present
                    if (!commentsByPost[postId]) {
                        commentsByPost[postId] = [];
                    }
                    const commentInput = form.querySelector('.comment-input');
                    const text = commentInput.value.trim();
                    if (text !== "") {
                        const newComment = {
                            id: Date.now(),
                            text: text,
                            user: currentUser,
                            parentId: null,  // top-level comment
                            timestamp: Date.now(),
                            edited: false
                        };
                        commentsByPost[postId].push(newComment);
                        commentInput.value = "";
                        const commentsContainer = postElem.querySelector('.commentsList');
                        renderComments(commentsByPost[postId], null, commentsContainer);
                    }
                });
            });

            // Delegate events for reply, edit, and delete on comments for each post
            document.querySelectorAll('.commentsList').forEach(list => {
                list.addEventListener('click', function(e) {
                    const commentDiv = e.target.closest('.comment');
                    if (!commentDiv) return;
                    // Find the post element and its id
                    const postElem = list.closest('.post');
                    const postId = postElem.getAttribute('data-post-id');
                    const currentComments = commentsByPost[postId] || [];
                    const commentId = parseInt(commentDiv.dataset.commentId, 10);

                    if (e.target.classList.contains('reply-btn')) {
                        const replyText = prompt("Enter your reply:");
                        if (replyText && replyText.trim() !== "") {
                            const newReply = {
                                id: Date.now(),
                                text: replyText.trim(),
                                user: currentUser,
                                parentId: commentId,
                                timestamp: Date.now(),
                                edited: false
                            };
                            currentComments.push(newReply);
                            renderComments(currentComments, null, list);
                        }
                    } else if (e.target.classList.contains('edit-btn')) {
                        const commentToEdit = currentComments.find(c => c.id === commentId);
                        if (commentToEdit && commentToEdit.user === currentUser) {
                            const newText = prompt("Edit your comment:", commentToEdit.text);
                            if (newText && newText.trim() !== "") {
                                commentToEdit.text = newText.trim();
                                commentToEdit.edited = true;
                                renderComments(currentComments, null, list);
                            }
                        }
                    } else if (e.target.classList.contains('delete-btn')) {
                        if (confirm("Are you sure you want to delete this comment?")) {
                            commentsByPost[postId] = currentComments.filter(c => c.id !== commentId);
                            renderComments(commentsByPost[postId], null, list);
                        }
                    }
                });
            });
        })
        .catch(err => {
            console.error("Error loading post template:", err);
        });
};
