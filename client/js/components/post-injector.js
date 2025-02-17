import { commentInjector, comments } from "./comment-injector.js";

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
        tags: ["finals", "stress", "study"]
    },
    {
        id: 2,
        username: 'study_hard_24',
        title: "Late-Night Study Sessions",
        content: "Just pulled an all-nighter. I feel like I can't function properly without coffee now. Who else is on this grind?",
        datePosted: getRandomDate(2020, 2025),
        tags: ["study", "coffee", "latenight"]
    },
    {
        id: 3,
        username: 'User12345',
        title: "Group Projects Are the Worst",
        content: "Why does it always feel like the workload is uneven in group projects? It's so frustrating when no one pulls their weight.",
        datePosted: getRandomDate(2020, 2025),
        tags: ["group project", "frustration", "workload"]
    },
    {
        id: 4,
        username: 'artistic_angel',
        title: "Stress Relief Through Art",
        content: "Whenever I'm overwhelmed with school work, I turn to drawing. It helps me relax and recharge. Anyone else use art as an escape?",
        datePosted: getRandomDate(2020, 2025),
        tags: ["art", "stress relief", "creativity"]
    },
    {
        id: 5,
        username: 'study_squad',
        title: "Time Management Tips",
        content: "Got any advice on how to balance school and personal life? I need a good routine to stick to.",
        datePosted: getRandomDate(2020, 2025),
        tags: ["timemanagement", "schoollife", "routine"]
    },
    {
        id: 6,
        username: 'college_survivor',
        title: "Procrastination Struggles",
        content: "I keep telling myself I'll start early, but here I am cramming again. How do you fight procrastination?",
        datePosted: getRandomDate(2020, 2025),
        tags: ["procrastination", "motivation", "cramming"]
    },
    {
        id: 7,
        username: 'User12345',
        title: "Morning or Night Study?",
        content: "Are you a morning or night person when it comes to studying? I feel like my brain works better at night.",
        datePosted: getRandomDate(2020, 2025),
        tags: ["study", "schedule", "night owl"]
    },
    {
        id: 8,
        username: 'fitness_nerd',
        title: "Exercise Helps with Studying",
        content: "I started exercising before study sessions and it actually helps me focus better. Anyone else do this?",
        datePosted: getRandomDate(2020, 2025),
        tags: ["exercise", "focus", "productivity"]
    },
    {
        id: 9,
        username: 'study_hard_24',
        title: "Best Study Playlists?",
        content: "Music helps me concentrate, but I need new study playlists. Drop your favorites!",
        datePosted: getRandomDate(2020, 2025),
        tags: ["music", "study", "playlists"]
    },
    {
        id: 10,
        username: 'artistic_angel',
        title: "Creative Study Notes",
        content: "Making study notes more visually appealing with colors and doodles actually helps me remember stuff. Does anyone else do this?",
        datePosted: getRandomDate(2020, 2025),
        tags: ["study", "notes", "creativity"]
    }
];

export const postInjector = (postsArray = posts) => {
    postsArray = [...postsArray].sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
    const postsContainer = document.getElementById('posts-wrapper');
    postsContainer.innerHTML = "";

    fetch('../../html/components/post.html')
        .then(response => response.text())
        .then(template => {
            
            let allPostsString = postsArray.map(post => 
                template
                    .replace('{{username}}', post.username)
                    .replace('{{date-posted}}', post.datePosted)
                    .replace('{{post-id}}', post.id)
                    .replace('{{post-title}}', post.title)
                    .replace('{{post-content}}', post.content)
                    .replace('{{post-tags}}', post.tags.map(tag => {
                        return `<a href="#" class="post-tag">${tag}</a>`;
                    }).join(''))
            ).join('');

            const allPostsHTML = document.createRange().createContextualFragment(allPostsString);
            postsContainer.appendChild(allPostsHTML);

            document.querySelectorAll('.post-options-button').forEach(button => {
                button.addEventListener('click', () => {
                    button.closest('.post').querySelector('.post-menu').classList.toggle('hide')
                })
            })

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
                            readMore.classList.add('hide')
                            post.innerHTML = post.innerHTML.replace(truncatedText, originalText);
                        });
                    }
                }
            });

            // Post Menu Button: Edit
            document.querySelectorAll('.editBtn').forEach(button => {
                button.addEventListener('click', () => {
                    const post = button.closest('.post');
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
                        tagElement.innerHTML = `
                            <span>${tag.innerText}</span>
                            <span><button class="remove-tag-button">×</button></span>
                        `;
                        editPostTagsContainer.appendChild(tagElement);
                    });

                    // Show the edit modal
                    document.getElementById('editModal').classList.remove('hide');

                    // Add event listeners to remove tag buttons
                    document.querySelectorAll('.remove-tag-button').forEach(removeButton => {
                        removeButton.addEventListener('click', (e) => {
                            e.target.closest('.tag').remove(); // Remove the tag element
                        });
                    });
                });
            });

            // Edit Post Button: Edit
            document.getElementById('editPostBtn').addEventListener('click', () => {
                const newTitle = document.getElementById('editPostTextTitle').value;
                const newContent = document.getElementById('editPostTextContent').value;
                console.log('Updated Title:', newTitle);
                console.log('Updated Content:', newContent);

                document.getElementById('editModal').classList.add('hide');
            });

            // Edit Post Button: Cancel
            document.getElementById('cancelPostBtn').addEventListener('click', () => {
                document.getElementById('editModal').classList.add('hide');
            });

            // Post Menu Button: Delete
            document.querySelectorAll('.deleteBtn').forEach(button => {
                button.addEventListener('click', () => {
                    if (button.closest('.post'))
                        document.getElementById('deletePostModal').classList.remove('hide')
                })
            })

            // Title Button: Open View Post Modal
            document.querySelectorAll('.post-title').forEach((title, index) => {
                title.addEventListener('click', (event) => {
                    const post = posts[index];

                    document.getElementById('modal-username').innerText = post.username;
                    document.getElementById('modal-date-posted').innerText = post.datePosted;
                    document.getElementById('modal-post-title').innerText = post.title;
                    document.getElementById('modal-post-content').innerText = post.content;
                    document.getElementById('modal-post-tags').innerHTML = post.tags.map(tag => {
                        return `<a href="#" class="post-tag">${tag}</a>`;
                    }).join('');

                    commentInjector(comments);

                    document.getElementById('viewPostModal').classList.remove('hide');
                });
            });

            // Close a modal when the close button is clicked
            document.querySelectorAll('.close').forEach(button => {
                button.addEventListener('click', () => {
                    const modal = button.closest('.modal');
                    modal.classList.add('hide')
                });
            });
        })
        .catch(err => {
            console.error("Error loading post template:", err);
        });
};