export function createPagination(currentPage, totalPages, onPageChange) {
    const container = document.createElement('div');
    container.className = 'pagination-container';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'prev-page';
    prevButton.textContent = '< Previous';
    prevButton.style.visibility = currentPage === 1 ? 'hidden' : 'visible';
    prevButton.addEventListener('click', () => onPageChange(-1));
    
    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    const nextButton = document.createElement('button');
    nextButton.className = 'next-page';
    nextButton.textContent = 'Next >';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => onPageChange(1));
    
    container.appendChild(prevButton);
    container.appendChild(pageInfo);
    container.appendChild(nextButton);
    
    return container;
}