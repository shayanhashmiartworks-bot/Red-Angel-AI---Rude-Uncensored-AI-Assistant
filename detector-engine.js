/**
 * RED ANGEL INTELLIGENCE - MANIPULATION DETECTION ENGINE
 * 
 * Core algorithms for detecting:
 * - Bot accounts (XGBoost-style classification)
 * - Coordination patterns (DBSCAN clustering)
 * - Script usage (Cosine similarity)
 * - Network communities (Louvain method)
 * - Anomaly detection (Isolation Forest)
 */

class ManipulationDetector {
  constructor() {
    this.algorithms = {
      botClassifier: new BotClassifier(),
      coordinationDetector: new CoordinationDetector(),
      textAnalyzer: new TextAnalyzer(),
      networkAnalyzer: new NetworkAnalyzer(),
      anomalyDetector: new AnomalyDetector()
    };
    
    console.log('🔍 Manipulation Detection Engine initialized');
  }

  /**
   * Main analysis function - orchestrates all algorithms
   * @param {Array} tweets - Array of tweet objects
   * @param {string} query - Search query or topic
   * @returns {Object} Complete manipulation analysis report
   */
  async analyze(query, tweets = []) {
    console.log(`🚀 Starting analysis for: "${query}"`);
    console.log(`📊 Processing ${tweets.length} tweets`);
    
    const startTime = Date.now();
    
    try {
      // Phase 1: Bot Classification
      console.log('🤖 Phase 1: Bot Classification...');
      const botAnalysis = await this.algorithms.botClassifier.classify(tweets);
      
      // Phase 2: Coordination Detection
      console.log('⏰ Phase 2: Coordination Detection...');
      const coordinationAnalysis = await this.algorithms.coordinationDetector.detect(tweets);
      
      // Phase 3: Text Analysis
      console.log('📝 Phase 3: Text Analysis...');
      const textAnalysis = await this.algorithms.textAnalyzer.analyze(tweets);
      
      // Phase 4: Network Analysis
      console.log('🔗 Phase 4: Network Analysis...');
      const networkAnalysis = await this.algorithms.networkAnalyzer.analyze(tweets);
      
      // Phase 5: Anomaly Detection
      console.log('🎯 Phase 5: Anomaly Detection...');
      const anomalyAnalysis = await this.algorithms.anomalyDetector.detect(tweets);
      
      // Phase 6: Generate Final Report
      console.log('📋 Phase 6: Generating Report...');
      const report = this.generateReport({
        query,
        tweets,
        botAnalysis,
        coordinationAnalysis,
        textAnalysis,
        networkAnalysis,
        anomalyAnalysis
      });
      
      const endTime = Date.now();
      console.log(`✅ Analysis complete in ${endTime - startTime}ms`);
      
      return report;
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      return this.generateErrorReport(query, error);
    }
  }

  /**
   * Generate comprehensive manipulation report
   */
  generateReport(data) {
    const {
      query,
      tweets,
      botAnalysis,
      coordinationAnalysis,
      textAnalysis,
      networkAnalysis,
      anomalyAnalysis
    } = data;

    // Calculate overall manipulation score (0-100)
    const manipulationScore = this.calculateManipulationScore({
      botAnalysis,
      coordinationAnalysis,
      textAnalysis,
      networkAnalysis,
      anomalyAnalysis
    });

    // Determine manipulation level
    let manipulationLevel = 'LOW';
    let levelEmoji = '🟢';
    
    if (manipulationScore >= 70) {
      manipulationLevel = 'HEAVILY MANIPULATED';
      levelEmoji = '🔴';
    } else if (manipulationScore >= 50) {
      manipulationLevel = 'MODERATELY MANIPULATED';
      levelEmoji = '🟡';
    } else if (manipulationScore >= 30) {
      manipulationLevel = 'SOMEWHAT MANIPULATED';
      levelEmoji = '🟠';
    }

    return {
      // Header Info
      query,
      analysisTime: new Date().toLocaleTimeString(),
      totalTweets: tweets.length,
      uniqueAccounts: this.getUniqueAccounts(tweets).length,
      
      // Overall Score
      manipulationScore: Math.round(manipulationScore),
      manipulationLevel,
      levelEmoji,
      
      // Detailed Breakdown
      breakdown: {
        bots: botAnalysis,
        coordination: coordinationAnalysis,
        scripts: textAnalysis,
        networks: networkAnalysis,
        anomalies: anomalyAnalysis
      },
      
      // Evidence
      evidence: this.compileEvidence({
        botAnalysis,
        coordinationAnalysis,
        textAnalysis,
        networkAnalysis,
        anomalyAnalysis
      }),
      
      // Bursts (if any)
      bursts: coordinationAnalysis.bursts || [],
      
      // Templates (if any)
      templates: textAnalysis.templates || [],
      
      // Confidence
      confidence: this.calculateConfidence(tweets.length, manipulationScore)
    };
  }

