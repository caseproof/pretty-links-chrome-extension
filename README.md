# PrettyLinks Manager Chrome Extension (v1.1)

## Overview
The PrettyLinks Manager Chrome Extension (v1.1) is designed to help you manage your WordPress PrettyLinks directly from your browser. It provides a convenient interface for viewing, searching, creating, editing, and managing your PrettyLinks without needing to access the WordPress admin panel.

https://github.com/user-attachments/assets/fe7863ee-a0b2-400c-b247-89c8415589ca

## Installation

### Manual Installation (Developer Mode)
1. Install in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the `dist` folder
   - The PrettyLinks Manager icon will appear in your toolbar



### Chrome Web Store
Coming soon! The extension will be available for easy one-click installation.

## Initial Setup

1. Click the PrettyLinks Manager icon in your Chrome toolbar
2. You'll be automatically redirected to the options page on the first install
3. Enter your WordPress site details:
   - WordPress Site URL (e.g., https://your-site.com)
   - API Key (found in PrettyLinks → Developer Tools)
4. Click "Test Connection" to verify your settings
5. Click "Save Settings" to store your configuration

## Features

![2024-12-12_21-05-14](https://github.com/user-attachments/assets/2eb3eb21-1a93-4380-8a5c-86338ea06525)

### Viewing Links
- View all your PrettyLinks in a paginated list
- Each link displays:
  - Title
  - Slug
  - Target URL
  - Action buttons (Edit, Copy, Insert, Delete)

### Searching Links
- Use the search box at the top of the popup to filter links
- Search works across title, slug, and target URL
- Results update automatically as you type

### Managing Links

#### Inserting Links
1. Focus on any text input field on a webpage
2. Click the "Insert" button on the desired link
3. The short URL will be inserted at the cursor position*

*Note: For Google Docs, please use the "Copy" button and paste manually as direct insertion is currently not supported.

#### Deleting Links
1. Click the "Delete" button on any link
2. Confirm the deletion
3. Link will be removed from your PrettyLinks

## Troubleshooting

### Common Issues
1. Google Docs Integration
   - Currently, direct link insertion in Google Docs is not supported
   - Use the "Copy" button and paste manually instead

2. Connection Failed
   - Verify your WordPress site URL is correct
   - Check that your API Key is valid
   - Ensure your WordPress site is accessible

3. Insert Not Working
   - Make sure you're focused on an editable text field
   - Some websites may restrict script injection
   - For Google Docs, use copy/paste method

4. Authorization Error
   - Verify your API Key in the options page
   - Check PrettyLinks plugin permissions

## Supported Platforms

### Editors
- WordPress Gutenberg ✅
- WordPress Classic Editor ✅
- Gmail ✅
- Regular contenteditable elements ✅
- Google Docs (Copy/paste only) ⚠️

## Technical Requirements
- Google Chrome browser
- WordPress website with PrettyLinks plugin installed
- PrettyLinks Developer Tools plugin activated
- Valid PrettyLinks API Key
- HTTPS for production sites (recommended)

## Privacy & Security
- API keys are encrypted locally
- No tracking or data collection
- Open-source codebase for transparency

## Updates
The extension can be updated by:
1. Downloading the latest version
2. Running `npm install` and `npm run build`
3. Updating the extension in Chrome using "Load unpacked"
4. Your settings will be preserved between updates

## Contributing
We welcome contributions! Please read our contributing guidelines before submitting pull requests.

## License
Copyright © 2025 PrettyLinks, LLC. All rights reserved.

## Support
For issues and feature requests, please use the GitHub issue tracker.