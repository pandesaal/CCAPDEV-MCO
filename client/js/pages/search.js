import { navInjector } from "../components/nav-injector.js";
import { postInjector } from "../components/post-injector.js";

const searchByFilters = (filter) => {
    var queries = new URLSearchParams(window.location.search);
    queries.set('type', filter);
    return `/search?${queries}`;
}

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

    // // Handle the upload button click
    // document.getElementById('editPostBtn').addEventListener('click', () => {
    //     document.getElementById('editModal').style.display = 'none';
    // });

    document.getElementById('filter-users').href = searchByFilters('users');
    document.getElementById('filter-posts').href = searchByFilters('posts');
    document.getElementById('filter-comments').href = searchByFilters('comments');

});