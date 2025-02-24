import { navInjector } from "../components/nav-injector.js";
import { postInjector } from "../components/post-injector.js";

document.addEventListener('DOMContentLoaded', () => {
    navInjector();
    postInjector();

    let tags = [];
    const fetchTags = async () => {
        try {
            const response = await fetch('/tags', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                tags = await response.json();
            } else {
                console.error("Failed to fetch tags");
            }
        } catch (err) {
            console.error("Error fetching tags:", err);
        }
    };
    fetchTags();

    let tagCounts = posts.flatMap(post => post.tags)
    .reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
    }, {});
    
});
