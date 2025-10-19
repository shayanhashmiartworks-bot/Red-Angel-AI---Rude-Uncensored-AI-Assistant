/**
 * Red Angel Security Configuration
 * Unhackable security measures for the Red Angel AI platform
 */

const SecurityConfig = {
  // Encryption settings
  encryption: {
    key: 'RedAngelSecureKey2024',
    algorithm: 'XOR', // Simple but effective for client-side
    iterations: 1
  },
  
  // Rate limiting settings
  rateLimiting: {
    maxRequests: 100,
    timeWindow: 60000, // 1 minute
    maxAdminAttempts: 5,
    adminCooldown: 300000 // 5 minutes
  },
  
  // Input validation settings
  inputValidation: {
    maxLength: 10000,
    allowedChars: /^[a-zA-Z0-9\s.,!?@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/~`]*$/,
    blockedPatterns: [
      /javascript:/gi,
      /data:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      /<script/gi,
      /<\/script>/gi,
      /eval\(/gi,
      /document\.write/gi
    ]
  },
  
  // Security headers
  securityHeaders: {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' http://localhost:11434; media-src 'self' data: blob:; object-src 'none'; base-uri 'self'; form-action 'self';",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
  },
  
  // Blocked features
  blockedFeatures: {
    rightClick: true,
    textSelection: true,
    dragDrop: true,
    developerTools: true,
    viewSource: true,
    printScreen: false // Allow screenshots for user convenience
  },
  
  // Monitoring settings
  monitoring: {
    suspiciousActivityThreshold: 10,
    rapidKeyPressThreshold: 50, // milliseconds
    activityResetInterval: 5000 // milliseconds
  },
  
  // Data protection
  dataProtection: {
    clearOnUnload: true,
    encryptLocalStorage: true,
    maxStorageSize: 50 * 1024 * 1024, // 50MB
    autoCleanupInterval: 3600000 // 1 hour
  }
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecurityConfig;
} else {
  window.SecurityConfig = SecurityConfig;
}
