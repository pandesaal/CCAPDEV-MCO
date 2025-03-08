import { navInjector } from "../components/nav-injector.js";
import { paginationSetup } from "../components/pagination.js";
import { postInjector } from "../components/post-injector.js";

document.addEventListener('DOMContentLoaded', () => {
    navInjector();
    postInjector();
    paginationSetup();

    let tags;
    const fetchTags = async () => {
        try {
            const response = await fetch('/api/tags', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
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

    fetchTags().then(() => {
        
        let tagCounts = Object.fromEntries(
            Object.entries(tags)
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, 5)
        );
    
        const tagsWrapper = document.getElementById('tags-wrapper');
    
        for (let tag in tagCounts) {
            let li = document.createElement('li')
            let a = document.createElement('a')
    
            a.href = `/search?tag=${tag}`
            a.innerText = tag
            li.appendChild(a)
            tagsWrapper.appendChild(li) 
        }
    });
    
});
