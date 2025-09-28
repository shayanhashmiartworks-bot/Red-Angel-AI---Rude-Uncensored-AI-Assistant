// JSONBin implementation for persistent storage
export async function handler(event, context) {
  try {
    // JSONBin configuration
    const BIN_ID = '65f8a1231f5677401f3a1234'; // Replace with your actual bin ID
    const API_KEY = '$2a$10$your-jsonbin-api-key-here'; // Replace with your actual API key
    
    console.log('📋 Fetching artworks from JSONBin...');
    
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const artworks = data.record || [];
      console.log('✅ Loaded artworks from JSONBin:', artworks.length);
      
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
      console.error('❌ JSONBin error:', response.status, response.statusText);
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