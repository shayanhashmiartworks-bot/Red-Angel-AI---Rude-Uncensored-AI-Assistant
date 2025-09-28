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

    // JSONBin configuration
    const BIN_ID = '68d92fc243b1c97be952fc32';
    const API_KEY = '$2a$10$tJ8/aXrDom83hAcdzvw7S.TXNJ.zLA6TVTz8Wt9EahvZqa0cHqrBa';

    console.log('📝 Adding artwork to JSONBin:', title);

    // First, get existing artworks
    console.log('🔍 Fetching existing artworks from JSONBin...');
    const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 JSONBin GET response status:', getResponse.status);
    
    let artworks = [];
    if (getResponse.ok) {
      const data = await getResponse.json();
      artworks = data.record?.artworks || [];
      console.log('📋 Found existing artworks:', artworks.length);
    } else {
      console.error('❌ Failed to fetch existing artworks:', getResponse.status, getResponse.statusText);
      const errorText = await getResponse.text();
      console.error('❌ JSONBin error details:', errorText);
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

    // Save back to JSONBin
    const saveData = { artworks: artworks };
    console.log('💾 Saving to JSONBin:', JSON.stringify(saveData, null, 2));
    
    const saveResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(saveData)
    });

    console.log('📡 JSONBin PUT response status:', saveResponse.status);

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
      const errorText = await saveResponse.text();
      console.error('❌ JSONBin save error details:', errorText);
      
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'Failed to save artwork',
          details: `JSONBin returned ${saveResponse.status}: ${errorText}`
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