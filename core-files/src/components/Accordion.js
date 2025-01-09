export function createAccordionItem(site, index, onHeaderClick, onSearch, onPagination) {
    const siteId = `site-${index}`;
    const item = document.createElement('div');
    item.className = 'accordion-item';
    
    item.innerHTML = `
        <div class="accordion-header${index === 0 ? ' active' : ''}" data-site-id="${siteId}">
            <span>${new URL(site.url).hostname}</span>
            <span class="link-count"></span>
        </div>
        <div class="accordion-content${index === 0 ? ' active' : ''}">
            <div class="search-container">
                <input type="text" class="search-input" placeholder="Search links..." data-site-id="${siteId}">
            </div>
            <div class="links-container" id="links-${siteId}"></div>
            <div class="pagination-container">
                <button class="prev-page" style="visibility: hidden">&lt; Previous</button>
                <span class="page-info">Page 1 of 1</span>
                <button class="next-page" disabled>Next &gt;</button>
            </div>
        </div>
    `;

    // Set up event listeners
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => onHeaderClick(siteId));

    const searchInput = item.querySelector('.search-input');
    searchInput.addEventListener('input', (e) => onSearch(e, siteId));

    const prevButton = item.querySelector('.prev-page');
    const nextButton = item.querySelector('.next-page');
    prevButton.addEventListener('click', () => onPagination(siteId, -1));
    nextButton.addEventListener('click', () => onPagination(siteId, 1));

    return item;
}