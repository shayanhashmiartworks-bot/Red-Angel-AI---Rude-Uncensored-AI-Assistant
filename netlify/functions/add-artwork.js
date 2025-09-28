import fs from 'fs';
import path from 'path';

const DATA_FILE = '/tmp/artworks.json';

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

    // Read existing artworks
    let artworks = [];
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        artworks = JSON.parse(data);
      }
    } catch (readError) {
      console.error('Error reading existing artworks:', readError);
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

    // Save to file
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(artworks, null, 2));
      console.log('Artwork saved successfully:', newArtwork.title);
    } catch (writeError) {
      console.error('Error saving artwork:', writeError);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Failed to save artwork' })
      };
    }

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
