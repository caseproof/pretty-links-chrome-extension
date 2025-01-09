export function validateFormData(formData) {
    const errors = [];
    
    if (!formData.target_url) {
        errors.push('Target URL is required');
    } else if (!isValidUrl(formData.target_url)) {
        errors.push('Invalid target URL format');
    }
    
    if (!formData.slug) {
        errors.push('Slug is required');
    } else if (!isValidSlug(formData.slug)) {
        errors.push('Invalid slug format');
    }
    
    return errors;
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function isValidSlug(slug) {
    return /^[a-z0-9-]+$/.test(slug);
}