  /**
   * Calculate overall manipulation score from all analyses
   */
  calculateManipulationScore(analyses) {
    const weights = {
      bots: 0.35,        // 35% - Bot percentage is most important
      coordination: 0.25, // 25% - Coordination patterns
      scripts: 0.20,     // 20% - Script usage
      networks: 0.15,    // 15% - Network manipulation
      anomalies: 0.05    // 5% - Anomalous behavior
    };

    let totalScore = 0;
    
    // Bot score (percentage of bots * 100)
    totalScore += (analyses.botAnalysis.percentage || 0) * weights.bots;
    
    // Coordination score
    totalScore += (analyses.coordinationAnalysis.intensity || 0) * weights.coordination;
    
    // Script score
    totalScore += (analyses.textAnalysis.scriptPercentage || 0) * weights.scripts;
    
    // Network score
    totalScore += (analyses.networkAnalysis.manipulationScore || 0) * weights.networks;
    
    // Anomaly score
    totalScore += (analyses.anomalyAnalysis.suspiciousPercentage || 0) * weights.anomalies;

    return Math.min(100, Math.max(0, totalScore));
  }

  /**
   * Calculate confidence level based on sample size and score
   */
  calculateConfidence(sampleSize, score) {
    let confidence = 'Low';
    
    if (sampleSize >= 10000 && score > 20) {
      confidence = 'Very High';
    } else if (sampleSize >= 5000 && score > 15) {
      confidence = 'High';
    } else if (sampleSize >= 1000 && score > 10) {
      confidence = 'Medium';
    } else if (sampleSize >= 500) {
      confidence = 'Low';
    } else {
      confidence = 'Very Low';
    }
    
    return confidence;
  }

  /**
   * Get unique accounts from tweets
   */
  getUniqueAccounts(tweets) {
    const accounts = new Set();
    tweets.forEach(tweet => {
      if (tweet.author) accounts.add(tweet.author);
    });
    return Array.from(accounts);
  }

  /**
   * Compile evidence from all analyses
   */
  compileEvidence(analyses) {
    const evidence = [];
    
    // Bot evidence
    if (analyses.botAnalysis.evidence) {
      evidence.push(...analyses.botAnalysis.evidence);
    }
    
    // Coordination evidence
    if (analyses.coordinationAnalysis.evidence) {
      evidence.push(...analyses.coordinationAnalysis.evidence);
    }
    
    // Script evidence
    if (analyses.textAnalysis.evidence) {
      evidence.push(...analyses.textAnalysis.evidence);
    }
    
    // Network evidence
    if (analyses.networkAnalysis.evidence) {
      evidence.push(...analyses.networkAnalysis.evidence);
    }
    
    return evidence;
  }

  /**
   * Generate error report
   */
  generateErrorReport(query, error) {
    return {
      query,
      error: true,
      message: error.message,
      manipulationScore: 0,
      manipulationLevel: 'ERROR',
      levelEmoji: '❌',
      breakdown: {
        bots: { percentage: 0, count: 0, confidence: 0 },
        coordination: { intensity: 0, bursts: 0 },
        scripts: { percentage: 0, templates: 0 },
        networks: { communities: 0, manipulationScore: 0 },
        anomalies: { suspiciousPercentage: 0, count: 0 }
      },
      evidence: [],
      bursts: [],
      templates: [],
      confidence: 'Error'
    };
  }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ManipulationDetector;
} else {
  window.ManipulationDetector = ManipulationDetector;
}
