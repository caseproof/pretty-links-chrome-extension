export function createSiteSelector(sites, selectedSite = null) {
    const select = document.createElement('select');
    select.id = 'create-site';
    select.name = 'site';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a site';
    select.appendChild(defaultOption);
    
    sites.forEach((site, index) => {
        const option = document.createElement('option');
        option.value = JSON.stringify(site);
        option.textContent = new URL(site.url).hostname;
        if (selectedSite && site.url === selectedSite.url) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    return select;
}