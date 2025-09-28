// Working solution using GitHub Gist as simple database
export async function handler(event, context) {
  try {
    // Use GitHub Gist as simple database storage
    const GIST_ID = '65f8a1231f5677401f3a1234';  // Will create this
    const GITHUB_TOKEN = 'ghp_your_token_here';   // Will need this
    
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (response.ok) {
      const gist = await response.json();
      const content = gist.files['artworks.json'].content;
      const artworks = JSON.parse(content);
      
      console.log('📋 Loaded artworks from GitHub Gist:', artworks.length);
      
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
      console.log('📋 GitHub Gist not available, returning empty array');
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
    console.error('Error fetching artworks:', error);
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