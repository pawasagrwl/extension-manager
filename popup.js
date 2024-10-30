const extensionsList = document.getElementById('extensions-list');
const toggleAllButton = document.getElementById('toggle-all');

// Load all extensions
async function loadExtensions() {
    const extensions = await chrome.management.getAll();
    extensionsList.innerHTML = '';

    extensions.forEach(extension => {
        if (extension.id !== chrome.runtime.id) { // Exclude this extension
            const extensionDiv = document.createElement('div');
            extensionDiv.className = 'extension';

            const extensionName = document.createElement('span');
            extensionName.textContent = extension.name;

            const toggleButton = document.createElement('button');
            toggleButton.textContent = extension.enabled ? 'Disable' : 'Enable';
            toggleButton.addEventListener('click', async () => {
                await chrome.management.setEnabled(extension.id, !extension.enabled);
                loadExtensions(); // Reload the list
            });

            extensionDiv.appendChild(extensionName);
            extensionDiv.appendChild(toggleButton);
            extensionsList.appendChild(extensionDiv);
        }
    });
}

// Toggle all extensions
toggleAllButton.addEventListener('click', async () => {
    const extensions = await chrome.management.getAll();
    const areAllEnabled = extensions.every(ext => ext.enabled && ext.id !== chrome.runtime.id);

    for (const extension of extensions) {
        if (extension.id !== chrome.runtime.id) {
            await chrome.management.setEnabled(extension.id, !areAllEnabled);
        }
    }

    loadExtensions(); // Reload the list
});

// Initial load of extensions
loadExtensions();
