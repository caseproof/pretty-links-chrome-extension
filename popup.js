document.addEventListener('DOMContentLoaded', async () => {
    console.log('Popup initialized');
    const createSiteSelector = document.getElementById('create-site');
    const sitesData = new Map(); // Store site-specific data
    const perPage = 10;
    let editingLinkId = null;

    // Get settings from storage
    async function getSettings() {
        const currentSite = sitesData.get('current');
        if (!currentSite) {
            const activeHeader = document.querySelector('.accordion-header.active');
            return {
                baseUrl: activeHeader ? sitesData.get(activeHeader.dataset.siteId)?.url || '' : '',
                apiKey: activeHeader ? sitesData.get(activeHeader.dataset.siteId)?.apiKey || '' : ''
            };
        }
        return {
            baseUrl: currentSite.url,
            apiKey: currentSite.apiKey
        };
    }

    // Initialize site selectors
    async function initializeSiteSelectors() {
        const { sites = [] } = await chrome.storage.sync.get({ sites: [] });
        console.log('Initializing selectors with sites:', sites);
        
        // Populate create site selector
        createSiteSelector.innerHTML = '<option value="">Select a site</option>';
        sites.forEach((site, index) => {
            const option = document.createElement('option');
            option.value = JSON.stringify(site);
            option.textContent = new URL(site.url).hostname;
            createSiteSelector.appendChild(option);
        });
        
        const accordion = document.getElementById('sites-accordion');
        accordion.innerHTML = '';

        sites.forEach((site, index) => {
            const siteId = `site-${index}`;
            sitesData.set(siteId, {
                ...site,
                currentPage: 1,
                totalPages: 1
            });

            const item = document.createElement('div');
            item.className = 'accordion-item';
            item.innerHTML = `
                <div class="accordion-header${index === 0 ? ' active' : ''}" data-site-id="${siteId}">
                    <span>${new URL(site.url).hostname}</span>
                    <span class="link-count"></span>
                </div>
                <div class="accordion-content${index === 0 ? ' active' : ''}">
                    <div class="search-container">
                        <input type="text" class="search-input" placeholder="Search links..." data-site-id="${siteId}">
                    </div>
                    <div class="links-container" id="links-${siteId}"></div>
                    <div class="pagination-container">
                        <button class="prev-page" style="visibility: hidden">&lt; Previous</button>
                        <span class="page-info">Page 1 of 1</span>
                        <button class="next-page" disabled>Next &gt;</button>
                    </div>
                </div>
            `;

            accordion.appendChild(item);

            // Add click handler for accordion header
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                const wasActive = header.classList.contains('active');
                
                // Close all accordion items
                document.querySelectorAll('.accordion-header').forEach(h => {
                    h.classList.remove('active');
                    h.nextElementSibling.classList.remove('active');
                });

                if (!wasActive) {
                    header.classList.add('active');
                    header.nextElementSibling.classList.add('active');
                    loadLinks(siteId);
                }
            });

            // Set up pagination handlers
            const container = item.querySelector('.pagination-container');
            container.querySelector('.prev-page').addEventListener('click', () => handlePagination(siteId, -1));
            container.querySelector('.next-page').addEventListener('click', () => handlePagination(siteId, 1));
        });

        // Load first site's links
        if (sites.length > 0) {
            loadLinks('site-0');
        }
    }

    async function handlePagination(siteId, direction) {
        const siteData = sitesData.get(siteId);
        const newPage = siteData.currentPage + direction;
        
        if (newPage > 0 && newPage <= siteData.totalPages) {
            siteData.currentPage = newPage;
            sitesData.set(siteId, siteData);
            await loadLinks(siteId);
        }
    }

    // Load links for current site
    async function loadLinks(siteId) {
        const siteData = sitesData.get(siteId);
        if (!siteData) return;
        
        const searchInput = document.querySelector(`.search-input[data-site-id="${siteId}"]`);
        const searchQuery = searchInput ? searchInput.value.trim() : '';

        try {
            const { data, headers } = await apiRequest('links', {
                method: 'GET',
                params: {
                    page: siteData.currentPage,
                    per_page: perPage,
                    search: searchQuery
                }
            });

            siteData.totalPages = parseInt(headers.totalPages) || 1;
            sitesData.set(siteId, siteData);
            
            displayLinks(siteId, data);
        } catch (error) {
            console.error('Error loading links:', error);
            showStatus('Failed to load links: ' + error.message, true);
        }
    }

    // Display links in the popup
    function displayLinks(siteId, links) {
        const siteData = sitesData.get(siteId);
        const linksList = document.getElementById(`links-${siteId}`);
        const container = linksList.closest('.accordion-item');
        linksList.innerHTML = '';

        if (!links || links.length === 0) {
            linksList.innerHTML = '<div class="no-links">No links found</div>';
            return;
        }

        // Update link count in header
        container.querySelector('.link-count').textContent = `${links.length} links`;

        links.forEach(link => {
            const linkElement = document.createElement('div');
            linkElement.className = 'link-item';
            linkElement.innerHTML = `
                <div class="link-title">${link.title}</div>
                <div class="link-url">
                    <a href="${link.pretty_url}" target="_blank">${link.pretty_url}</a>
                </div>
                <div class="link-actions">
                    <button class="copy-btn" data-url="${link.pretty_url}">Copy</button>
                    <button class="edit-btn" data-id="${link.id}">Edit</button>
                    <button class="insert-btn" data-url="${link.pretty_url}" data-text="${link.title}">Insert</button>
                    <button class="delete-btn" data-id="${link.id}">Delete</button>
                </div>
            `;
            linksList.appendChild(linkElement);
        });

        // Update pagination
        const paginationContainer = container.querySelector('.pagination-container');
        const prevButton = paginationContainer.querySelector('.prev-page');
        const nextButton = paginationContainer.querySelector('.next-page');
        const pageInfo = paginationContainer.querySelector('.page-info');
        
        prevButton.style.visibility = siteData.currentPage === 1 ? 'hidden' : 'visible';
        nextButton.disabled = siteData.currentPage === siteData.totalPages;
        pageInfo.textContent = `Page ${siteData.currentPage} of ${siteData.totalPages}`;
    }

    // API request helper
    async function apiRequest(endpoint, options = {}) {
        const settings = await getSettings();

        if (!settings.baseUrl || !settings.apiKey) {
            throw new Error('Please configure the extension settings first');
        }

        const baseUrl = settings.baseUrl.replace(/\/$/, '');
        const url = `${baseUrl}/wp-json/pl/v1/${endpoint}`;

        const queryParams = options.params ? '?' + new URLSearchParams(options.params).toString() : '';
        
        const response = await fetch(url + queryParams, {
            ...options,
            headers: {
                'PRLI-API-KEY': settings.apiKey,
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

    // Status message helper
    function showStatus(message, isError = false) {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = `status ${isError ? 'error' : 'success'}`;
        status.style.display = 'block';
        setTimeout(() => status.style.display = 'none', 3000);
    }

    // Initialize tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // Initialize search
    document.addEventListener('input', (e) => {
        if (!e.target.classList.contains('search-input')) return;
        
        const siteId = e.target.dataset.siteId;
        if (!siteId) return;

        clearTimeout(e.target.searchTimeout);
        e.target.searchTimeout = setTimeout(() => {
            const siteData = sitesData.get(siteId);
            if (siteData) {
                siteData.currentPage = 1;
                sitesData.set(siteId, siteData);
                loadLinks(siteId);
            }
        }, 500);
    });

    // Initialize create form
    document.getElementById('create-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = e.target.querySelector('button[type="submit"]');

        try {
            // Prepare form data
            const formData = {
                target_url: form.target_url.value,
                slug: form.slug.value,
                title: form.title.value || ''
            };

            if (editingLinkId) {
                // Use the site from the original link data
                const activeHeader = document.querySelector('.accordion-header.active');
                const siteData = sitesData.get(activeHeader.dataset.siteId);
                sitesData.set('current', siteData);
            } else {
                // For new links, validate and get site from selector
                const siteValue = document.getElementById('create-site').value;
                if (!siteValue) {
                    showStatus('Please select a site', true);
                    return;
                }
                const site = JSON.parse(siteValue);
                sitesData.set('current', site);
            }

            const endpoint = editingLinkId ? `links/${editingLinkId}` : 'links';
            const method = editingLinkId ? 'PUT' : 'POST';
            
            await apiRequest(endpoint, {
                method,
                body: JSON.stringify(formData)
            });

            showStatus(`PrettyLink ${editingLinkId ? 'updated' : 'created'} successfully!`);
            e.target.reset();
            editingLinkId = null;
            window.currentLinkData = null;
            submitButton.textContent = 'Create PrettyLink';
            
            // Refresh the active site's links
            const activeHeader = document.querySelector('.accordion-header.active');
            if (activeHeader) {
                loadLinks(activeHeader.dataset.siteId);
            }
        } catch (error) {
            showStatus(`Failed to ${editingLinkId ? 'update' : 'create'} PrettyLink: ${error.message}`, true);
        }
    });

    // Handle link actions
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('copy-btn')) {
            await navigator.clipboard.writeText(e.target.dataset.url);
            showStatus('URL copied to clipboard!');
        } else if (e.target.classList.contains('edit-btn')) {
            await editLink(e.target.dataset.id);
        } else if (e.target.classList.contains('insert-btn')) {
            await insertLink(e.target.dataset.url, e.target.dataset.text);
        } else if (e.target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this link?')) {
                await deleteLink(e.target.dataset.id);
            }
        }
    });

    async function editLink(id) {
        try {
            const { data } = await apiRequest(`links/${id}`);
            
            editingLinkId = id;
            window.currentLinkData = data;

            // Switch to create tab
            document.querySelector('[data-tab="create-tab"]').click();
            
            // Update submit button text
            const submitButton = document.getElementById('create-form').querySelector('button[type="submit"]');
            submitButton.textContent = 'Update PrettyLink';
            
            // Populate form fields
            document.getElementById('target-url').value = data.target_url;
            document.getElementById('slug').value = data.slug;
            document.getElementById('title').value = data.title;
        } catch (error) {
            showStatus('Failed to load link: ' + error.message, true);
        }
    }

    // Reset create form when switching to create tab
    document.querySelector('[data-tab="create-tab"]').addEventListener('click', () => {
        const siteSelect = document.getElementById('create-site');
        if (!editingLinkId) {
            siteSelect.value = ''; // Only reset site selection if not editing
        }
        const submitButton = document.getElementById('create-form').querySelector('button[type="submit"]');
        submitButton.textContent = 'Create PrettyLink';
        if (!editingLinkId) {
            document.getElementById('create-form').reset();
        }
    });

    async function insertLink(url, text) {
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

    async function deleteLink(id) {
        try {
            await apiRequest(`links/${id}`, { method: 'DELETE' });
            showStatus('Link deleted successfully!');
            
            // Refresh the active site's links
            const activeHeader = document.querySelector('.accordion-header.active');
            if (activeHeader) {
                loadLinks(activeHeader.dataset.siteId);
            }
        } catch (error) {
            showStatus('Failed to delete link: ' + error.message, true);
        }
    }

    // Initialize the popup
    await initializeSiteSelectors();

    // Listen for extracted links
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === 'extractedLinks') {
            showStatus(`Found ${request.links.length} links on the page`);
        }
    });

});