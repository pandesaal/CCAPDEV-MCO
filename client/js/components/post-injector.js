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
            

            let allPostsHTML = posts.map(post => 
                template
                    .replace('{{username}}', post.username)
                    .replace('{{date-posted}}', post.datePosted)
                    .replace('{{post-title}}', post.postTitle)
                    .replace('{{post-content}}', post.postContent)
                    .replace('{{post-tags}}', post.postTags.map(tag => {
                        return `<a href="#" class="post-tag">${tag}</a>`;
                    }).join(''))
            ).join('');

            document.getElementById('posts-wrapper').innerHTML = allPostsHTML;
        })
        .catch(err => {
            console.error("Error loading post template:", err);
        });
});
