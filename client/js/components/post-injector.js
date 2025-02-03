const getRandomDate = (startYear, endYear) => {
    const start = new Date(startYear, 0, 1).getTime();
    const end = new Date(endYear, 11, 31).getTime();
    const randomTimestamp = Math.random() * (end - start) + start;
    const randomDate = new Date(randomTimestamp);
    return randomDate.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('../../html/components/post.html')
        .then(response => response.text())
        .then(template => {
            const posts = [
                {
                    username: 'john_doe123',
                    datePosted: getRandomDate(2020, 2025),
                    postTitle: 'Exploring the great outdoors',
                    postContent: "Had an amazing hike up the mountain this weekend! The weather was perfect, and the view from the top was breathtaking. Highly recommend it to anyone who loves nature.",
                    postTags: ['hiking', 'outdoors', 'adventure']
                },
                {
                    username: 'jane_smith456',
                    datePosted: getRandomDate(2020, 2025),
                    postTitle: 'My first cooking experience',
                    postContent: "Tried my hand at cooking last night and made a delicious homemade pasta. It was surprisingly easy, and I can't wait to try more recipes. Any suggestions?",
                    postTags: ['cooking', 'food', 'homemade']
                },
                {
                    username: 'techguy789',
                    datePosted: getRandomDate(2020, 2025),
                    postTitle: 'The future of AI',
                    postContent: "AI is rapidly changing the way we interact with technology. From smart assistants to autonomous vehicles, the possibilities are endless. Excited to see where this technology takes us.",
                    postTags: ['AI', 'technology', 'future']
                },
                {
                    username: 'artlover101',
                    datePosted: getRandomDate(2020, 2025),
                    postTitle: 'Art Exhibition Review: Van Gogh',
                    postContent: "I visited the Van Gogh exhibition this weekend and was blown away by the detail and emotion in his paintings. Definitely a must-see for any art enthusiast.",
                    postTags: ['art', 'Van Gogh', 'exhibition']
                },
                {
                    username: 'musicman202',
                    datePosted: getRandomDate(2020, 2025),
                    postTitle: 'New Album Review: The Weeknd',
                    postContent: "Just finished listening to The Weeknd's latest album, and it's amazing! The beats are on point, and his voice is as soulful as ever. Definitely worth checking out.",
                    postTags: ['music', 'The Weeknd', 'album review']
                },
            ];


            let allPostsString = posts.map(post =>
                template
                    .replace('{{username}}', post.username)
                    .replace('{{date-posted}}', post.datePosted)
                    .replace('{{post-title}}', post.postTitle)
                    .replace('{{post-content}}', post.postContent)
                    .replace('{{post-tags}}', post.postTags.map(tag => {
                        return <a href="#" class="post-tag">${tag}</a>;
                    }).join(''))
            ).join('');

            const allPostsHTML = document.createRange().createContextualFragment(allPostsString);
            document.getElementById('posts-wrapper').appendChild(allPostsHTML);

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

            // Show modal on Edit button click
            document.querySelectorAll('.editBtn').forEach(button => {
                button.addEventListener('click', () => {
                    const post = button.closest('.post');
                    const title = post.querySelector('.post-title h3').innerText;
                    const content = post.querySelector('.post-content').innerText;

                    document.getElementById('editPostTextTitle').innerText = title;
                    document.getElementById('editPostTextContent').innerText = content;

                    console.log("clicked edit")

                    document.getElementById('editModal').style.display = 'block';
                });
            });

            // Close modal when the close button is clicked
            document.querySelectorAll('.close').forEach(button => {
                button.addEventListener('click', () => {
                    const modal = button.closest('.modal');
                    modal.style.display = 'none'
                });
            });

            // Handle the upload button click
            document.getElementById('editPostBtn').addEventListener('click', () => {
                const newTitle = document.getElementById('editPostTextTitle').value;
                const newContent = document.getElementById('editPostTextContent').value;
                console.log('Updated Title:', newTitle);
                console.log('Updated Content:', newContent);

                document.getElementById('editModal').style.display = 'none';
            });

            document.querySelectorAll('#postTitle').forEach((title, index) => {
                title.addEventListener('click', (event) => {
                    // Get the post data based on the index
                    const post = posts[index];

                    // Populate the modal with post data
                    document.getElementById('modal-username').innerText = post.username;
                    document.getElementById('modal-date-posted').innerText = post.datePosted;
                    document.getElementById('modal-post-title').innerText = post.postTitle;
                    document.getElementById('modal-post-content').innerText = post.postContent;
                    document.getElementById('modal-post-tags').innerHTML = post.postTags.map(tag => {
                        return <a href="#" class="post-tag">${tag}</a>;
                    }).join('');

                    // replace this with actual comments
                    const comments = [
                        // { username: 'commenter1', content: 'Great post!' },
                        // { username: 'commenter2', content: 'Thanks for sharing!' },
                        // { username: 'commenter3', content: 'Very informative.' },
                        // { username: 'commenter4', content: 'Looking forward for your next blog!' },
                        // { username: 'commenter5', content: 'Amazing idea!' }
                    ];

                    const commentsList = comments.map(comment => {
                        return <div class="comment"><strong>${comment.username}:</strong> ${comment.content}</div>;
                    }).join('');

                    document.getElementById('commentsList').innerHTML = commentsList;

                    // Show the modal
                    document.getElementById('viewPostModal').style.display = 'block';
                });
            });
        })
        .catch(err => {
            console.error("Error loading post template:", err);
        });
});