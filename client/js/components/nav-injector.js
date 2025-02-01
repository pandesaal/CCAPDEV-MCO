document.addEventListener('DOMContentLoaded', () => {
    fetch('../../html/components/nav.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;

            const script = document.createElement("script")
            script.src = "../../js/components/nav/searching.js"
            document.getElementsByTagName("body")[0]
            .appendChild(
                script
            )
        })
        .catch(err => {
            console.error("Error loading navbar:", err);
        });
});

document.addEventListener('DOMContentLoaded', () => {
    const createPostBtn = document.getElementById('createPostBtn');
    const closePostModal = document.querySelector('.close'); // Close button for post modal
    const discardPostBtn = document.getElementById('discardPostBtn');
    const postModal = document.getElementById('postModal');
    const postText = document.getElementById('postText');

    createPostBtn.onclick = function() {
        postModal.style.display = "block";
        console.log('hello')
    }

    closePostModal.onclick = function() {
        postModal.style.display = "none";
        postText.value = '';
    }

    discardPostBtn.onclick = function() {
        postModal.style.display = "none";
        postText.value = '';
    }
});
