document.addEventListener('DOMContentLoaded', () => {
    const sitesContainer = document.getElementById('sites-container');
    const siteTemplate = document.getElementById('site-template');

    function showStatus(message, isError = false) {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = 'status ' + (isError ? 'error' : 'success');
        status.style.display = 'block';
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }

    function addSite(siteData = { url: '', apiKey: '' }) {
        const siteElement = siteTemplate.content.cloneNode(true);
        const container = siteElement.querySelector('.site-container');
        
        const urlInput = siteElement.querySelector('.site-url');
        const apiKeyInput = siteElement.querySelector('.api-key');
        
        urlInput.value = siteData.url;
        apiKeyInput.value = siteData.apiKey;

        // Remove site button
        siteElement.querySelector('.remove-site').addEventListener('click', () => {
            container.remove();
        });

        // Test connection button
        siteElement.querySelector('.test-connection').addEventListener('click', async () => {
            const url = urlInput.value.trim();
            const apiKey = apiKeyInput.value.trim();
            console.log('Testing connection to:', url);

            if (!url || !apiKey) {
                showStatus('Please fill in all fields for this site', true);
                return;
            }

            try {
                console.log('Making API request...');
                // Ensure URL doesn't end with a slash before adding path
                const baseUrl = url.replace(/\/$/, '');
                const response = await fetch(`${baseUrl}/wp-json/pl/v1/links`, {
                    headers: {
                        'PRLI-API-KEY': apiKey,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                console.log('Response status:', response.status);
                const responseText = await response.text();
                console.log('Response body:', responseText);

                if (response.ok) {
                    showStatus('Connection successful!');
                } else {
                    throw new Error(`API Error (${response.status}): ${responseText}`);
                }
            } catch (error) {
                console.error('Connection test failed:', error);
                showStatus('Connection failed: ' + error.message, true);
            }
        });

        sitesContainer.appendChild(siteElement);
    }

    // Load saved settings
    chrome.storage.sync.get({ sites: [] }, (items) => {
        if (items.sites.length === 0) {
            addSite(); // Add one empty site by default
        } else {
            items.sites.forEach(site => addSite(site));
        }
    });

    // Add new site button
    document.getElementById('add-site').addEventListener('click', () => {
        addSite();
    });

    // Save settings
    document.getElementById('settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const sites = Array.from(sitesContainer.querySelectorAll('.site-container')).map(container => ({
            url: container.querySelector('.site-url').value.trim(),
            apiKey: container.querySelector('.api-key').value.trim()
        })).filter(site => site.url && site.apiKey);

        if (sites.length === 0) {
            showStatus('Please add at least one valid site configuration', true);
            return;
        }

        chrome.storage.sync.set({ sites }, () => {
            showStatus('Settings saved successfully!');
        });
    });
});