export const commentInjector = () => {
    document.querySelectorAll('.comment-options-button').forEach(button => {
        button.addEventListener('click', async (e) => {
            if (e.target.textContent === 'more_horiz') {
                const userInfo = JSON.parse(sessionStorage.getItem('user'));
                let currentUserName;
                if(userInfo){
                    currentUserName = userInfo.username;
                }
                const authorName = button.getAttribute('authorName');

                try {
                    const response = await fetch('/checkCommentAccess', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ currentUserName, authorName })
                    });            
    
                    const data = await response.json();
                    if (!response.ok) {
                        alert(data.message);
                        console.error('Error:', data.message);
                    } else {
                        button.closest('.comment').querySelector('.comment-menu').classList.toggle('hide'); // opens menu if it's the "..." icon
                    }
                } catch (err) {
                    console.error(err);
                    alert("Accessing the menu options for a comment failed, try again later.");
                }
            }
            else { // saves the edited comment if it's the check icon
                const comment = button.closest('.comment');

                Array.from(comment.querySelectorAll('.comment-options-button')).find(btn => btn.textContent === 'done_outline').classList.add('hide');
                Array.from(comment.querySelectorAll('.comment-options-button')).find(btn => btn.textContent === 'more_horiz').classList.remove('hide');
                comment.querySelector('.comment-content').classList.remove('editable');
                comment.querySelector('.comment-edit').classList.remove('hide');
            }
        })
    });

    // edit comment
    document.querySelectorAll('.editCommBtn').forEach(button => {
        button.addEventListener('click', (e) => {
            const comment = button.closest('.comment');

            const hiddenButton = comment.querySelector('.comment-options-button.hide');

            comment.querySelector('.comment-options-button').classList.add('hide');
            comment.querySelector('.comment-menu').classList.add('hide');
            comment.querySelector('.comment-content').classList.add('editable');

            // for blinking cursor during edit
            // const content = comment.querySelector('.comment-content');
            // content.focus();
            // let range = document.createRange();
            // let selection = window.getSelection();
            // range.selectNodeContents(content);
            // range.collapse(false);
            // selection.removeAllRanges();
            // selection.addRange(range);

            hiddenButton.classList.remove('hide');
        });
    });

    document.querySelectorAll('.deleteCommBtn').forEach(button => {
        button.addEventListener('click', (e) => {
            if (button.closest('.comment'))
                document.getElementById('deleteCommentModal').classList.remove('hide');
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