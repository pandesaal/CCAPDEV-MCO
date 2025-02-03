import { navInjector } from "../components/nav-injector.js";
import { postInjector, posts } from "../components/post-injector.js";

document.addEventListener('DOMContentLoaded', () => {

    const query = new URLSearchParams(window.location.search).get('query')
    const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query))

    navInjector();
    postInjector(filteredPosts);

    // Close modal when the close button is clicked
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', () => {
            console.log('click')
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
});