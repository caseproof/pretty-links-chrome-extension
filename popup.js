document.addEventListener('DOMContentLoaded', async () => {
    let currentPage = 1;  // Current page
    const perPage = 10;  // Items per page
    let editingId = null;  // Will be null for new links, or contain ID for editing

    // Load saved settings
    async function getSettings() {
        return new Promise((resolve) => {
            chrome.storage.sync.get({
                baseUrl: '',
                apiKey: ''
            }, (items) => resolve(items));
        });
    }

    // Show status message
    function showStatus(message, isError = false) {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = `status ${isError ? 'error' : 'success'}`;
        status.style.display = 'block';
        setTimeout(() => status.style.display = 'none', 3000);
    }

    // API request helper
    async function apiRequest(endpoint, options = {}) {
        const settings = await getSettings();
        
        if (!settings.baseUrl || !settings.apiKey) {
            throw new Error('Please configure the extension settings first');
        }
    
        const baseUrl = settings.baseUrl.replace(/\/$/, '');
        const response = await fetch(`${baseUrl}/wp-json/pl/v1/${endpoint}`, {
            ...options,
            headers: {
                'PRLI-API-KEY': settings.apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
    
        if (!response.ok) {
            throw new Error('API request failed');
        }
    
        return {
            data: await response.json(),
            totalPages: parseInt(response.headers.get('X-WP-TotalPages')) || 1,
            totalItems: parseInt(response.headers.get('X-WP-Total')) || 0
        };
    }
    
    // Load links
    async function loadLinks(search = '') {
        try {
            const endpoint = `links?page=${currentPage}&per_page=${perPage}${search ? '&search=' + encodeURIComponent(search) : ''}`;
            const response = await apiRequest(endpoint);
            
            displayLinks(response.data);
            displayPagination(response.totalPages, response.totalItems);
        } catch (error) {
            showStatus(error.message, true);
        }
    }

    // Display links
    function displayPagination(totalPages, totalItems) {
        const paginationDiv = document.getElementById('pagination');
        paginationDiv.innerHTML = '';

        if (totalPages <= 1) return;

        const container = document.createElement('div');
        container.className = 'pagination';

        // Add page info
        const pageInfo = document.createElement('span');
        pageInfo.className = 'page-info';
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        container.appendChild(pageInfo);

        // Add buttons container
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'pagination-buttons';

        // Previous button
        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = '← Previous';
            prevButton.onclick = () => changePage(currentPage - 1);
            buttonsDiv.appendChild(prevButton);
        }

        // Next button
        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next →';
            nextButton.onclick = () => changePage(currentPage + 1);
            buttonsDiv.appendChild(nextButton);
        }

        container.appendChild(buttonsDiv);
        paginationDiv.appendChild(container);
    }

    // Change page
    async function changePage(newPage) {
        currentPage = newPage;
        await loadLinks(document.getElementById('search').value.trim());
    }

    // Update your search event listener to reset pagination
    document.getElementById('search').addEventListener('input', (e) => {
        if (window.searchTimeout) {
            clearTimeout(window.searchTimeout);
        }
        
        window.searchTimeout = setTimeout(() => {
            currentPage = 1;  // Reset to first page when searching
            loadLinks(e.target.value.trim());
        }, 300);
    });
    
    // Edit link
    async function editLink(id) {
        try {
            const response = await apiRequest(`links/${id}`);
            const link = response.data;
            
            editingId = id;
            document.getElementById('form-title').textContent = 'Edit Link';
            document.getElementById('save-btn').textContent = 'Save Changes';
            document.getElementById('title').value = link.title || '';
            document.getElementById('slug').value = link.slug || '';
            document.getElementById('target_url').value = link.target_url || '';
            showForm();
        } catch (error) {
            showStatus('Failed to load link: ' + error.message, true);
        }
    }

    // Copy link
    async function copyLink(slug) {
        try {
            const settings = await getSettings();
            const shortUrl = `${settings.baseUrl}/${slug}`;
            await navigator.clipboard.writeText(shortUrl);
            showStatus('Link copied to clipboard!');
        } catch (error) {
            showStatus('Failed to copy link', true);
        }
    }

    // Delete link
    async function deleteLink(id) {
        if (!confirm('Are you sure you want to delete this link?')) {
            return;
        }

        try {
            await apiRequest(`links/${id}`, { method: 'DELETE' });
            showStatus('Link deleted successfully!');
            loadLinks();
        } catch (error) {
            showStatus('Failed to delete link: ' + error.message, true);
        }
    }

    // Display links
    function displayLinks(links) {
        const list = document.getElementById('links-list');
        list.innerHTML = '';
    
        if (!links || links.length === 0) {
            list.innerHTML = '<div class="no-results">No links found</div>';
            return;
        }
    
        links.forEach(link => {
            const item = document.createElement('div');
            item.className = 'link-item';
            item.innerHTML = `
                <div class="link-title">${link.title}</div>
                <div class="link-url">/${link.slug} → ${link.target_url}</div>
                <div class="link-actions">
                    <button class="edit-btn" data-id="${link.id}">Edit</button>
                    <button class="copy-btn" data-slug="${link.slug}">Copy</button>
                    <button class="insert-btn" data-url="${link.pretty_url}">Insert</button>
                    <button class="delete-btn" data-id="${link.id}">Delete</button>
                </div>
            `;
    
            // Add event listeners
            item.querySelector('.copy-btn').addEventListener('click', () => copyLink(link.slug));
            item.querySelector('.edit-btn').addEventListener('click', () => editLink(link.id));
            item.querySelector('.delete-btn').addEventListener('click', () => deleteLink(link.id));
            item.querySelector('.insert-btn').addEventListener('click', () => insertLink(link.pretty_url));
    
            list.appendChild(item);
        });
    }
    
    // Add the insertLink function
    async function insertLink(url) {
    try {
        // Get the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) {
            throw new Error('No active tab found');
        }

        // Execute the script in the active tab
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (linkUrl) => {
                const activeElement = document.activeElement;
                
                // Handle different types of editable elements
                if (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') {
                    const start = activeElement.selectionStart;
                    const end = activeElement.selectionEnd;
                    const value = activeElement.value;
                    activeElement.value = value.substring(0, start) + linkUrl + value.substring(end);
                    activeElement.selectionStart = activeElement.selectionEnd = start + linkUrl.length;
                } else if (activeElement.getAttribute('contenteditable') === 'true') {
                    const selection = window.getSelection();
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode(linkUrl));
                }
            },
            args: [url]
        });
        showStatus('Link inserted successfully!');
    } catch (error) {
        console.error('Insert error:', error);
        showStatus('Failed to insert link: ' + error.message, true);
    }
}
    // Handle edit form submission
    document.getElementById('link-form').addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const data = {
            title: document.getElementById('title').value,
            slug: document.getElementById('slug').value,
            target_url: document.getElementById('target_url').value
        };
    
        try {
            if (editingId) {
                // Update existing link
                await apiRequest(`links/${editingId}`, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                });
                showStatus('Link updated successfully!');
            } else {
                // Create new link
                await apiRequest('links', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                showStatus('Link created successfully!');
            }
    
            document.getElementById('link-form').reset();
            showList();
            loadLinks();
        } catch (error) {
            showStatus(error.message, true);
        }
    });

    // Handle cancel edit button
    document.getElementById('cancel-edit')?.addEventListener('click', () => {
        document.getElementById('links-tab').style.display = 'block';
        document.getElementById('edit-tab').style.display = 'none';
    });

    // Add link button handler
    document.getElementById('add-link-btn').addEventListener('click', () => {
        editingId = null;
        document.getElementById('form-title').textContent = 'Add Link';
        document.getElementById('save-btn').textContent = 'Add Link';
        document.getElementById('link-form').reset();
        showForm();
    });

    // Cancel button handler
    document.getElementById('cancel-btn').addEventListener('click', () => {
        document.getElementById('link-form').reset();
        showList();
    });

    // Helper functions to show/hide views
    function showList() {
        document.getElementById('links-tab').style.display = 'block';
        document.getElementById('form-tab').style.display = 'none';
    }

    // Helper functions to show/hide views
    function showForm() {
        document.getElementById('links-tab').style.display = 'none';
        document.getElementById('form-tab').style.display = 'block';
    }
    // Add search event listener
    document.getElementById('search').addEventListener('input', (e) => {
        // Debounce the search to avoid too many API calls
        if (window.searchTimeout) {
            clearTimeout(window.searchTimeout);
        }
        
        window.searchTimeout = setTimeout(() => {
            loadLinks(e.target.value.trim());
        }, 300); // Wait 300ms after user stops typing
    });

    // Initial load
    loadLinks();
});