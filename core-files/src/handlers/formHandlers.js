import { showStatus } from '../utils/notifications.js';
import { createLink, updateLink } from '../services/links.js';
import { validateFormData } from '../utils/validation.js';
import { updateSubmitButton } from '../utils/dom.js';

export function handleFormSubmit(getEditingLinkId, sitesData, onSuccess) {    
    return async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const siteSelector = document.getElementById('create-site');
        const editingLinkId = getEditingLinkId();
        
        const formData = {
            target_url: form.target_url.value,
            slug: form.slug.value,
            title: form.title.value || ''
        };

        // Get the selected site
        const selectedSite = siteSelector.value ? JSON.parse(siteSelector.value) : null;

        // Validate form data
        const errors = validateFormData(formData);
        if (errors.length > 0) {
            showStatus(errors[0], true);
            return;
        }

        try {
            if (editingLinkId) {
                await updateLink(editingLinkId, formData, selectedSite);
            } else {
                if (!selectedSite) {
                    showStatus('Please select a site', true);
                    return;
                }
                await createLink(formData, selectedSite);
            }

            showStatus(`PrettyLink ${editingLinkId ? 'updated' : 'created'} successfully!`);
            form.reset();
            updateSubmitButton(false);
            
            if (onSuccess) onSuccess();
        } catch (error) {
            showStatus(`Failed to ${editingLinkId ? 'update' : 'create'} PrettyLink: ${error.message}`, true);
        }
    };
}