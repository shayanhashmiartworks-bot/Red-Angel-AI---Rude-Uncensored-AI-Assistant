/**
 * COORDINATION DETECTOR - DBSCAN Clustering for Burst Detection
 * 
 * Detects:
 * - Coordinated posting bursts
 * - Time-based clusters
 * - Hashtag coordination
 * - Network coordination patterns
 */

class CoordinationDetector {
  constructor() {
    this.burstThreshold = 3.0; // 3x normal posting rate = burst
    this.timeWindow = 15 * 60 * 1000; // 15 minutes in milliseconds
    this.minBurstSize = 10; // Minimum accounts for a burst
    this.minSimilarity = 0.8; // Minimum similarity for coordination
    
    console.log('⏰ Coordination Detector initialized');
  }

  /**
   * Main coordination detection function
   * @param {Array} tweets - Array of tweet objects
   * @returns {Object} Coordination analysis results
   */
  async detect(tweets) {
    console.log('⏰ Starting coordination detection...');
    
    if (tweets.length < 10) {
      return {
        intensity: 0,
        bursts: [],
        coordination: [],
        evidence: ['Insufficient data for coordination analysis']
      };
    }
    
    try {
      // Step 1: Detect temporal bursts
      console.log('🔍 Step 1: Detecting temporal bursts...');
      const bursts = await this.detectTemporalBursts(tweets);
      
      // Step 2: Detect hashtag coordination
      console.log('🔍 Step 2: Detecting hashtag coordination...');
      const hashtagCoordination = await this.detectHashtagCoordination(tweets);
      
      // Step 3: Detect content coordination
      console.log('🔍 Step 3: Detecting content coordination...');
      const contentCoordination = await this.detectContentCoordination(tweets);
      
      // Step 4: Analyze coordination patterns
      console.log('🔍 Step 4: Analyzing coordination patterns...');
      const patterns = await this.analyzeCoordinationPatterns(tweets, bursts);
      
      // Step 5: Calculate coordination intensity
      const intensity = this.calculateCoordinationIntensity(bursts, hashtagCoordination, contentCoordination);
      
      // Step 6: Generate evidence
      const evidence = this.generateCoordinationEvidence(bursts, hashtagCoordination, contentCoordination);
      
      console.log(`✅ Coordination detection complete: ${bursts.length} bursts detected`);
      
      return {
        intensity: Math.round(intensity),
        bursts: bursts,
        hashtagCoordination: hashtagCoordination,
        contentCoordination: contentCoordination,
        patterns: patterns,
        evidence: evidence,
        confidence: this.calculateConfidence(tweets.length, bursts.length)
      };
      
    } catch (error) {
      console.error('❌ Coordination detection failed:', error);
      return {
        intensity: 0,
        bursts: [],
        coordination: [],
        evidence: [`Error in coordination detection: ${error.message}`]
      };
    }
  }

  /**
   * Detect temporal bursts using DBSCAN-like clustering
   */
  async detectTemporalBursts(tweets) {
    // Sort tweets by timestamp
    const sortedTweets = tweets
      .filter(t => t.timestamp)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    if (sortedTweets.length < 10) return [];
    
    const bursts = [];
    const timeSeries = this.createTimeSeries(sortedTweets);
    const baseline = this.calculateBaseline(timeSeries);
    
    // Find periods of elevated activity
    const windows = this.createTimeWindows(timeSeries, this.timeWindow);
    
    for (let i = 0; i < windows.length; i++) {
      const window = windows[i];
      const activityRate = window.tweetCount / (window.duration / (1000 * 60 * 60)); // tweets per hour
      
      if (activityRate > baseline * this.burstThreshold && window.tweetCount >= this.minBurstSize) {
        // This is a burst - analyze it
        const burst = await this.analyzeBurst(window, sortedTweets, baseline);
        if (burst) {
          bursts.push(burst);
        }
      }
    }
    
    // Merge overlapping bursts
    return this.mergeOverlappingBursts(bursts);
  }

