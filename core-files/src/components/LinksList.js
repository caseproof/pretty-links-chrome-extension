// Links list component
export function createLinksList(links, onAction) {
    const container = document.createElement('div');
    container.className = 'links-container';

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
        container.appendChild(linkElement);
    });

    return container;
}