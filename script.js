let currentPostId = null;
let currentUser = "User"; // Current user submitting comments

// Hardcoded Posts with Tags and Communities
const posts = [
  {
    id: 1,
    title: "How to Learn JavaScript",
    snippet: "Tips and tricks for mastering JavaScript...",
    content: "JavaScript is a powerful language used for web development.",
    likes: 10,
    tags: ["javascript"],
    community: "frontend"
  },
  {
    id: 2,
    title: "Best Coding Practices",
    snippet: "Write clean and maintainable code...",
    content: "Always comment your code and follow proper indentation.",
    likes: 15,
    tags: ["general"],
    community: "backend"
  },
  {
    id: 3,
    title: "Understanding Asynchronous Programming",
    snippet: "What is async and await?",
    content: "Asynchronous programming allows tasks to run in the background.",
    likes: 20,
    tags: ["javascript"],
    community: "frontend"
  },
  {
    id: 4,
    title: "React vs Vue: Which is Better?",
    snippet: "Comparison of the two leading front-end frameworks...",
    content: "Both React and Vue have their advantages...",
    likes: 8,
    tags: ["react", "vue"],
    community: "frontend"
  },
  {
    id: 5,
    title: "How to Ace Coding Interviews",
    snippet: "Top tips for technical interviews...",
    content: "Practice coding questions, understand algorithms...",
    likes: 12,
    tags: ["interview"],
    community: "fullstack"
  },
];

// Hardcoded Comments with Nested Replies
const comments = {
  1: [
    { id: 1, text: "This was super helpful, thanks!", user: "Alice", parentId: null },
    { id: 2, text: "I struggled with closures, but this article made it clear.", user: "Bob", parentId: null },
    { id: 3, text: "Glad it helped!", user: "Alice", parentId: 1 },
    { id: 4, text: "I learned a lot from this post.", user: "Charlie", parentId: null },
    { id: 5, text: "Great explanation of closures!", user: "David", parentId: 2 }
  ],
  2: [
    { id: 6, text: "I follow these rules in my daily work.", user: "Charlie", parentId: null },
    { id: 7, text: "Clean code is essential for maintainability.", user: "Alice", parentId: null },
    { id: 8, text: "I agree with this post.", user: "Bob", parentId: null },
    { id: 9, text: "What about using linters?", user: "David", parentId: 7 },
    { id: 10, text: "Linters are a great tool!", user: "Eve", parentId: 9 }
  ],
  3: [
    { id: 11, text: "Async/Await changed my life!", user: "Alice", parentId: null },
    { id: 12, text: "I still prefer Promises.", user: "Bob", parentId: null },
    { id: 13, text: "Why do you prefer Promises?", user: "Charlie", parentId: 12 },
    { id: 14, text: "Async/Await is easier to read.", user: "David", parentId: null },
    { id: 15, text: "I agree with David.", user: "Eve", parentId: 14 }
  ],
  4: [
    { id: 16, text: "React's ecosystem is just too big to ignore.", user: "Alice", parentId: null },
    { id: 17, text: "Vue is simpler to learn.", user: "Bob", parentId: null },
    { id: 18, text: "I prefer React for large projects.", user: "Charlie", parentId: null },
    { id: 19, text: "Vue is great for small projects.", user: "David", parentId: 17 },
    { id: 20, text: "I agree with David.", user: "Eve", parentId: 19 }
  ],
  5: [
    { id: 21, text: "Interview prep is so important!", user: "Alice", parentId: null },
    { id: 22, text: "I need to practice more algorithms.", user: "Bob", parentId: null },
    { id: 23, text: "What resources do you recommend?", user: "Charlie", parentId: 21 },
    { id: 24, text: "LeetCode is a great resource.", user: "David", parentId: 23 },
    { id: 25, text: "I also recommend HackerRank.", user: "Eve", parentId: 23 }
  ]
};

// Get URL parameter helper
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Render posts based on filters
function renderPosts(filterTag = "", filterCommunity = "") {
  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = "";

  const filteredPosts = posts.filter(post => {
    const matchesTag = filterTag ? post.tags.includes(filterTag) : true;
    const matchesCommunity = filterCommunity ? post.community === filterCommunity : true;
    return matchesTag && matchesCommunity;
  });

  filteredPosts.forEach(post => {
    const postElement = document.createElement("div");
    postElement.className = "post";
    postElement.innerHTML = `
      <div class="post-title" onclick="viewPost(${post.id})">${post.title}</div>
      <div class="snippet">${post.snippet}</div>
    `;
    postsContainer.appendChild(postElement);
  });

  // Determine and display the most popular post
  const mostPopular = posts.reduce((max, post) => (post.likes > max.likes ? post : max), posts[0]);
  document.getElementById("most-popular-title").textContent = mostPopular.title;
}