  /**
   * Create time series from tweets
   */
  createTimeSeries(tweets) {
    const timeSeries = [];
    const timeMap = new Map();
    
    tweets.forEach(tweet => {
      const timestamp = new Date(tweet.timestamp).getTime();
      const minute = Math.floor(timestamp / (60 * 1000)) * (60 * 1000); // Round to minute
      
      if (!timeMap.has(minute)) {
        timeMap.set(minute, {
          timestamp: minute,
          count: 0,
          tweets: [],
          accounts: new Set()
        });
      }
      
      const entry = timeMap.get(minute);
      entry.count++;
      entry.tweets.push(tweet);
      entry.accounts.add(tweet.author);
    });
    
    return Array.from(timeMap.values()).sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Calculate baseline activity rate
   */
  calculateBaseline(timeSeries) {
    if (timeSeries.length === 0) return 0;
    
    const totalTweets = timeSeries.reduce((sum, entry) => sum + entry.count, 0);
    const totalTime = timeSeries[timeSeries.length - 1].timestamp - timeSeries[0].timestamp;
    const totalHours = Math.max(1, totalTime / (1000 * 60 * 60));
    
    return totalTweets / totalHours; // tweets per hour
  }

  /**
   * Create time windows for analysis
   */
  createTimeWindows(timeSeries, windowSize) {
    const windows = [];
    
    for (let i = 0; i < timeSeries.length; i++) {
      const startTime = timeSeries[i].timestamp;
      const endTime = startTime + windowSize;
      
      const windowTweets = timeSeries.filter(entry => 
        entry.timestamp >= startTime && entry.timestamp < endTime
      );
      
      if (windowTweets.length > 0) {
        windows.push({
          startTime,
          endTime,
          duration: windowSize,
          tweetCount: windowTweets.reduce((sum, entry) => sum + entry.count, 0),
          accountCount: new Set(windowTweets.flatMap(entry => Array.from(entry.accounts))).size,
          tweets: windowTweets.flatMap(entry => entry.tweets)
        });
      }
    }
    
    return windows;
  }

  /**
   * Analyze a detected burst
   */
  async analyzeBurst(window, allTweets, baseline) {
    const burstTweets = window.tweets;
    const uniqueAccounts = new Set(burstTweets.map(t => t.author));
    
    // Calculate burst metrics
    const activityRate = window.tweetCount / (window.duration / (1000 * 60 * 60));
    const intensityMultiplier = activityRate / baseline;
    const accountDiversity = uniqueAccounts.size / window.tweetCount;
    
    // Detect hashtag patterns in burst
    const hashtagPatterns = this.extractHashtagPatterns(burstTweets);
    
    // Detect content patterns in burst
    const contentPatterns = this.extractContentPatterns(burstTweets);
    
    // Calculate coordination score
    const coordinationScore = this.calculateBurstCoordinationScore(
      hashtagPatterns,
      contentPatterns,
      accountDiversity,
      intensityMultiplier
    );
    
    // Only return significant bursts
    if (coordinationScore > 0.5 || intensityMultiplier > 5) {
      return {
        id: `burst_${window.startTime}`,
        startTime: new Date(window.startTime).toISOString(),
        endTime: new Date(window.endTime).toISOString(),
        duration: window.duration / (1000 * 60), // minutes
        tweetCount: window.tweetCount,
        accountCount: uniqueAccounts.size,
        activityRate: Math.round(activityRate),
        intensityMultiplier: Math.round(intensityMultiplier * 10) / 10,
        coordinationScore: Math.round(coordinationScore * 100),
        hashtagPatterns: hashtagPatterns,
        contentPatterns: contentPatterns,
        accounts: Array.from(uniqueAccounts),
        evidence: this.generateBurstEvidence(window, intensityMultiplier, hashtagPatterns)
      };
    }
    
    return null;
  }

  /**
   * Extract hashtag patterns from burst tweets
   */
  extractHashtagPatterns(tweets) {
    const hashtagCounts = new Map();
    const hashtagCombos = new Map();
    
    tweets.forEach(tweet => {
      if (!tweet.text) return;
      
      const hashtags = tweet.text.match(/#\w+/g) || [];
      
      // Count individual hashtags
      hashtags.forEach(hashtag => {
        const count = hashtagCounts.get(hashtag) || 0;
        hashtagCounts.set(hashtag, count + 1);
      });
      
      // Count hashtag combinations
      if (hashtags.length > 1) {
        const combo = hashtags.sort().join(' ');
        const count = hashtagCombos.get(combo) || 0;
        hashtagCombos.set(combo, count + 1);
      }
    });
    
    // Find significant patterns
    const significantHashtags = Array.from(hashtagCounts.entries())
      .filter(([hashtag, count]) => count > tweets.length * 0.3)
      .sort((a, b) => b[1] - a[1]);
    
    const significantCombos = Array.from(hashtagCombos.entries())
      .filter(([combo, count]) => count > tweets.length * 0.2)
      .sort((a, b) => b[1] - a[1]);
    
    return {
      individual: significantHashtags.slice(0, 5),
      combinations: significantCombos.slice(0, 3),
      coordinationScore: this.calculateHashtagCoordinationScore(significantHashtags, tweets.length)
    };
  }

  /**
   * Extract content patterns from burst tweets
   */
  extractContentPatterns(tweets) {
    const textSimilarity = this.calculateTextSimilarity(tweets);
    const commonPhrases = this.extractCommonPhrases(tweets);
    const sentimentPatterns = this.analyzeSentimentPatterns(tweets);
    
    return {
      similarity: textSimilarity,
      commonPhrases: commonPhrases,
      sentiment: sentimentPatterns,
      coordinationScore: this.calculateContentCoordinationScore(textSimilarity, commonPhrases)
    };
  }

  /**
   * Calculate text similarity across burst tweets
   */
  calculateTextSimilarity(tweets) {
    if (tweets.length < 2) return 0;
    
    const texts = tweets.map(t => t.text?.toLowerCase() || '');
    let totalSimilarity = 0;
    let comparisons = 0;
    
    for (let i = 0; i < texts.length; i++) {
      for (let j = i + 1; j < texts.length; j++) {
        const similarity = this.cosineSimilarity(texts[i], texts[j]);
        totalSimilarity += similarity;
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalSimilarity / comparisons : 0;
  }

  /**
   * Calculate cosine similarity between two texts
   */
  cosineSimilarity(text1, text2) {
    const words1 = text1.split(' ').filter(w => w.length > 2);
    const words2 = text2.split(' ').filter(w => w.length > 2);
    
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
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  /**
   * Extract common phrases from tweets
   */
  extractCommonPhrases(tweets) {
    const phraseCounts = new Map();
    
    tweets.forEach(tweet => {
      if (!tweet.text) return;
      
      const words = tweet.text.toLowerCase().split(' ').filter(w => w.length > 2);
      
      // Extract 3-word phrases
      for (let i = 0; i < words.length - 2; i++) {
        const phrase = words.slice(i, i + 3).join(' ');
        const count = phraseCounts.get(phrase) || 0;
        phraseCounts.set(phrase, count + 1);
      }
    });
    
    return Array.from(phraseCounts.entries())
      .filter(([phrase, count]) => count > tweets.length * 0.2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }

  /**
   * Analyze sentiment patterns
   */
  analyzeSentimentPatterns(tweets) {
    const sentiments = tweets.map(tweet => this.getBasicSentiment(tweet.text || ''));
    const positiveCount = sentiments.filter(s => s > 0).length;
    const negativeCount = sentiments.filter(s => s < 0).length;
    const neutralCount = sentiments.filter(s => s === 0).length;
    
    const total = sentiments.length;
    return {
      positive: Math.round((positiveCount / total) * 100),
      negative: Math.round((negativeCount / total) * 100),
      neutral: Math.round((neutralCount / total) * 100),
      uniformity: this.calculateSentimentUniformity(sentiments)
    };
  }

  /**
   * Basic sentiment analysis
   */
  getBasicSentiment(text) {
    const positiveWords = ['good', 'great', 'amazing', 'love', 'best', 'excellent', 'wonderful', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disgusting', 'disappointed'];
    
    const words = text.toLowerCase().split(' ');
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });
    
    return score > 0 ? 1 : (score < 0 ? -1 : 0);
  }

  /**
   * Calculate sentiment uniformity (how similar sentiments are)
   */
  calculateSentimentUniformity(sentiments) {
    if (sentiments.length === 0) return 0;
    
    const positiveRatio = sentiments.filter(s => s > 0).length / sentiments.length;
    const negativeRatio = sentiments.filter(s => s < 0).length / sentiments.length;
    const neutralRatio = sentiments.filter(s => s === 0).length / sentiments.length;
    
    // High uniformity = one sentiment dominates
    const maxRatio = Math.max(positiveRatio, negativeRatio, neutralRatio);
    return maxRatio;
  }

  /**
   * Calculate hashtag coordination score
   */
  calculateHashtagCoordinationScore(significantHashtags, totalTweets) {
    if (significantHashtags.length === 0) return 0;
    
    const topHashtag = significantHashtags[0];
    const usageRatio = topHashtag[1] / totalTweets;
    
    // High usage of same hashtag = high coordination
    return Math.min(1, usageRatio * 2);
  }

  /**
   * Calculate content coordination score
   */
  calculateContentCoordinationScore(textSimilarity, commonPhrases) {
    const phraseScore = Math.min(1, commonPhrases.length / 3);
    const similarityScore = textSimilarity;
    
    return (phraseScore + similarityScore) / 2;
  }

  /**
   * Calculate burst coordination score
   */
  calculateBurstCoordinationScore(hashtagPatterns, contentPatterns, accountDiversity, intensityMultiplier) {
    const hashtagScore = hashtagPatterns.coordinationScore;
    const contentScore = contentPatterns.coordinationScore;
    const diversityPenalty = Math.max(0, 1 - accountDiversity * 2); // Low diversity = more coordinated
    
    const intensityBonus = Math.min(0.5, (intensityMultiplier - 3) / 10);
    
    return Math.min(1, (hashtagScore + contentScore + diversityPenalty + intensityBonus) / 4);
  }

  /**
   * Calculate overall coordination intensity
   */
  calculateCoordinationIntensity(bursts, hashtagCoordination, contentCoordination) {
    if (bursts.length === 0) return 0;
    
    const burstIntensity = bursts.reduce((sum, burst) => sum + burst.coordinationScore, 0) / bursts.length;
    const hashtagIntensity = hashtagCoordination;
    const contentIntensity = contentCoordination;
    
    return Math.min(100, (burstIntensity + hashtagIntensity + contentIntensity) * 33.33);
  }

  /**
   * Merge overlapping bursts
   */
  mergeOverlappingBursts(bursts) {
    if (bursts.length <= 1) return bursts;
    
    const merged = [];
    const sortedBursts = bursts.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    
    let current = sortedBursts[0];
    
    for (let i = 1; i < sortedBursts.length; i++) {
      const next = sortedBursts[i];
      
      // Check if bursts overlap (within 30 minutes)
      const timeDiff = new Date(next.startTime) - new Date(current.endTime);
      
      if (timeDiff < 30 * 60 * 1000) {
        // Merge bursts
        current = {
          ...current,
          endTime: next.endTime,
          tweetCount: current.tweetCount + next.tweetCount,
          accountCount: new Set([...current.accounts, ...next.accounts]).size,
          accounts: [...new Set([...current.accounts, ...next.accounts])]
        };
      } else {
        merged.push(current);
        current = next;
      }
    }
    
    merged.push(current);
    return merged;
  }

  /**
   * Detect hashtag coordination
   */
  async detectHashtagCoordination(tweets) {
    // This would analyze hashtag usage patterns across the entire dataset
    // For now, return a placeholder
    return 0;
  }

  /**
   * Detect content coordination
   */
  async detectContentCoordination(tweets) {
    // This would analyze content similarity patterns
    // For now, return a placeholder
    return 0;
  }

  /**
   * Analyze coordination patterns
   */
  async analyzeCoordinationPatterns(tweets, bursts) {
    // This would identify recurring patterns across bursts
    return {
      recurring: [],
      patterns: []
    };
  }

  /**
   * Generate burst evidence
   */
  generateBurstEvidence(window, intensityMultiplier, hashtagPatterns) {
    const evidence = [];
    
    evidence.push(`${window.tweetCount} tweets from ${window.accountCount} accounts in ${Math.round(window.duration / 60000)} minutes`);
    evidence.push(`${Math.round(intensityMultiplier * 10) / 10}x normal posting rate`);
    
    if (hashtagPatterns.individual.length > 0) {
      const topHashtag = hashtagPatterns.individual[0];
      evidence.push(`Top hashtag: ${topHashtag[0]} (used ${topHashtag[1]} times)`);
    }
    
    return evidence;
  }

  /**
   * Generate coordination evidence
   */
  generateCoordinationEvidence(bursts, hashtagCoordination, contentCoordination) {
    const evidence = [];
    
    if (bursts.length > 0) {
      evidence.push(`Detected ${bursts.length} coordinated posting bursts`);
      
      const avgIntensity = bursts.reduce((sum, burst) => sum + burst.intensityMultiplier, 0) / bursts.length;
      evidence.push(`Average burst intensity: ${Math.round(avgIntensity * 10) / 10}x normal rate`);
      
      if (bursts.length > 0) {
        const largestBurst = bursts.reduce((max, burst) => burst.tweetCount > max.tweetCount ? burst : max);
        evidence.push(`Largest burst: ${largestBurst.tweetCount} tweets in ${Math.round(largestBurst.duration)} minutes`);
      }
    }
    
    return evidence;
  }

  /**
   * Calculate confidence in coordination detection
   */
  calculateConfidence(totalTweets, burstCount) {
    const sampleSize = Math.min(100, totalTweets / 100);
    const burstStrength = Math.min(10, burstCount);
    
    return Math.min(100, Math.round((sampleSize + burstStrength) * 5));
  }
}

// Export for use in detector engine
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CoordinationDetector;
} else {
  window.CoordinationDetector = CoordinationDetector;
}
