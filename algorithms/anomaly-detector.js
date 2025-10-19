/**
 * ANOMALY DETECTOR - Isolation Forest for Outlier Detection
 * 
 * Detects:
 * - Anomalous posting patterns
 * - Unusual account behaviors
 * - Outlier engagement patterns
 * - Suspicious timing anomalies
 */

class AnomalyDetector {
  constructor() {
    this.contamination = 0.1; // 10% of data expected to be anomalies
    this.nEstimators = 100; // Number of isolation trees
    this.maxSamples = 256; // Maximum samples per tree
    
    console.log('🎯 Anomaly Detector initialized');
  }

  /**
   * Main anomaly detection function
   * @param {Array} tweets - Array of tweet objects
   * @returns {Object} Anomaly detection results
   */
  async detect(tweets) {
    console.log('🎯 Starting anomaly detection...');
    
    if (tweets.length < 20) {
      return {
        suspiciousPercentage: 0,
        anomalies: [],
        patterns: [],
        evidence: ['Insufficient data for anomaly detection']
      };
    }
    
    try {
      // Step 1: Extract features for anomaly detection
      console.log('🔍 Step 1: Extracting features...');
      const features = await this.extractFeatures(tweets);
      
      // Step 2: Apply Isolation Forest
      console.log('🔍 Step 2: Applying Isolation Forest...');
      const anomalyScores = await this.isolationForest(features);
      
      // Step 3: Detect temporal anomalies
      console.log('🔍 Step 3: Detecting temporal anomalies...');
      const temporalAnomalies = await this.detectTemporalAnomalies(tweets);
      
      // Step 4: Detect behavioral anomalies
      console.log('🔍 Step 4: Detecting behavioral anomalies...');
      const behavioralAnomalies = await this.detectBehavioralAnomalies(tweets);
      
      // Step 5: Detect engagement anomalies
      console.log('🔍 Step 5: Detecting engagement anomalies...');
      const engagementAnomalies = await this.detectEngagementAnomalies(tweets);
      
      // Step 6: Combine and analyze results
      const combinedAnomalies = this.combineAnomalyResults(anomalyScores, temporalAnomalies, behavioralAnomalies, engagementAnomalies);
      
      // Step 7: Calculate suspicious percentage
      const suspiciousPercentage = this.calculateSuspiciousPercentage(combinedAnomalies, tweets.length);
      
      // Step 8: Generate evidence
      const evidence = this.generateAnomalyEvidence(combinedAnomalies);
      
      console.log(`✅ Anomaly detection complete: ${combinedAnomalies.length} anomalies detected`);
      
      return {
        suspiciousPercentage: Math.round(suspiciousPercentage),
        anomalies: combinedAnomalies,
        patterns: this.detectAnomalyPatterns(combinedAnomalies),
        evidence: evidence,
        confidence: this.calculateConfidence(tweets.length, combinedAnomalies.length)
      };
      
    } catch (error) {
      console.error('❌ Anomaly detection failed:', error);
      return {
        suspiciousPercentage: 0,
        anomalies: [],
        patterns: [],
        evidence: [`Error in anomaly detection: ${error.message}`]
      };
    }
  }

  /**
   * Extract features for anomaly detection
   */
  async extractFeatures(tweets) {
    const features = [];
    
    // Group tweets by account
    const accountGroups = this.groupByAccount(tweets);
    
    accountGroups.forEach((accountTweets, username) => {
      const feature = this.extractAccountFeatures(username, accountTweets);
      features.push(feature);
    });
    
    return features;
  }

  /**
   * Group tweets by account
   */
  groupByAccount(tweets) {
    const groups = new Map();
    
    tweets.forEach(tweet => {
      if (!tweet.author) return;
      
      const username = tweet.author.toLowerCase();
      
      if (!groups.has(username)) {
        groups.set(username, []);
      }
      
      groups.get(username).push(tweet);
    });
    
    return groups;
  }

