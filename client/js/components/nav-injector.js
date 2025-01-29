document.addEventListener('DOMContentLoaded', () => {
    fetch('../../html/components/nav.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
        })
        .catch(err => {
            console.error("Error loading navbar:", err);
        });
});