const navRelatedScripts = [
    "sidebar.js",
    "searching.js"
]

const outsideNav = [
    'createPost.js',
    'register.js'
]

export const navInjector = () => {
    if (JSON.parse(sessionStorage.getItem('isLoggedIn'))){
        const userInfo = JSON.parse(sessionStorage.getItem('user'));
        console.log(userInfo)

        document.getElementById('nav-loggedin').classList.remove('hide')
        document.getElementById('sidebar-button').classList.remove('hide')
        document.getElementById('nav-loggedout').classList.add('hide')

        if (document.getElementById('pagination')) document.getElementById('pagination').classList.remove('hide');

        if (document.getElementById('login-note-footer')){
            document.getElementById('login-note-footer').classList.add('hide');
            document.getElementById('pagination').classList.remove('hide');
        }

        if (document.getElementById('nav-username')) {
            document.getElementById('nav-username').textContent = userInfo.username;
        }

        if (document.getElementById('sidebar-profile')) {
            document.getElementById('sidebar-profile').href = `/user/${userInfo.username}?type=posts`;
        }

        if (document.getElementById('nav-profile')) {
            document.getElementById('nav-profile').href = `/user/${userInfo.username}?type=posts`;
        }

        const imageId = userInfo.icon;
        document.getElementById('nav-icon-img').src = `/image/${imageId}`;
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
