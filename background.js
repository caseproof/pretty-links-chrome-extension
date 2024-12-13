// Description: Background script for the PrettyLinks Manager Extension
// Version: 1.0
// Date: 2024-04-10

chrome.runtime.onInstalled.addListener(() => {
    console.log("PrettyLinks Manager Extension Installed");
    // Check for settings on installation
    chrome.storage.sync.get({
        baseUrl: '',
        apiKey: ''
    }, (items) => {
        if (!items.baseUrl || !items.apiKey) {
            chrome.runtime.openOptionsPage();
        }
    });
});

// Load stored credentials
async function getStoredCredentials() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({
      apiBaseUrl: '',
      username: '',
      applicationPassword: ''
    }, (items) => resolve(items));
  });
}