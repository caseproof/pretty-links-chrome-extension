# PrettyLinks Chrome Extension

## Overview
The PrettyLinks Manager Chrome Extension is designed to help you manage your WordPress PrettyLinks directly from your browser. It provides a convenient interface for viewing, searching, creating, editing, and managing your PrettyLinks without needing to access the WordPress admin panel.

## Installation
1. Download the extension files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The PrettyLinks Manager icon will appear in your Chrome toolbar

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

#### Creating New Links
1. Click "+ Add Link" at the top of the popup
2. Fill in the required fields:
   - Title
   - Slug
   - Target URL
3. Click "Add Link" to save

#### Editing Links
1. Click the "Edit" button on any link
2. Modify the desired fields
3. Click "Save Changes" to update

#### Copying Links
- Click the "Copy" button to copy the short URL to your clipboard
- A success message will confirm the copy

#### Inserting Links
1. Focus on any text input field on a webpage
2. Click the "Insert" button on the desired link
3. The short URL will be inserted at the cursor position

#### Deleting Links
1. Click the "Delete" button on any link
2. Confirm the deletion in the popup
3. The link will be permanently removed

## Pagination
- Links are displayed 10 per page
- Use the Previous/Next buttons to navigate between pages
- Current page and total pages are shown

## Troubleshooting

### Common Issues
1. Connection Failed
   - Verify your WordPress site URL is correct
   - Check that your API Key is valid
   - Ensure your WordPress site is accessible

2. Insert Not Working
   - Make sure you're focused on an editable text field
   - Some websites may restrict script injection

3. Authorization Error
   - Verify your API Key in the options page
   - Check PrettyLinks plugin permissions

### Support
If you encounter any issues:
1. Check that PrettyLinks is properly installed and activated on your WordPress site
2. Verify your API Key in PrettyLinks → Developer Tools
3. Contact MemberPress support for additional assistance

## Technical Requirements
- Google Chrome browser
- WordPress website with PrettyLinks plugin installed
- Valid PrettyLinks API Key
- HTTPS for production sites (recommended)

## Security Notes
- Your API Key is stored securely in Chrome's storage sync
- All communication with your WordPress site uses secure API endpoints
- No sensitive data is stored locally

## Updates
The extension can be updated by:
1. Downloading the latest version
2. Removing the existing extension
3. Loading the new version using "Load unpacked"
4. Your settings will be preserved between updates
