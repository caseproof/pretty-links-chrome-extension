import { showStatus } from '../utils/notifications.js';
import { getLinkById, deleteLink } from '../services/links.js';
import { switchToTab } from '../utils/tabs.js';
import { updateSubmitButton } from '../utils/dom.js';
import { createSiteSelector } from '../components/SiteSelector.js';

export async function handleCopyLink(url) {
    await navigator.clipboard.writeText(url);
    showStatus('URL copied to clipboard!');
}

export async function handleEditLink(id, sitesData) {
    try {
        const { data } = await getLinkById(id);
        
        // Get site URL from the pretty_url
        const linkUrl = new URL(data.pretty_url).origin + '/';
        const matchingSite = Array.from(sitesData.values())
            .find(site => site.url.replace(/\/$/, '/') === linkUrl);
        
        // Switch to create tab and update form
        switchToTab('create-tab');
        updateSubmitButton(true);

        // Update site selector
        if (matchingSite) {
            const siteSelector = document.getElementById('create-site');
            const sites = Array.from(sitesData.values())
                .filter(site => site.url && site.apiKey)
                .map(({url, apiKey}) => ({url, apiKey}));
            const newSelector = createSiteSelector(sites, matchingSite);
            siteSelector.parentNode.replaceChild(newSelector, siteSelector);
        }
        
        // Populate form fields
        document.getElementById('target-url').value = data.target_url;
        document.getElementById('slug').value = data.slug;
        document.getElementById('title').value = data.title;
        
        return id; // Return id for tracking editing state
    } catch (error) {
        showStatus('Failed to load link: ' + error.message, true);
        return null;
    }
}

export async function handleInsertLink(url, text) {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.tabs.sendMessage(tab.id, {
            type: 'insertLink',
            data: { url, text }
        });
        showStatus('Link inserted successfully!');
    } catch (error) {
        showStatus('Failed to insert link: ' + error.message, true);
    }
}

export async function handleDeleteLink(id, onSuccess) {
    if (!confirm('Are you sure you want to delete this link?')) return;
    
    try {
        await deleteLink(id);
        showStatus('Link deleted successfully!');
        if (onSuccess) onSuccess();
    } catch (error) {
        showStatus('Failed to delete link: ' + error.message, true);
    }
}