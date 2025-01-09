// Main popup script
import { apiRequest } from '../api/client.js';
import { initializeSites, getCurrentSite } from '../services/sites.js';
import { createLinksList } from '../components/LinksList.js';
import { createPagination } from '../components/Pagination.js';
import { createSiteSelector } from '../components/SiteSelector.js';
import { handleFormSubmit } from '../handlers/formHandlers.js';
import { handleCopyLink, handleEditLink, handleInsertLink, handleDeleteLink } from '../handlers/linkActions.js';
import { createSearchHandler } from '../handlers/searchHandler.js';
import { initializeTabs } from '../utils/tabs.js';

// Initialize popup functionality
document.addEventListener('DOMContentLoaded', async () => {
    const sitesData = await initializeSites();
    let editingLinkId = null;
    
    initializeTabs();
    const searchHandler = createSearchHandler(sitesData, loadLinks);
    
    // Set up form submission handler with closure over editingLinkId
    document.getElementById('create-form').addEventListener('submit',
        handleFormSubmit(() => editingLinkId, sitesData, () => {
            editingLinkId = null; // Reset editing state after submit
            const currentSite = getCurrentSite(sitesData);
            if (currentSite) {
                loadLinks(currentSite.id);
            }
        })
    );
    
    // Set up link action handlers
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('copy-btn')) {
            await handleCopyLink(e.target.dataset.url);
        } else if (e.target.classList.contains('edit-btn')) {
            editingLinkId = await handleEditLink(e.target.dataset.id, sitesData);
        } else if (e.target.classList.contains('insert-btn')) {
            await handleInsertLink(e.target.dataset.url, e.target.dataset.text);
        } else if (e.target.classList.contains('delete-btn')) {
            await handleDeleteLink(e.target.dataset.id, () => {
                const currentSite = getCurrentSite(sitesData);
                if (currentSite) {
                    loadLinks(currentSite.id);
                }
            });
        }
    });
    
    // Set up search handler
    document.addEventListener('input', (e) => searchHandler(e, e.target.dataset.siteId));
});