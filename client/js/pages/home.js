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

    fetchTags().then(() => {
        console.log(tags)
        let tagCounts = tags.reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {});
        
        tagCounts = Object.fromEntries(
            Object.entries(tagCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
        );
    
        console.log(tagCounts);
    
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
