// JSONBin implementation for persistent storage
export async function handler(event, context) {
  // Set longer timeout for large files
  context.callbackWaitsForEmptyEventLoop = false;
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('📥 Raw request body:', event.body);
    console.log('📥 Request headers:', event.headers);
    
    const body = JSON.parse(event.body);
    console.log('📥 Parsed body:', body);
    
    const { title, url, description, badge } = body;
    
    console.log('📥 Extracted fields:', { title, url, description, badge });
    
    if (!url) {
      console.error('❌ Missing URL field');
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    // Cloudinary configuration
    const CLOUD_NAME = 'dsznaynix';
    const API_KEY = '328544335375744';
    const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'your-api-secret-here';

    console.log('📝 Adding artwork to Cloudinary:', title);

    // First, get existing artworks from Cloudinary
    console.log('🔍 Fetching existing artworks from Cloudinary...');
    const getResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?type=upload&prefix=boredm-gallery/metadata/&max_results=500`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')}`
      }
    });

    console.log('📡 Cloudinary GET response status:', getResponse.status);
    
    let artworks = [];
    if (getResponse.ok) {
      const data = await getResponse.json();
      // Find the metadata file
      const metadataFile = data.resources?.find(resource => resource.public_id === 'boredm-gallery/metadata/artworks');
      if (metadataFile) {
        // Download the metadata file content
        const metadataResponse = await fetch(metadataFile.secure_url);
        const metadataData = await metadataResponse.json();
        artworks = metadataData.artworks || [];
        console.log('📋 Found existing artworks:', artworks.length);
      } else {
        console.log('📋 No existing metadata found, starting fresh');
      }
    } else {
      console.error('❌ Failed to fetch existing artworks:', getResponse.status, getResponse.statusText);
      const errorText = await getResponse.text();
      console.error('❌ Cloudinary error details:', errorText);
    }

    // Create new artwork
    const newArtwork = {
      id: Date.now().toString(),
      title: title || 'Untitled',
      url,
      description: description || '',
      badge: badge || '',
      created_at: new Date().toISOString()
    };

    console.log('🆕 Creating new artwork:', newArtwork);

    // Add to artworks array
    artworks.unshift(newArtwork);
    console.log('📋 Total artworks after adding:', artworks.length);

    // Save back to Cloudinary as a JSON file
    const saveData = { artworks: artworks };
    console.log('💾 Saving to Cloudinary:', JSON.stringify(saveData, null, 2));
    
    // Convert JSON to base64 for upload
    const jsonString = JSON.stringify(saveData);
    const base64Data = Buffer.from(jsonString).toString('base64');
    
    const formData = new FormData();
    formData.append('file', `data:application/json;base64,${base64Data}`);
    formData.append('public_id', 'boredm-gallery/metadata/artworks');
    formData.append('resource_type', 'raw');
    formData.append('overwrite', 'true');
    
    const saveResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')}`
      },
      body: formData,
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    console.log('📡 Cloudinary PUT response status:', saveResponse.status);

    if (saveResponse.ok) {
      console.log('✅ Artwork saved to Cloudinary successfully:', newArtwork.title);
      return {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ success: true, artwork: newArtwork })
      };
    } else {
      console.error('❌ Failed to save to Cloudinary:', saveResponse.status);
      const errorText = await saveResponse.text();
      console.error('❌ Cloudinary save error details:', errorText);
      
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'Failed to save artwork',
          details: `Cloudinary returned ${saveResponse.status}: ${errorText}`
        })
      };
    }
  } catch (error) {
    console.error('❌ Error adding artwork:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Failed to add artwork' })
    };
  }
}