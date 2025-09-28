# JSONBin Setup Guide

## Step 1: Create JSONBin Account
1. Go to [jsonbin.io](https://jsonbin.io)
2. Sign up for a free account
3. Get your API key from the dashboard

## Step 2: Create a Bin
1. Click "Create Bin"
2. Set the data to: `[]` (empty array)
3. Copy the Bin ID (looks like: `65f8a1231f5677401f3a1234`)

## Step 3: Update Netlify Functions
Replace these values in all 3 function files:

### In `netlify/functions/get-artworks.js`:
```javascript
const BIN_ID = 'YOUR_ACTUAL_BIN_ID_HERE';
const API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
```

### In `netlify/functions/add-artwork.js`:
```javascript
const BIN_ID = 'YOUR_ACTUAL_BIN_ID_HERE';
const API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
```

### In `netlify/functions/delete-artwork.js`:
```javascript
const BIN_ID = 'YOUR_ACTUAL_BIN_ID_HERE';
const API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
```

## Step 4: Deploy
1. Push changes to GitHub
2. Netlify will auto-deploy
3. Test uploads - they should persist!

## How it works:
- **JSONBin stores your data** in the cloud
- **All visitors see the same data** 
- **Uploads persist forever** (until you delete them)
- **Free tier**: 10,000 requests/month

## Test it:
1. Upload a Pinterest URL
2. Refresh the page
3. Check from another device
4. It should be visible everywhere!
