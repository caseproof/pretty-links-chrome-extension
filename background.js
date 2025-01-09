// Background script for the PrettyLinks Manager Extension
chrome.runtime.onInstalled.addListener(() => {
    console.log("PrettyLinks Manager Extension Installed");
    chrome.storage.sync.get({
        sites: [],
        initialized: false
    }, (items) => {
        if (!items.initialized || !items.sites || items.sites.length === 0) {
            chrome.storage.sync.set({ initialized: true });
            chrome.runtime.openOptionsPage();
        }
    });
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.sites) {
        const newSites = changes.sites.newValue || [];
        if (newSites.length === 0) {
            chrome.runtime.openOptionsPage();
        }
    }
});

// Handle API requests from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'apiRequest') {
        handleApiRequest(request.data)
            .then(response => sendResponse({ success: true, data: response }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Will respond asynchronously
    }
});

// Helper function to make API requests
async function handleApiRequest({ url, apiKey, endpoint, options = {} }) {
    const response = await fetch(`${url}/wp-json/prettylinks/v1/${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            ...options.headers
        }
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'API request failed');
    }

    return {
        data: await response.json(),
        headers: {
            total: response.headers.get('X-WP-Total'),
            totalPages: response.headers.get('X-WP-TotalPages')
        }
    };
}

// Cache management for API responses
const cache = new Map();

function getCached(key) {
    const item = cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expires) {
        cache.delete(key);
        return null;
    }
    return item.data;
}

function setCache(key, data, ttl = 300000) { // 5 minutes default TTL
    cache.set(key, {
        data,
        expires: Date.now() + ttl
    });
}