  /**
   * Extract features for a single account
   */
  extractAccountFeatures(username, tweets) {
    const timestamps = tweets.map(t => new Date(t.timestamp).getTime()).sort();
    const texts = tweets.map(t => t.text || '');
    
    // Feature 1: Posting frequency (tweets per hour)
    const postingFrequency = this.calculatePostingFrequency(timestamps);
    
    // Feature 2: Posting regularity (variance in intervals)
    const postingRegularity = this.calculatePostingRegularity(timestamps);
    
    // Feature 3: Text length (average character count)
    const avgTextLength = texts.reduce((sum, text) => sum + text.length, 0) / texts.length;
    
    // Feature 4: Text diversity (unique word ratio)
    const textDiversity = this.calculateTextDiversity(texts);
    
    // Feature 5: Emoji usage (percentage of tweets with emojis)
    const emojiUsage = this.calculateEmojiUsage(texts);
    
    // Feature 6: Hashtag usage (average hashtags per tweet)
    const hashtagUsage = this.calculateHashtagUsage(texts);
    
    // Feature 7: Mention usage (average mentions per tweet)
    const mentionUsage = this.calculateMentionUsage(texts);
    
    // Feature 8: Engagement ratio (if available)
    const engagementRatio = this.calculateEngagementRatio(tweets);
    
    // Feature 9: Time distribution (spread across hours)
    const timeDistribution = this.calculateTimeDistribution(timestamps);
    
    // Feature 10: Account age (estimated)
    const accountAge = this.estimateAccountAge(tweets[0]);
    
    return {
      username: username,
      features: [
        postingFrequency,
        postingRegularity,
        avgTextLength / 100, // Normalize
        textDiversity,
        emojiUsage,
        hashtagUsage,
        mentionUsage,
        engagementRatio,
        timeDistribution,
        accountAge / 365 // Normalize to years
      ],
      metadata: {
        tweetCount: tweets.length,
        timeSpan: timestamps.length > 1 ? timestamps[timestamps.length - 1] - timestamps[0] : 0
      }
    };
  }

  /**
   * Calculate posting frequency
   */
  calculatePostingFrequency(timestamps) {
    if (timestamps.length < 2) return 0;
    
    const timeSpan = timestamps[timestamps.length - 1] - timestamps[0];
    const hours = Math.max(1, timeSpan / (1000 * 60 * 60));
    
    return timestamps.length / hours; // tweets per hour
  }

