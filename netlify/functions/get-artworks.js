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
        // Initialize with sample data
        artworks = [
          {
            id: '1',
            title: 'me noice',
            url: 'https://i.pinimg.com/73x/72/9a/b5/729ab5d311956865a8b7778490ca506e.jpg',
            description: 'A beautiful artwork showcasing artistic talent',
            badge: 'NEW',
            created_at: new Date().toISOString()
          }
        ];
        // Save initial data
        fs.writeFileSync(DATA_FILE, JSON.stringify(artworks, null, 2));
      }
    } catch (readError) {
      console.error('Error reading data file:', readError);
      // Return sample data if file read fails
      artworks = [
        {
          id: '1',
          title: 'me noice',
          url: 'https://i.pinimg.com/73x/72/9a/b5/729ab5d311956865a8b7778490ca506e.jpg',
          description: 'A beautiful artwork showcasing artistic talent',
          badge: 'NEW',
          created_at: new Date().toISOString()
        }
      ];
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
