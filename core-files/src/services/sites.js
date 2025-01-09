// Chrome storage service
import { getSites } from './storage.js';

export async function initializeSites() {
    const sites = await getSites();
    const sitesData = new Map();

    sites.forEach((site, index) => {
        const siteId = `site-${index}`;
        sitesData.set(siteId, {
            ...site,
            id: siteId,
            currentPage: 1,
            totalPages: 1
        });
    });

    return sitesData;
}

export function getCurrentSite(sitesData) {
    const activeHeader = document.querySelector('.accordion-header.active');
    if (!activeHeader) return null;
    
    const siteId = activeHeader.dataset.siteId;
    return sitesData.get(siteId);
}

export function getSiteById(sitesData, siteId) {
    return sitesData.get(siteId);
}