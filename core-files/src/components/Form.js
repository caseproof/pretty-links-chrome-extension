export function createLinkForm(onSubmit) {
    const form = document.createElement('form');
    form.id = 'create-form';
    
    form.innerHTML = `
        <div class="form-group">
            <label for="create-site">WordPress Site:</label>
            <select id="create-site" name="site" required>
                <option value="">Select a site</option>
            </select>
        </div>
        <div class="form-group">
            <label for="target-url">Target URL:</label>
            <input type="url" id="target-url" name="target_url" required>
        </div>
        <div class="form-group">
            <label for="slug">Slug:</label>
            <input type="text" id="slug" name="slug" required>
        </div>
        <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" id="title" name="title">
        </div>
        <button type="submit">Create PrettyLink</button>
    `;

    form.addEventListener('submit', onSubmit);
    return form;
}