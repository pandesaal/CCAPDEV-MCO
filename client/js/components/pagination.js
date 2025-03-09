export const paginationSetup = () => { 
    if (document.getElementById('pagination')) {
        const pagination = document.getElementById('pagination');
        const currentPage = parseInt(pagination.querySelector('span').dataset.currentpage);
    
        const prevButton = document.getElementById('pagination-prev');
        const nextButton = document.getElementById('pagination-next');
    
        const url = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);
    
        if (prevButton) {
            urlParams.set('page', currentPage - 1);
            prevButton.href = url + '?' + urlParams.toString();
        }
    
        if (nextButton) {
            urlParams.set('page', currentPage + 1);
            nextButton.href = url + '?' + urlParams.toString();
        }
    }

}