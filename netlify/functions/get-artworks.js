export async function handler(event, context) {
  try {
    // For now, return sample data until database is set up
    const artworks = [
      {
        id: '1',
        title: 'me noice',
        url: 'https://i.pinimg.com/73x/72/9a/b5/729ab5d311956865a8b7778490ca506e.jpg',
        description: 'A beautiful artwork showcasing artistic talent',
        badge: 'NEW',
        created_at: new Date().toISOString()
      }
    ];

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
