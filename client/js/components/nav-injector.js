const navRelatedScripts = [
    "sidebar.js",
    "searching.js"
]

const outsideNav = [
    'createPost.js',
    'register.js'
]

const isLoggedin = sessionStorage.getItem('isLoggedIn')

document.addEventListener('DOMContentLoaded', () => {
    fetch('../../html/components/nav.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;

            if (isLoggedin){
                document.getElementById('nav-loggedin').classList.remove('hide')
                document.getElementById('sidebar-button').classList.remove('hide')
                document.getElementById('nav-loggedout').classList.add('hide')

                if (document.getElementById('login-note-footer'))
                    document.getElementById('login-note-footer').classList.add('hide')
            }

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

        fetch('../../html/components/register.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('register-wrapper').innerHTML = data;
        })
        .catch(err => {
            console.error("Error loading navbar:", err);
        });
});
