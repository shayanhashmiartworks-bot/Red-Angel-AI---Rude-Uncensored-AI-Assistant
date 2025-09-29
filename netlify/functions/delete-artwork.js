// JSONBin implementation for persistent storage
export async function handler(event, context) {
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

  if (event.httpMethod !== 'DELETE') {
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
    const { id } = event.queryStringParameters;
    
    if (!id) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Artwork ID is required' })
      };
    }

    // Cloudinary configuration
    const CLOUD_NAME = 'dsznaynix';
    const API_KEY = '328544335375744';
    const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'your-api-secret-here';

    console.log('🗑️ Deleting artwork from Cloudinary:', id);

    // First, get existing artworks from Cloudinary
    const getResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/raw?type=upload&prefix=boredm-gallery/metadata/&max_results=500`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')}`
      }
    });

    if (!getResponse.ok) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Artworks not found' })
      };
    }

    const data = await getResponse.json();
    const metadataFile = data.resources?.find(resource => resource.public_id === 'boredm-gallery/metadata/artworks');
    
    if (!metadataFile) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Artworks not found' })
      };
    }

    // Download the metadata file content
    const metadataResponse = await fetch(metadataFile.secure_url);
    const metadataData = await metadataResponse.json();
    let artworks = metadataData.artworks || [];

    // Filter out the artwork to delete
    const originalLength = artworks.length;
    artworks = artworks.filter(artwork => artwork.id !== id);

    if (artworks.length === originalLength) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Artwork not found' })
      };
    }

    // Save back to Cloudinary
    const saveData = { artworks: artworks };
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
      body: formData
    });

    if (saveResponse.ok) {
      console.log('✅ Artwork deleted from Cloudinary successfully:', id);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ success: true })
      };
    } else {
      console.error('❌ Failed to delete from Cloudinary:', saveResponse.status);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Failed to delete artwork' })
      };
    }
  } catch (error) {
    console.error('❌ Error deleting artwork:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Failed to delete artwork' })
    };
  }
}