  /**
   * Calculate posting regularity (lower = more regular)
   */
  calculatePostingRegularity(timestamps) {
    if (timestamps.length < 3) return 0;
    
    const intervals = [];
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i - 1]);
    }
    
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - mean, 2), 0) / intervals.length;
    const coefficientOfVariation = Math.sqrt(variance) / mean;
    
    return coefficientOfVariation;
  }

  /**
   * Calculate text diversity
   */
  calculateTextDiversity(texts) {
    const allWords = [];
    texts.forEach(text => {
      const words = text.toLowerCase().split(' ').filter(w => w.length > 2);
      allWords.push(...words);
    });
    
    if (allWords.length === 0) return 0;
    
    const uniqueWords = new Set(allWords);
    return uniqueWords.size / allWords.length;
  }

  /**
   * Calculate emoji usage
   */
  calculateEmojiUsage(texts) {
    let tweetsWithEmojis = 0;
    
    texts.forEach(text => {
      if (text.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu)) {
        tweetsWithEmojis++;
      }
    });
    
    return tweetsWithEmojis / texts.length;
  }

  /**
   * Calculate hashtag usage
   */
  calculateHashtagUsage(texts) {
    let totalHashtags = 0;
    
    texts.forEach(text => {
      const hashtags = text.match(/#\w+/g) || [];
      totalHashtags += hashtags.length;
    });
    
    return totalHashtags / texts.length;
  }

  /**
   * Calculate mention usage
   */
  calculateMentionUsage(texts) {
    let totalMentions = 0;
    
    texts.forEach(text => {
      const mentions = text.match(/@\w+/g) || [];
      totalMentions += mentions.length;
    });
    
    return totalMentions / texts.length;
  }

  /**
   * Calculate engagement ratio
   */
  calculateEngagementRatio(tweets) {
    let totalEngagement = 0;
    let tweetsWithEngagement = 0;
    
    tweets.forEach(tweet => {
      const engagement = (parseInt(tweet.likes) || 0) + 
                        (parseInt(tweet.retweets) || 0) + 
                        (parseInt(tweet.replies) || 0);
      
      if (engagement > 0) {
        totalEngagement += engagement;
        tweetsWithEngagement++;
      }
    });
    
    return tweetsWithEngagement > 0 ? totalEngagement / tweetsWithEngagement : 0;
  }

  /**
   * Calculate time distribution
   */
  calculateTimeDistribution(timestamps) {
    const hours = new Array(24).fill(0);
    
    timestamps.forEach(timestamp => {
      const hour = new Date(timestamp).getHours();
      hours[hour]++;
    });
    
    // Calculate spread (how evenly distributed across hours)
    const maxHour = Math.max(...hours);
    const totalTweets = timestamps.length;
    const concentrationRatio = maxHour / totalTweets;
    
    return concentrationRatio;
  }

  /**
   * Estimate account age
   */
  estimateAccountAge(tweet) {
    const tweetDate = new Date(tweet.timestamp);
    const now = new Date();
    return Math.floor((now - tweetDate) / (1000 * 60 * 60 * 24));
  }

  /**
   * Isolation Forest implementation
   */
  async isolationForest(features) {
    const scores = [];
    
    features.forEach((feature, index) => {
      const score = this.calculateIsolationScore(feature.features, features);
      scores.push({
        index: index,
        username: feature.username,
        score: score,
        isAnomaly: score > 0.5, // Threshold for anomaly
        features: feature.features,
        metadata: feature.metadata
      });
    });
    
    return scores.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate isolation score for a feature vector
   */
  calculateIsolationScore(featureVector, allFeatures) {
    // Simplified isolation score calculation
    // In a real implementation, this would use multiple isolation trees
    
    const distances = [];
    
    allFeatures.forEach(otherFeature => {
      if (otherFeature.features !== featureVector) {
        const distance = this.calculateEuclideanDistance(featureVector, otherFeature.features);
        distances.push(distance);
      }
    });
    
    // Calculate average distance to nearest neighbors
    distances.sort((a, b) => a - b);
    const nearestNeighbors = distances.slice(0, 5); // Top 5 nearest neighbors
    const avgDistance = nearestNeighbors.reduce((a, b) => a + b, 0) / nearestNeighbors.length;
    
    // Normalize to 0-1 scale
    const maxPossibleDistance = Math.sqrt(featureVector.length); // Max distance in unit hypercube
    return avgDistance / maxPossibleDistance;
  }

  /**
   * Calculate Euclidean distance between two feature vectors
   */
  calculateEuclideanDistance(vector1, vector2) {
    if (vector1.length !== vector2.length) return Infinity;
    
    let sum = 0;
    for (let i = 0; i < vector1.length; i++) {
      sum += Math.pow(vector1[i] - vector2[i], 2);
    }
    
    return Math.sqrt(sum);
  }

  /**
   * Detect temporal anomalies
   */
  async detectTemporalAnomalies(tweets) {
    const anomalies = [];
    
    // Group by hour to detect unusual posting times
    const hourlyDistribution = new Array(24).fill(0);
    tweets.forEach(tweet => {
      const hour = new Date(tweet.timestamp).getHours();
      hourlyDistribution[hour]++;
    });
    
    // Find hours with unusual activity
    const avgActivity = tweets.length / 24;
    const threshold = avgActivity * 3; // 3x average = anomaly
    
    hourlyDistribution.forEach((count, hour) => {
      if (count > threshold) {
        anomalies.push({
          type: 'temporal_burst',
          hour: hour,
          count: count,
          severity: count / avgActivity,
          description: `Unusual activity at hour ${hour}: ${count} tweets (${Math.round(count / avgActivity * 10) / 10}x average)`
        });
      }
    });
    
    // Detect accounts posting at unusual times
    const accountGroups = this.groupByAccount(tweets);
    accountGroups.forEach((accountTweets, username) => {
      const postingHours = accountTweets.map(t => new Date(t.timestamp).getHours());
      const nightPosts = postingHours.filter(h => h >= 0 && h <= 6).length;
      const nightRatio = nightPosts / postingHours.length;
      
      if (nightRatio > 0.7) { // 70%+ posts at night
        anomalies.push({
          type: 'nocturnal_posting',
          username: username,
          nightRatio: nightRatio,
          severity: nightRatio,
          description: `Account ${username} posts ${Math.round(nightRatio * 100)}% of tweets at night`
        });
      }
    });
    
    return anomalies;
  }

  /**
   * Detect behavioral anomalies
   */
  async detectBehavioralAnomalies(tweets) {
    const anomalies = [];
    const accountGroups = this.groupByAccount(tweets);
    
    accountGroups.forEach((accountTweets, username) => {
      const texts = accountTweets.map(t => t.text || '');
      
      // Detect repetitive content
      const textSimilarity = this.calculateAverageTextSimilarity(texts);
      if (textSimilarity > 0.8) {
        anomalies.push({
          type: 'repetitive_content',
          username: username,
          similarity: textSimilarity,
          severity: textSimilarity,
          description: `Account ${username} has ${Math.round(textSimilarity * 100)}% similar content`
        });
      }
      
      // Detect excessive hashtag usage
      const hashtagCounts = texts.map(text => (text.match(/#\w+/g) || []).length);
      const avgHashtags = hashtagCounts.reduce((a, b) => a + b, 0) / hashtagCounts.length;
      if (avgHashtags > 10) {
        anomalies.push({
          type: 'hashtag_spam',
          username: username,
          avgHashtags: avgHashtags,
          severity: Math.min(1, avgHashtags / 20),
          description: `Account ${username} uses ${Math.round(avgHashtags)} hashtags per tweet on average`
        });
      }
      
      // Detect all-caps posts
      const capsPosts = texts.filter(text => text.length > 10 && text === text.toUpperCase()).length;
      const capsRatio = capsPosts / texts.length;
      if (capsRatio > 0.5) {
        anomalies.push({
          type: 'excessive_caps',
          username: username,
          capsRatio: capsRatio,
          severity: capsRatio,
          description: `Account ${username} uses all-caps in ${Math.round(capsRatio * 100)}% of posts`
        });
      }
    });
    
    return anomalies;
  }

  /**
   * Detect engagement anomalies
   */
  async detectEngagementAnomalies(tweets) {
    const anomalies = [];
    
    // Group by engagement level
    const engagementGroups = {
      high: [],
      medium: [],
      low: [],
      zero: []
    };
    
    tweets.forEach(tweet => {
      const engagement = (parseInt(tweet.likes) || 0) + 
                        (parseInt(tweet.retweets) || 0) + 
                        (parseInt(tweet.replies) || 0);
      
      if (engagement === 0) engagementGroups.zero.push(tweet);
      else if (engagement < 10) engagementGroups.low.push(tweet);
      else if (engagement < 100) engagementGroups.medium.push(tweet);
      else engagementGroups.high.push(tweet);
    });
    
    // Detect unusual engagement patterns
    const totalTweets = tweets.length;
    const zeroEngagementRatio = engagementGroups.zero.length / totalTweets;
    
    if (zeroEngagementRatio > 0.8) {
      anomalies.push({
        type: 'low_engagement',
        ratio: zeroEngagementRatio,
        severity: zeroEngagementRatio,
        description: `${Math.round(zeroEngagementRatio * 100)}% of tweets have zero engagement`
      });
    }
    
    // Detect accounts with suspiciously high engagement
    const accountGroups = this.groupByAccount(tweets);
    accountGroups.forEach((accountTweets, username) => {
      const engagements = accountTweets.map(t => 
        (parseInt(t.likes) || 0) + (parseInt(t.retweets) || 0) + (parseInt(t.replies) || 0)
      );
      
      const avgEngagement = engagements.reduce((a, b) => a + b, 0) / engagements.length;
      const maxEngagement = Math.max(...engagements);
      
      // Suspicious if high engagement but low follower count (would need actual data)
      if (avgEngagement > 1000 && maxEngagement > 5000) {
        anomalies.push({
          type: 'suspicious_engagement',
          username: username,
          avgEngagement: avgEngagement,
          maxEngagement: maxEngagement,
          severity: Math.min(1, avgEngagement / 10000),
          description: `Account ${username} has unusually high engagement: ${Math.round(avgEngagement)} average`
        });
      }
    });
    
    return anomalies;
  }

  /**
   * Calculate average text similarity
   */
  calculateAverageTextSimilarity(texts) {
    if (texts.length < 2) return 0;
    
    let totalSimilarity = 0;
    let comparisons = 0;
    
    for (let i = 0; i < texts.length; i++) {
      for (let j = i + 1; j < texts.length; j++) {
        const similarity = this.calculateTextSimilarity(texts[i], texts[j]);
        totalSimilarity += similarity;
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalSimilarity / comparisons : 0;
  }

  /**
   * Calculate text similarity
   */
  calculateTextSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(' ').filter(w => w.length > 2);
    const words2 = text2.toLowerCase().split(' ').filter(w => w.length > 2);
    
    if (words1.length === 0 || words2.length === 0) return 0;
    
    const allWords = [...new Set([...words1, ...words2])];
    const vector1 = allWords.map(word => words1.filter(w => w === word).length);
    const vector2 = allWords.map(word => words2.filter(w => w === word).length);
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < allWords.length; i++) {
      dotProduct += vector1[i] * vector2[i];
      norm1 += vector1[i] * vector1[i];
      norm2 += vector2[i] * vector2[i];
    }
    
    return norm1 === 0 || norm2 === 0 ? 0 : dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  /**
   * Combine anomaly results
   */
  combineAnomalyResults(isolationScores, temporalAnomalies, behavioralAnomalies, engagementAnomalies) {
    const allAnomalies = [];
    
    // Add isolation forest anomalies
    isolationScores.forEach(score => {
      if (score.isAnomaly) {
        allAnomalies.push({
          type: 'isolation_forest',
          username: score.username,
          score: score.score,
          severity: score.score,
          description: `Account ${score.username} shows anomalous behavior patterns`,
          metadata: score.metadata
        });
      }
    });
    
    // Add temporal anomalies
    allAnomalies.push(...temporalAnomalies);
    
    // Add behavioral anomalies
    allAnomalies.push(...behavioralAnomalies);
    
    // Add engagement anomalies
    allAnomalies.push(...engagementAnomalies);
    
    return allAnomalies.sort((a, b) => b.severity - a.severity);
  }

  /**
   * Calculate suspicious percentage
   */
  calculateSuspiciousPercentage(anomalies, totalTweets) {
    if (anomalies.length === 0) return 0;
    
    // Count unique accounts with anomalies
    const anomalousAccounts = new Set();
    anomalies.forEach(anomaly => {
      if (anomaly.username) {
        anomalousAccounts.add(anomaly.username);
      }
    });
    
    // Estimate total unique accounts (rough approximation)
    const estimatedTotalAccounts = Math.max(anomalousAccounts.size * 5, totalTweets / 10);
    
    return (anomalousAccounts.size / estimatedTotalAccounts) * 100;
  }

  /**
   * Detect anomaly patterns
   */
  detectAnomalyPatterns(anomalies) {
    const patterns = {
      temporal: anomalies.filter(a => a.type.includes('temporal')).length,
      behavioral: anomalies.filter(a => a.type.includes('repetitive') || a.type.includes('spam')).length,
      engagement: anomalies.filter(a => a.type.includes('engagement')).length,
      isolation: anomalies.filter(a => a.type === 'isolation_forest').length
    };
    
    return patterns;
  }

  /**
   * Generate anomaly evidence
   */
  generateAnomalyEvidence(anomalies) {
    const evidence = [];
    
    if (anomalies.length > 0) {
      evidence.push(`Detected ${anomalies.length} behavioral anomalies`);
      
      const topAnomaly = anomalies[0];
      evidence.push(`Most significant: ${topAnomaly.description}`);
      
      const anomalyTypes = new Map();
      anomalies.forEach(anomaly => {
        const count = anomalyTypes.get(anomaly.type) || 0;
        anomalyTypes.set(anomaly.type, count + 1);
      });
      
      const topType = Array.from(anomalyTypes.entries())
        .sort((a, b) => b[1] - a[1])[0];
      
      if (topType) {
        evidence.push(`Most common anomaly: ${topType[0]} (${topType[1]} instances)`);
      }
    }
    
    return evidence;
  }

  /**
   * Calculate confidence in anomaly detection
   */
  calculateConfidence(totalTweets, anomalyCount) {
    const sampleSize = Math.min(100, totalTweets / 50);
    const anomalyStrength = Math.min(10, anomalyCount);
    
    return Math.min(100, Math.round((sampleSize + anomalyStrength) * 5));
  }
}

// Export for use in detector engine
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnomalyDetector;
} else {
  window.AnomalyDetector = AnomalyDetector;
}
