document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings
    chrome.storage.sync.get({
        baseUrl: '',
        apiKey: ''
    }, (items) => {
        document.getElementById('baseUrl').value = items.baseUrl;
        document.getElementById('apiKey').value = items.apiKey;
    });

    function showStatus(message, isError = false) {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = `status ${isError ? 'error' : 'success'}`;
        status.style.display = 'block';
        setTimeout(() => status.style.display = 'none', 3000);
    }

    // Test connection
    async function testConnection() {
        const baseUrl = document.getElementById('baseUrl').value.trim();
        const apiKey = document.getElementById('apiKey').value.trim();
    
        console.log('Testing connection with:', {
            baseUrl,
            apiKeyLength: apiKey.length
        });
    
        try {
            const response = await fetch(`${baseUrl}/wp-json/pl/v1/links`, {
                method: 'GET',
                headers: {
                    'PRLI-API-KEY': apiKey,
                    'Accept': 'application/json'
                }
            });
    
            console.log('Response status:', response.status);
            const text = await response.text();
            console.log('Response text:', text);
    
            if (!response.ok) {
                throw new Error('API Error: ' + text);
            }
    
            showStatus('Connection successful!');
        } catch (error) {
            console.error('Connection error:', error);
            showStatus(error.message, true);
        }
    }

    // Handle form submission
    document.getElementById('settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const settings = {
            baseUrl: document.getElementById('baseUrl').value.trim(),
            apiKey: document.getElementById('apiKey').value.trim()
        };

        chrome.storage.sync.set(settings, () => {
            showStatus('Settings saved!');
        });
    });

    // Handle test button
    document.getElementById('test').addEventListener('click', testConnection);
});