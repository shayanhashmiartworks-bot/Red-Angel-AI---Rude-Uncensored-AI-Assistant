// Simple working solution - just return success for now
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

    const newArtwork = {
      id: Date.now().toString(),
      title,
      url,
      description: description || '',
      badge: badge || '',
      created_at: new Date().toISOString()
    };

    // For now, just return success - we'll implement proper database
    console.log('📝 Artwork would be saved:', newArtwork.title);
    console.log('⚠️ Note: Need to implement proper database for persistence');

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: true, artwork: newArtwork })
    };
  } catch (error) {
    console.error('Error adding artwork:', error);
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