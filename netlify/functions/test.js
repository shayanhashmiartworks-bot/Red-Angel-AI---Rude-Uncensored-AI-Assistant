// Simple test function to verify Netlify functions are working
export async function handler(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
      },
      body: ''
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    },
    body: JSON.stringify({ 
      success: true, 
      message: 'Netlify functions are working!',
      timestamp: new Date().toISOString(),
      method: event.httpMethod,
      userAgent: event.headers['user-agent'] || 'unknown'
    })
  };
}
