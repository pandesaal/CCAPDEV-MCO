import { navInjector } from "../components/nav-injector.js";
import { postInjector } from "../components/post-injector.js";
import { commentInjector } from "../components/comment-injector.js";

function popup(message) {
    const alert = document.querySelector('.alert');
    alert.innerText = message;
    alert.classList.remove('hide');

    setTimeout(() => { alert.classList.add('hide'); }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {

    navInjector();
    postInjector();
    commentInjector();

    // Close modal when the close button is clicked
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.classList.add('hide');
        });
    });

    // Handle the upload button click
    document.getElementById('editPostBtn').addEventListener('click', () => {
        document.getElementById('editModal').classList.add('hide');
    });

    // create comment
    document.getElementById('createCommentForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const userInfo = JSON.parse(sessionStorage.getItem('user'));
        let authorName;
        if(userInfo){
            authorName = userInfo.username;
        }
        const postId = sessionStorage.getItem('viewPostId');
        const replyToRefPath = 'Post';

        const content = document.querySelector('[name="comment-content"]').value.trim(); 
        try {
            const response = await fetch('/createComment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ authorName, postId, replyToRefPath, content }) 
            });

            const data = await response.json();
            if (response.ok) {
                popup("Comment uploaded successfully!");
                setTimeout(() => { window.location.reload(); }, 2000); 
            } else {
                popup(data.message);
            }
        } catch (err) {
            console.error(err);
            popup("Uploading a comment failed, try again later.");
        }
    });
});