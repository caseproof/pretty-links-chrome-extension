// Content script for link operations
console.log('[PrettyLinks] Content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[PrettyLinks] Message received:', request);
    
    if (request.type === 'insertLink') {        
        const { url, text } = request.data;
        console.log('[PrettyLinks] Attempting to insert link:', { url, text });
        
        try {
            // Get the active element and its context
            const activeElement = document.activeElement;
            console.log('[PrettyLinks] Active element:', activeElement?.tagName, activeElement?.id);
            
            if (!activeElement) {
                throw new Error('No active element found - please click into an editable area first');
            }

            let inserted = false;
            
            // Try each insertion method in order of specificity
            if (document.querySelector('.block-editor-block-list__layout')) {
                console.log('[PrettyLinks] Detected WordPress Gutenberg editor');
                inserted = insertGutenbergLink(url, text);
            } else if (document.querySelector('.wp-editor-area')) {
                console.log('[PrettyLinks] Detected WordPress Classic editor');
                inserted = insertClassicEditorLink(url, text);
            } else if (activeElement?.contentDocument || activeElement?.contentWindow) {
                console.log('[PrettyLinks] Detected iframe editor');
                inserted = insertIframeLink(activeElement, url, text);
            } else if (activeElement?.isContentEditable || activeElement?.closest('[contenteditable="true"]')) {
                console.log('[PrettyLinks] Detected contenteditable element');
                inserted = insertContentEditableLink(url, text);
            } else if (activeElement?.tagName === 'TEXTAREA' || activeElement?.tagName === 'INPUT') {
                console.log('[PrettyLinks] Detected input/textarea');
                inserted = insertInputLink(activeElement, url, text);
            } else {
                throw new Error('No editable area found - please click into an editor first');
            }
            
            if (!inserted) {
                throw new Error('Failed to insert link - please try clicking into the editor again');
            }
            
            console.log('[PrettyLinks] Link inserted successfully');
            sendResponse({ success: true });
        } catch (error) {
            console.error('[PrettyLinks] Link insertion failed:', error);
            sendResponse({ success: false, error: error.message });
        }
        return true; // Keep the message channel open for async response
    }
    return false;
});

function insertGutenbergLink(url, text) {
    try {
        // Just insert the URL as plain text for Gutenberg
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(url));
            return true;
        }
        return false;
    } catch (error) {
        console.error('[PrettyLinks] Gutenberg insertion failed:', error);
        return false;
    }
}

function insertClassicEditorLink(url, text) {
    if (document.getElementById('content')) {
        // Visual editor
        const editor = document.getElementById('content');
        const link = `<a href="${url}">${text || url}</a>`;
        editor.focus();
        document.execCommand('insertHTML', false, link);
        return true;
    } else if (document.getElementById('content-html')) {
        // HTML editor
        const editor = document.getElementById('content-html');
        const link = `<a href="${url}">${text || url}</a>`;
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + link + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + link.length;
        return true;
    }
    return false;
}

function insertIframeLink(iframe, url, text) {
    try {
        // For Google Docs, just insert the URL as plain text
        if (document.querySelector('.docs-editor')) {
            // Get all editable iframes in Google Docs
            const editableIframes = Array.from(document.querySelectorAll('.docs-texteventtarget-iframe'));
            
            // Find the active iframe
            const activeIframe = editableIframes.find(iframe => {
                try {
                    return iframe.contentDocument.activeElement === iframe.contentDocument.body;
                } catch (e) {
                    return false;
                }
            });
            
            if (activeIframe) {
                // Use execCommand to insert text into the active iframe
                const doc = activeIframe.contentDocument;
                doc.execCommand('insertText', false, url);
                return true;
            }
        } else {
            // For other iframes, try to create a proper link
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            const selection = iframeDocument.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const link = iframeDocument.createElement('a');
                link.href = url;
                link.textContent = text || url;
                range.deleteContents();
                range.insertNode(link);
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('[PrettyLinks] Iframe insertion failed:', error);
        return false;
    }
}

function insertContentEditableLink(url, text) {
    try {
        const selection = window.getSelection();
        
        if (!selection || !selection.rangeCount) {
            // Get the contenteditable element
            const editable = document.activeElement.isContentEditable ? 
                document.activeElement : 
                document.activeElement.closest('[contenteditable="true"]');
                
            if (editable) {
                // Create a new range at the end
                const range = document.createRange();
                range.selectNodeContents(editable);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
        
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const link = document.createElement('a');
            link.href = url;
            link.textContent = text || url;
            
            // Only delete contents if there's a selection
            if (!range.collapsed) {
                range.deleteContents();
            }
            
            range.insertNode(link);
            
            // Move cursor after link
            range.setStartAfter(link);
            range.setEndAfter(link);
            selection.removeAllRanges();
            selection.addRange(range);
            
            return true;
        }
        throw error;
    } catch (error) {
        console.error('[PrettyLinks] Contenteditable insertion failed:', error);
        return false;
    }
}

function insertInputLink(element, url, text) {
    try {
        const start = element.selectionStart;
        const end = element.selectionEnd;
        const value = element.value;
        const linkText = element.type === 'text' ? 
            `[${text || url}](${url})` : 
            `<a href="${url}">${text || url}</a>`;
        
        element.value = value.substring(0, start) + linkText + value.substring(end);
        element.selectionStart = element.selectionEnd = start + linkText.length;
        element.focus();
        
        return true;
    } catch (error) {
        console.error('[PrettyLinks] Input insertion failed:', error);
        return false;
    }
}