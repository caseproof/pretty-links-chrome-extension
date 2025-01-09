// API client for PrettyLinks
export async function apiRequest(endpoint, options = {}, site = null) {
    const settings = await getSettings();

    // Use provided site or settings
    const baseUrl = (site?.url || settings.baseUrl || '').replace(/\/$/, '');
    const apiKey = site?.apiKey || settings.apiKey;

    if (!baseUrl || !apiKey) {
        throw new Error('Please configure the extension settings first');
    }

    const url = `${baseUrl}/wp-json/pl/v1/${endpoint}`;
    const queryParams = options.params ? '?' + new URLSearchParams(options.params).toString() : '';
    
    const response = await fetch(url + queryParams, {
        ...options,
        headers: {
            'PRLI-API-KEY': apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`API request failed (${response.status}): ${errorText}`);
    }

    return {
        data: await response.json(),
        headers: {
            total: response.headers.get('X-WP-Total'),
            totalPages: response.headers.get('X-WP-TotalPages')
        }
    };
}