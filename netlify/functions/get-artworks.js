import fs from 'fs';
import path from 'path';

const DATA_FILE = '/tmp/artworks.json';

export async function handler(event, context) {
  try {
    let artworks = [];
    
    // Try to read existing data
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        artworks = JSON.parse(data);
      } else {
        // Initialize with empty array
        artworks = [];
        // Save initial empty data
        fs.writeFileSync(DATA_FILE, JSON.stringify(artworks, null, 2));
      }
    } catch (readError) {
      console.error('Error reading data file:', readError);
      // Return empty array if file read fails
      artworks = [];
    }

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
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Failed to fetch artworks' })
    };
  }
}
