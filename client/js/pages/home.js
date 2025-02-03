import { navInjector } from "../components/nav-injector.js";
import { postInjector, posts } from "../components/post-injector.js";

document.addEventListener('DOMContentLoaded', () => {
    navInjector();
    postInjector();
});
