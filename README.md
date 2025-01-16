# PrettyLinks Manager Chrome Extension (v1.1)

## Overview
The PrettyLinks Manager Chrome Extension (v1.1) is designed to help you manage your WordPress PrettyLinks directly from your browser. It provides a convenient interface for viewing, searching, creating, editing, and managing your PrettyLinks without needing to access the WordPress admin panel.

https://github.com/user-attachments/assets/532744fd-c057-48fb-89e5-606e53558e31

## Installation

### Manual Installation (Developer Mode)
1. Download and prepare the extension:
   - Download or clone the repository
   - Run `npm install` to install dependencies
2. Install in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the `core-files` folder
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

## Screenshots

### Link Insertion
![PrettyLinks Chrome Extension Screenshot](https://github.com/user-attachments/assets/c3a510d1-c1dc-44f0-ab92-9d3448344050)

### Support Multiple Domains
![Accordion menu for multiple sites](https://github.com/user-attachments/assets/6a92ee1a-6ee1-4fdd-870b-66eea8ff9380)

### Extension Settings Page
![Extension options page](https://github.com/user-attachments/assets/f6225c08-96e3-411b-b5f4-5b1db0baa450)

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
2. Running `npm install` to update dependencies
3. Updating the extension in Chrome by clicking "Load unpacked" and selecting the `core-files` folder
4. Your settings will be preserved between updates

## Contributing
We welcome contributions! Please read our contributing guidelines before submitting pull requests.

## License
Copyright © 2024 PrettyLinks, LLC. All rights reserved.

## Support
For issues and feature requests, please use the GitHub issue tracker.
