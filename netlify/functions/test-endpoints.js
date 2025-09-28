// Test endpoint to diagnose server issues
export async function handler(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Test JSONBin connection
    const BIN_ID = '68d92fc243b1c97be952fc32';
    const API_KEY = '$2a$10$tJ8/aXrDom83hAcdzvw7S.TXNJ.zLA6TVTz8Wt9EahvZqa0cHqrBa';
    
    console.log('🔍 Testing JSONBin connection...');
    
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    const testResults = {
      timestamp: new Date().toISOString(),
      netlify: 'OK',
      jsonbin_status: response.status,
      jsonbin_ok: response.ok,
      environment: {
        node_version: process.version,
        admin_password_set: !!process.env.ADMIN_PASSWORD
      }
    };
    
    if (response.ok) {
      const data = await response.json();
      testResults.jsonbin_data = {
        artworks_count: data.record?.artworks?.length || 0,
        has_record: !!data.record
      };
    } else {
      testResults.jsonbin_error = `Status: ${response.status}`;
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(testResults)
    };
  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: error.stack
      })
    };
  }
}
