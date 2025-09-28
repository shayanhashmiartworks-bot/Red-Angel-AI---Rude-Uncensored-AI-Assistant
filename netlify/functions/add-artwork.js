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
    const { title, url, description, badge } = JSON.parse(event.body);
    
    if (!title || !url) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Title and URL are required' })
      };
    }

    // JSONBin configuration
    const BIN_ID = '65f8a1231f5677401f3a1234'; // Replace with your actual bin ID
    const API_KEY = '$2a$10$your-jsonbin-api-key-here'; // Replace with your actual API key

    console.log('📝 Adding artwork to JSONBin:', title);

    // First, get existing artworks
    const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    let artworks = [];
    if (getResponse.ok) {
      const data = await getResponse.json();
      artworks = data.record || [];
    }

    // Create new artwork
    const newArtwork = {
      id: Date.now().toString(),
      title,
      url,
      description: description || '',
      badge: badge || '',
      created_at: new Date().toISOString()
    };

    // Add to artworks array
    artworks.unshift(newArtwork);

    // Save back to JSONBin
    const saveResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(artworks)
    });

    if (saveResponse.ok) {
      console.log('✅ Artwork saved to JSONBin successfully:', newArtwork.title);
      return {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ success: true, artwork: newArtwork })
      };
    } else {
      console.error('❌ Failed to save to JSONBin:', saveResponse.status);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Failed to save artwork' })
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