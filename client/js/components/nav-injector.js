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