import { navInjector } from "../components/nav-injector.js";
import { paginationSetup } from "../components/pagination.js";
import { postInjector } from "../components/post-injector.js";

const searchByFilters = (key, filter) => {
    var queries = new URLSearchParams(window.location.search);
    queries.set(key, filter);
    return `/search?${queries}`;
}

const removeFilters = (key) => {
    var queries = new URLSearchParams(window.location.search);
    queries.delete(key);
    return `/search?${queries}`;
}

document.addEventListener('DOMContentLoaded', () => {

    navInjector();
    postInjector();
    paginationSetup();

    // Close modal when the close button is clicked
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.classList.add('hide')
        });
    });

    // Handle the upload button click
    document.getElementById('editPostBtn').addEventListener('click', () => {
        document.getElementById('editModal').classList.add('hide');
    });

    if (document.getElementById('filter-by-type')) {
        document.getElementById('filter-users').href = searchByFilters('type', 'users');
        document.getElementById('filter-posts').href = searchByFilters('type', 'posts');
        document.getElementById('filter-comments').href = searchByFilters('type', 'comments');
        document.getElementById('filter-tags').href = searchByFilters('type', 'tags');
    }

    document.getElementById('filter-remove-tags').href = removeFilters('tag');

    document.querySelectorAll('.filter-tags').forEach(tag => {
        tag.href = searchByFilters('tag', tag.querySelector('p').innerText);
    })

});