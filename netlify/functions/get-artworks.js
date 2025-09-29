// Cloudinary implementation for persistent storage
export async function handler(event, context) {
  try {
    // Cloudinary configuration
    const CLOUD_NAME = 'dsznaynix';
    const API_KEY = '328544335375744';
    const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'your-api-secret-here';
    
    console.log('📋 Fetching artworks from Cloudinary...');
    
    // First, get the metadata file from Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/raw?type=upload&prefix=boredm-gallery/metadata/&max_results=500`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      // Find the metadata file
      const metadataFile = data.resources?.find(resource => resource.public_id === 'boredm-gallery/metadata/artworks');
      
      if (metadataFile) {
        // Download the metadata file content
        const metadataResponse = await fetch(metadataFile.secure_url);
        const metadataData = await metadataResponse.json();
        const artworks = metadataData.artworks || [];
        console.log('✅ Loaded artworks from Cloudinary:', artworks.length);
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
          },
          body: JSON.stringify(artworks)
        };
      } else {
        console.log('📋 No metadata file found, returning empty array');
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
          },
          body: JSON.stringify([])
        };
      }
    } else {
      console.error('❌ Cloudinary error:', response.status, response.statusText);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        },
        body: JSON.stringify([])
      };
    }
  } catch (error) {
    console.error('❌ Error fetching artworks:', error);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: JSON.stringify([])
    };
  }
}