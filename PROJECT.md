# PrettyLinks Manager Chrome Extension

## Overview
PrettyLinks Manager is a Chrome extension that enables users to manage WordPress PrettyLinks directly from their browser. It provides functionality for creating, editing, and managing shortened URLs across multiple WordPress sites.

## Current Status
- Version: 1.1
- Development Status: Beta
- Chrome Web Store: Coming Soon

### Known Issues
- Google Docs link insertion is currently not working reliably. As a workaround, please use the "Copy" button and paste manually when working in Google Docs.

## Installation

### Manual Installation (Developer Mode)
1. Install in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `dist` folder from the built extension

### Chrome Web Store Installation
- Coming soon! The extension will be available in the Chrome Web Store for easy one-click installation.

## Requirements

### Browser Compatibility
- Chrome/Chromium-based browsers (v88+)
- Manifest V3 compliant

### WordPress Requirements
- WordPress 5.0+
- PrettyLinks Pro plugin installed and activated
- PrettyLinks Developer Tools plugin installed and activated
- REST API enabled
- Valid API key configured in an admin account

## Features

### Link Management
- Create new shortened URLs
- Edit existing links
- Delete links
- Copy links to clipboard
- Insert links into editors
- Search functionality
- Pagination (10 items per page)

### Editor Support
- WordPress Gutenberg ✅
- WordPress Classic Editor ✅
- Gmail ✅
- Regular contenteditable elements ✅
- Google Docs (Use copy/paste for now) ⚠️

### Site Management
- Multiple WordPress site support
- Site configuration storage
- Connection testing
- API key management

## Usage

1. First-time Setup:
   - Click the extension icon
   - You'll be prompted to add your first WordPress site
   - Enter your site URL and API key
   - Test the connection

2. Managing Links:
   - Click the extension icon to open the popup
   - View all your links in the "Links" tab
   - Use the search box to find specific links
   - Create new links in the "Create New" tab

3. Using Links:
   - Click "Copy" to copy a link to clipboard
   - Click "Insert" when focused in a supported editor
   - For Google Docs, use "Copy" and paste manually

## Security Features
- API keys stored securely in Chrome's sync storage
- HTTPS-only API communications
- Content security policy enforcement
- Input sanitization for all user inputs

## Performance
- Fast response times
- Efficient caching
- Minimal resource usage
- Pagination for large link collections

## Technical Details

### Architecture
1. **Background Service Worker** (`background.js`)
   - Handles extension initialization
   - Manages storage operations
   - Processes API requests
   - Implements request caching

2. **Popup Interface** (`popup.html`, `popup.js`)
   - Main user interface
   - Link management functionality
   - Site selection and configuration
   - Search and pagination
   - Link creation form

3. **Content Script** (`content.js`)
   - Link insertion into editors
   - Editor type detection
   - Cross-editor compatibility

4. **Options Page** (`options.html`, `options.js`)
   - Site configuration management
   - API key storage
   - Connection testing

### Build System
- Vite for modern build tooling
- Separate content script bundling
- Source maps for debugging
- Development mode with hot reload

## Contributing
Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License
Copyright © 2024 PrettyLinks, LLC. All rights reserved.

## Support
For issues and feature requests, please use the GitHub issue tracker.

## Future Plans
- Chrome Web Store release
- Enhanced Google Docs support
- Import/export functionality
- Advanced search filters