// Chrome storage service
export async function getSites() {
    const { sites = [] } = await chrome.storage.sync.get({ sites: [] });
    return sites;
}

export async function getSettings() {
    const { settings = {} } = await chrome.storage.sync.get({ settings: {} });
    return settings;
}

export async function saveSites(sites) {
    await chrome.storage.sync.set({ sites });
}