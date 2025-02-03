const navRelatedScripts = [
    "sidebar.js",
    "searching.js"
]

const outsideNav = [
    'createPost.js',
    'register.js'
]

const isLoggedin = sessionStorage.getItem('isLoggedIn');

export const navInjector = () => {
    if (isLoggedin === 'true'){
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
}
