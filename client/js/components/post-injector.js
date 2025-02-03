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
      username: 'techie_tom',
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
      username: 'anxious_learner',
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
  
export const postInjector = (postsArray = posts) => {
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
            
        })
        .catch(err => {
            console.error("Error loading post template:", err);
        });
};