export function clearActiveStates() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.classList.remove('active');
        header.nextElementSibling?.classList.remove('active');
    });
}

export function setActiveState(element) {
    element.classList.add('active');
    element.nextElementSibling?.classList.add('active');
}

export function updateSubmitButton(isEditing) {
    const submitButton = document.querySelector('#create-form button[type="submit"]');
    if (submitButton) {
        submitButton.textContent = isEditing ? 'Update PrettyLink' : 'Create PrettyLink';
    }
}