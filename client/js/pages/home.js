import { navInjector } from "../components/nav-injector.js";
import { postInjector, posts } from "../components/post-injector.js";

document.addEventListener('DOMContentLoaded', () => {
    navInjector();
    postInjector();

    const tags = posts.reduce((ctr, post) => {
        post.tags.forEach(tag => {
            ctr[tag] = (ctr[tag] || 0) + 1;
        });
        return ctr;
    }, {});
    
    const tagsWrapper = document.getElementById('tags-wrapper')

    const filteredTags = Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

    filteredTags.forEach(tag => {
        let li = document.createElement('li')
        let a = document.createElement('a')

        a.href = `/search?query=${tag[0]}`
        a.innerText = tag[0]
        li.appendChild(a)
        tagsWrapper.appendChild(li)
    })
    
});