// View a single post
function viewPost(postId) {
  currentPostId = postId;
  const post = posts.find(p => p.id === postId);
  document.getElementById("home-view").style.display = "none";
  document.getElementById("post-view").style.display = "block";
  document.getElementById("post-title").textContent = post.title;
  document.getElementById("post-content").textContent = post.content;
  renderComments(comments[postId]);
}

// Back button functionality
document.getElementById("backButton").addEventListener("click", function () {
  document.getElementById("home-view").style.display = "block";
  document.getElementById("post-view").style.display = "none";
  window.history.pushState({}, "", "/"); // Reset URL if needed
});

// Render comments (with nesting)
// Note: Instead of using a default parameter for 'container', we check inside the function.
function renderComments(commentList, parentId = null, container) {
  if (!container) {
    container = document.getElementById("comments-container");
  }
  container.innerHTML = "";

  commentList
    .filter(comment => comment.parentId === parentId)
    .forEach(comment => {
      const element = document.createElement("div");
      element.className = "comment";
      element.innerHTML = `
        <strong>${comment.user}</strong>: ${comment.text}
        <div class="comment-actions">
          ${comment.user === currentUser ? `<span class="edit" onclick="editComment(${comment.id})">Edit</span>` : ""}
          ${comment.user === currentUser ? `<span class="delete" onclick="deleteComment(${comment.id})">Delete</span>` : ""}
          <span class="reply" onclick="replyToComment(${comment.id})">Reply</span>
        </div>`;
      container.appendChild(element);

      // Render nested replies if any
      const replies = commentList.filter(c => c.parentId === comment.id);
      if (replies.length > 0) {
        const nestedContainer = document.createElement("div");
        nestedContainer.className = "nested-comments";
        renderComments(replies, comment.id, nestedContainer);
        container.appendChild(nestedContainer);
      }
    });
}

// Add a comment or reply
function addComment(parentId = null) {
  const content = document.getElementById("new-comment").value.trim();
  if (content) {
    const newComment = {
      id: Date.now(), // Unique ID based on timestamp
      text: content,
      user: currentUser,
      parentId: parentId
    };
    comments[currentPostId].push(newComment);
    document.getElementById("new-comment").value = "";
    renderComments(comments[currentPostId]);
  }
}

// Edit a comment (only by its owner)
function editComment(commentId) {
  const comment = comments[currentPostId].find(c => c.id === commentId);
  if (comment.user === currentUser) {
    const newContent = prompt("Edit your comment:", comment.text);
    if (newContent) {
      comment.text = newContent + " (edited)";
      renderComments(comments[currentPostId]);
    }
  } else {
    alert("You can only edit your own comments.");
  }
}

// Delete a comment (only by its owner)
function deleteComment(commentId) {
  const comment = comments[currentPostId].find(c => c.id === commentId);
  if (comment.user === currentUser) {
    comments[currentPostId] = comments[currentPostId].filter(c => c.id !== commentId);
    renderComments(comments[currentPostId]);
  } else {
    alert("You can only delete your own comments.");
  }
}

// Reply to a comment
function replyToComment(parentId) {
  const content = prompt("Write your reply:");
  if (content) {
    const newComment = {
      id: Date.now(),
      text: content,
      user: currentUser,
      parentId: parentId
    };
    comments[currentPostId].push(newComment);
    renderComments(comments[currentPostId]);
  }
}

// Filter posts by tag or community
document.getElementById("tags").addEventListener("change", function () {
  const selectedTag = this.value;
  const selectedCommunity = document.getElementById("communities").value;
  renderPosts(selectedTag, selectedCommunity);
});

document.getElementById("communities").addEventListener("change", function () {
  const selectedCommunity = this.value;
  const selectedTag = document.getElementById("tags").value;
  renderPosts(selectedTag, selectedCommunity);
});

// On page load, check URL for a post ID and render appropriately
window.onload = function () {
  const postId = getQueryParam("id");
  if (postId) {
    viewPost(parseInt(postId));
  } else {
    renderPosts();
  }
};
