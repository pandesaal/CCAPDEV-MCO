const searchBar = document.getElementById("search-bar")
const clearSearch = document.getElementById("search-clear")
const resultsHolder = document.getElementById("search-results")

let tags;
const fetchTags = async () => {
    try {
        const response = await fetch('/api/tags', {
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

searchBar.addEventListener("input", () => {
    const searchQuery = searchBar.value.toLowerCase();
    resultsHolder.innerHTML = "";
    
    if (searchQuery.trim() === "") {
        resultsHolder.classList.add("hide");
        clearSearch.classList.add("hide");
        return;
    }

    let tagsSet = [...new Set(Object.keys(tags))];
    const filteredTags = tagsSet.filter(tag => tag.toLowerCase().includes(searchQuery)).slice(0, 5);

    if (filteredTags.length > 0) {
        filteredTags.forEach((result) => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = `/search?q=${result.replace(/ +/g, "-")}&type=posts`;
            a.textContent = result;
            li.appendChild(a);
            resultsHolder.appendChild(li);
        });
        resultsHolder.classList.remove("hide");
        clearSearch.classList.remove("hide");
    } else {
        resultsHolder.classList.add("hide");
        clearSearch.classList.add("hide");
    }
});

clearSearch.addEventListener("click", () => {
    searchBar.value = "";
    resultsHolder.innerHTML = "";
    resultsHolder.classList.add("hide");
    clearSearch.classList.add("hide");
});

document.getElementById('search-query').addEventListener('submit', function (event) {
    let queries = new URLSearchParams(new FormData(this));
    queries.set('q', searchBar.value);
    queries.set('type', 'posts');

    window.location.href = this.action + '?' + queries.toString();
    event.preventDefault();
});
