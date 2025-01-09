export function createSearchHandler(sitesData, loadLinks) {
    let searchTimeouts = new Map();

    return (e, siteId) => {
        if (!e.target.classList.contains('search-input')) return;
        
        // Clear existing timeout for this site
        if (searchTimeouts.has(siteId)) {
            clearTimeout(searchTimeouts.get(siteId));
        }

        // Set new timeout
        const timeoutId = setTimeout(() => {
            const siteData = sitesData.get(siteId);
            if (siteData) {
                siteData.currentPage = 1;
                sitesData.set(siteId, siteData);
                loadLinks(siteId);
            }
            searchTimeouts.delete(siteId);
        }, 500);

        searchTimeouts.set(siteId, timeoutId);
    };
}