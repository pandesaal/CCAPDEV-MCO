import { navInjector } from "../components/nav-injector.js";
import { postInjector } from "../components/post-injector.js";

document.addEventListener('DOMContentLoaded', () => {

    navInjector();
    postInjector();

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