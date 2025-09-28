// JSONBin implementation for persistent storage
export async function handler(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
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
          'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
        },
        body: JSON.stringify({ error: 'Artwork ID is required' })
      };
    }

    // JSONBin configuration
    const BIN_ID = '68d92fc243b1c97be952fc32';
    const API_KEY = '$2a$10$tJ8/aXrDom83hAcdzvw7S.TXNJ.zLA6TVTz8Wt9EahvZqa0cHqrBa';

    console.log('🗑️ Deleting artwork from JSONBin:', id);

    // First, get existing artworks
    const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!getResponse.ok) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
        },
        body: JSON.stringify({ error: 'Artworks not found' })
      };
    }

    const data = await getResponse.json();
    let artworks = data.record?.artworks || [];

    // Filter out the artwork to delete
    const originalLength = artworks.length;
    artworks = artworks.filter(artwork => artwork.id !== id);

    if (artworks.length === originalLength) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
        },
        body: JSON.stringify({ error: 'Artwork not found' })
      };
    }

    // Save back to JSONBin
    const saveResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ artworks: artworks })
    });

    if (saveResponse.ok) {
      console.log('✅ Artwork deleted from JSONBin successfully:', id);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
        },
        body: JSON.stringify({ success: true })
      };
    } else {
      console.error('❌ Failed to delete from JSONBin:', saveResponse.status);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
      },
      body: JSON.stringify({ error: 'Failed to delete artwork' })
    };
  }
}