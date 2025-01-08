// Content script for link operations
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'startExtraction') {
        const links = Array.from(document.links)
            .map(link => ({
                url: link.href,
                text: link.textContent.trim(),
                title: link.title || ''
            }));
        
        chrome.runtime.sendMessage({
            type: 'extractedLinks',
            links: links
        });
    } else if (request.type === 'insertLink') {
        const { url, text } = request.data;
        
        // Detect editor type
        if (document.querySelector('.block-editor')) { // WordPress Gutenberg
            insertGutenbergLink(url, text);
        } else if (document.querySelector('.docs-editor')) { // Google Docs
            insertGoogleDocsLink(url, text);
        } else {
            // Default insertion for regular content editable
            insertDefaultLink(url, text);
        }
        
        sendResponse({ success: true });
    }
    return true;
});

function insertGutenbergLink(url, text) {
    const link = `<a href="${url}">${text}</a>`;
    document.execCommand('insertHTML', false, link);
}

function insertGoogleDocsLink(url, text) {
    const script = document.createElement('script');
    script.textContent = `
        const selection = document.getSelection();
        const range = selection.getRangeAt(0);
        const link = document.createElement('a');
        link.href = '${url}';
        link.textContent = '${text}';
        range.deleteContents();
        range.insertNode(link);
    `;
    document.body.appendChild(script);
    script.remove();
}

function insertDefaultLink(url, text) {
    const link = `<a href="${url}">${text}</a>`;
    document.execCommand('insertHTML', false, link);
}