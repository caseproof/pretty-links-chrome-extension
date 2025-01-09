import { apiRequest } from '../api/client.js';

export async function getLinks(siteId, page, perPage, searchQuery = '') {
    return apiRequest('links', {
        method: 'GET',
        params: {
            page,
            per_page: perPage,
            search: searchQuery
        }
    });
}

export async function createLink(formData, site) {
    return apiRequest('links', {
        method: 'POST',
        body: JSON.stringify(formData)
    }, site);
}

export async function updateLink(id, formData, site) {
    return apiRequest(`links/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
    }, site);
}

export async function deleteLink(id) {
    return apiRequest(`links/${id}`, {
        method: 'DELETE'
    });
}

export async function getLinkById(id) {
    return apiRequest(`links/${id}`);
}