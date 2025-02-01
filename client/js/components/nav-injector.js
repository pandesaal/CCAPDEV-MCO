const navRelatedScripts = [
    "sidebar.js",
    "searching.js"
]

const outsideNav = [
    'createPost.js',
    'register.js'
]

document.addEventListener('DOMContentLoaded', () => {
    fetch('../../html/components/nav.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;

            navRelatedScripts.forEach(scriptFile => {
                let scriptTag = document.createElement("script")
                scriptTag.src = "../../js/components/nav/" + scriptFile
                document.getElementsByTagName("body")[0].appendChild(scriptTag)
            })

            outsideNav.forEach(scriptFile => {
                let scriptTag = document.createElement("script")
                scriptTag.src = "../../js/components/" + scriptFile
                document.getElementsByTagName("body")[0].appendChild(scriptTag)
            })
        })
        .catch(err => {
            console.error("Error loading navbar:", err);
        });
});
