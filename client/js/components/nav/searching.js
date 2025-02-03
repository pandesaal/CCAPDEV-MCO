const tags = [
    "finals", 
    "stress", 
    "study", 
    "coffee", 
    "latenight", 
    "group project", 
    "frustration", 
    "workload", 
    "art", 
    "stress relief", 
    "creativity", 
    "timemanagement", 
    "schoollife", 
    "routine"
]; //to be replaced with db simply for testing purposes


const searchBar = document.getElementById("search-bar")
const confirmSearch = document.getElementById("search-button")
const clearSearch = document.getElementById("search-clear")
const resultsHolder = document.getElementById("search-results")

searchBar.addEventListener("input", () => {

    resultsHolder.innerHTML = ""
    if (searchBar.value) {

        clearSearch.classList.remove("hide")
        const results = tags.filter(tag => tag.includes(searchBar.value.trim().toLowerCase())).slice(0, 5)

        if (results.length > 0) {
            results.forEach((result) => {
                const li = document.createElement("li")
                const a = document.createElement("a")
    
                resultsHolder.appendChild(li)
                li.appendChild(a)
                a.innerText = result
                a.href = result.replace(/ /g, "-")
                
                resultsHolder.classList.remove("hide")
            })
        } else {
            resultsHolder.classList.add("hide")
        }
        
    } else {
        resultsHolder.classList.add("hide")
    }
})

clearSearch.addEventListener("click", () => {
    searchBar.value = ""
    resultsHolder.innerHTML = ""
    resultsHolder.classList.add("hide")

    clearSearch.classList.add("hide")
})

const processSearch = () => {
    const searchValue = searchBar.value
    
    
}

confirmSearch.addEventListener("click", processSearch)