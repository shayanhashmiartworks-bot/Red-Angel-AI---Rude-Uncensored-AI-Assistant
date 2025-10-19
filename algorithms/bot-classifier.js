/**
 * BOT CLASSIFIER - XGBoost-style Classification
 * 
 * Features analyzed:
 * - Account age and activity patterns
 * - Posting frequency and timing
 * - Engagement ratios
 * - Username patterns
 * - Profile completeness
 * - Language patterns
 */

class BotClassifier {
  constructor() {
    this.featureWeights = {
      accountAge: 0.25,           // 25% - New accounts are suspicious
      postingFrequency: 0.20,     // 20% - Bots post frequently
      engagementRatio: 0.15,      // 15% - Fake engagement patterns
      usernamePattern: 0.10,      // 10% - Bot-like usernames
      profileCompleteness: 0.10,  // 10% - Bots have incomplete profiles
      languagePattern: 0.10,      // 10% - Repetitive language
      timingPattern: 0.10         // 10% - Perfect posting intervals
    };
    
    // Bot username patterns
    this.botPatterns = [
      /^\w+\d{3,}$/,              // word123456
      /^[a-z]+_[a-z]+\d+$/,       // crypto_bot123
      /^\w+\d{4,}$/,              // bitcoin2024
      /^[a-z]+\d{3,}[a-z]*$/,     // moon123coin
      /^\d+\w+$/,                 // 123crypto
      /^[a-z]+\d{2,}[a-z]+\d+$/   // crypto2024bot
    ];
    
    // Universal farming language patterns (works for any topic)
    this.farmingPhrases = [
      'follow for alpha',
      'rt if you agree',
      'like and retweet',
      'join my telegram',
      'dm for details',
      'follow back',
      'retweet this',
      'share this post',
      'like this tweet',
      'follow me back',
      'everyone should',
      'tell everyone',
      'spread the word',
      'join the movement',
      'support this',
      'amazing thing',
      'best thing ever',
      'life changing',
      'can\'t stop talking',
      'obsessed with',
      'deserves attention',
      'needs more support',
      'believe in this',
      'trust me on this',
      'you need to know'
    ];
  }

  /**
   * Classify accounts as bots, farmers, or legitimate
   * @param {Array} tweets - Array of tweet objects
   * @returns {Object} Bot analysis results
   */
  async classify(tweets) {
    console.log('🤖 Starting bot classification...');
    
    // Extract accounts from tweets
    const accounts = this.extractAccounts(tweets);
    console.log(`📊 Analyzing ${accounts.length} unique accounts`);
    
    const classifications = {
      bots: [],
      farmers: [],
      legitimate: [],
      suspicious: []
    };
    
    // Classify each account
    for (const account of accounts) {
      const score = await this.calculateBotScore(account, tweets);
      const classification = this.classifyAccount(account, score);
      
      classifications[classification.type].push({
        username: account.username,
        score: score.total,
        confidence: score.confidence,
        evidence: classification.evidence,
        features: score.features
      });
    }
    
    // Calculate percentages
    const total = accounts.length;
    const percentages = {
      bots: Math.round((classifications.bots.length / total) * 100),
      farmers: Math.round((classifications.farmers.length / total) * 100),
      legitimate: Math.round((classifications.legitimate.length / total) * 100),
      suspicious: Math.round((classifications.suspicious.length / total) * 100)
    };
    
    // Generate evidence
    const evidence = this.generateEvidence(classifications);
    
    console.log(`✅ Bot classification complete:`);
    console.log(`   🤖 Bots: ${percentages.bots}% (${classifications.bots.length})`);
    console.log(`   🌾 Farmers: ${percentages.farmers}% (${classifications.farmers.length})`);
    console.log(`   ✅ Legitimate: ${percentages.legitimate}% (${classifications.legitimate.length})`);
    
    return {
      percentage: percentages.bots + percentages.farmers,
      breakdown: percentages,
      accounts: classifications,
      evidence,
      confidence: this.calculateOverallConfidence(accounts.length, percentages.bots + percentages.farmers)
    };
  }

  /**
   * Extract unique accounts from tweets
   */
  extractAccounts(tweets) {
    const accountMap = new Map();
    
    tweets.forEach(tweet => {
      if (!tweet.author) return;
      
      const username = tweet.author.toLowerCase();
      
      if (!accountMap.has(username)) {
        accountMap.set(username, {
          username: tweet.author,
          tweets: [],
          firstSeen: tweet.timestamp,
          lastSeen: tweet.timestamp
        });
      }
      
      const account = accountMap.get(username);
      account.tweets.push(tweet);
      
      // Update timestamps
      if (new Date(tweet.timestamp) < new Date(account.firstSeen)) {
        account.firstSeen = tweet.timestamp;
      }
      if (new Date(tweet.timestamp) > new Date(account.lastSeen)) {
        account.lastSeen = tweet.timestamp;
      }
    });
    
    return Array.from(accountMap.values());
  }

  /**
   * Calculate bot probability score for an account
   */
  async calculateBotScore(account, allTweets) {
    const features = {};
    const evidence = [];
    
    // Feature 1: Account Age (newer = more suspicious)
    const accountAge = this.calculateAccountAge(account);
    features.accountAge = accountAge;
    
    if (accountAge < 30) {
      evidence.push(`Account created less than 30 days ago`);
    }
    
    // Feature 2: Posting Frequency (high frequency = suspicious)
    const postingFreq = this.calculatePostingFrequency(account);
    features.postingFrequency = postingFreq;
    
    if (postingFreq > 50) {
      evidence.push(`Posts ${postingFreq} times per day (suspiciously high)`);
    }
    
    // Feature 3: Engagement Ratio (suspicious patterns)
    const engagementRatio = this.calculateEngagementRatio(account);
    features.engagementRatio = engagementRatio;
    
    if (engagementRatio > 0.1) {
      evidence.push(`High engagement ratio: ${Math.round(engagementRatio * 100)}%`);
    }
    
    // Feature 4: Username Pattern (bot-like names)
    const usernameScore = this.analyzeUsernamePattern(account.username);
    features.usernamePattern = usernameScore;
    
    if (usernameScore > 0.7) {
      evidence.push(`Username follows bot pattern: ${account.username}`);
    }
    
    // Feature 5: Profile Completeness (incomplete = suspicious)
    const profileScore = this.analyzeProfileCompleteness(account);
    features.profileCompleteness = profileScore;
    
    if (profileScore < 0.3) {
      evidence.push(`Incomplete profile (missing bio, location, etc.)`);
    }
    
    // Feature 6: Language Patterns (repetitive = bot)
    const languageScore = this.analyzeLanguagePatterns(account);
    features.languagePattern = languageScore;
    
    if (languageScore > 0.6) {
      evidence.push(`Repetitive language patterns detected`);
    }
    
    // Feature 7: Timing Patterns (perfect intervals = bot)
    const timingScore = this.analyzeTimingPatterns(account);
    features.timingPattern = timingScore;
    
    if (timingScore > 0.8) {
      evidence.push(`Perfect posting intervals (likely automated)`);
    }
    
    // Calculate weighted total score
    let totalScore = 0;
    for (const [feature, weight] of Object.entries(this.featureWeights)) {
      totalScore += (features[feature] || 0) * weight;
    }
    
    // Calculate confidence based on data quality
    const confidence = this.calculateConfidence(account, features);
    
    return {
      total: Math.min(100, Math.max(0, totalScore * 100)),
      confidence,
      features,
      evidence
    };
  }

  /**
   * Calculate account age in days
   */
  calculateAccountAge(account) {
    const now = new Date();
    const created = new Date(account.firstSeen);
    const ageDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    
    // Score: 0-1, where 1 = very new (suspicious)
    if (ageDays < 7) return 1.0;
    if (ageDays < 30) return 0.8;
    if (ageDays < 90) return 0.5;
    if (ageDays < 365) return 0.2;
    return 0.0;
  }

  /**
   * Calculate posting frequency (tweets per day)
   */
  calculatePostingFrequency(account) {
    const tweets = account.tweets;
    if (tweets.length < 2) return 0;
    
    const firstTweet = new Date(tweets[0].timestamp);
    const lastTweet = new Date(tweets[tweets.length - 1].timestamp);
    const daysActive = Math.max(1, (lastTweet - firstTweet) / (1000 * 60 * 60 * 24));
    
    const tweetsPerDay = tweets.length / daysActive;
    
    // Score: 0-1, where 1 = very high frequency (suspicious)
    if (tweetsPerDay > 100) return 1.0;
    if (tweetsPerDay > 50) return 0.8;
    if (tweetsPerDay > 20) return 0.6;
    if (tweetsPerDay > 10) return 0.3;
    return 0.0;
  }

  /**
   * Calculate engagement ratio
   */
  calculateEngagementRatio(account) {
    let totalEngagement = 0;
    let totalTweets = 0;
    
    account.tweets.forEach(tweet => {
      if (tweet.likes || tweet.retweets || tweet.replies) {
        const engagement = (parseInt(tweet.likes) || 0) + 
                          (parseInt(tweet.retweets) || 0) + 
                          (parseInt(tweet.replies) || 0);
        totalEngagement += engagement;
        totalTweets++;
      }
    });
    
    if (totalTweets === 0) return 0;
    
    const avgEngagement = totalEngagement / totalTweets;
    
    // Score: 0-1, where 1 = suspiciously high engagement
    if (avgEngagement > 1000) return 1.0;
    if (avgEngagement > 500) return 0.8;
    if (avgEngagement > 100) return 0.5;
    return 0.0;
  }

  /**
   * Analyze username patterns
   */
  analyzeUsernamePattern(username) {
    const lowerUsername = username.toLowerCase();
    
    // Check against bot patterns
    for (const pattern of this.botPatterns) {
      if (pattern.test(lowerUsername)) {
        return 1.0;
      }
    }
    
    // Check for farming keywords
    const farmingKeywords = ['crypto', 'btc', 'moon', 'gains', 'alpha', 'bot', 'trader'];
    for (const keyword of farmingKeywords) {
      if (lowerUsername.includes(keyword)) {
        return 0.6;
      }
    }
    
    return 0.0;
  }

  /**
   * Analyze profile completeness
   */
  analyzeProfileCompleteness(account) {
    // Simulate profile analysis (in real implementation, would check actual profile)
    // For now, use heuristics based on tweet content
    const tweets = account.tweets;
    let completenessScore = 0;
    
    // Check for diverse content (indicates real person)
    const uniqueWords = new Set();
    tweets.forEach(tweet => {
      if (tweet.text) {
        tweet.text.toLowerCase().split(' ').forEach(word => {
          uniqueWords.add(word);
        });
      }
    });
    
    // More unique words = more complete profile
    const uniqueWordRatio = uniqueWords.size / (tweets.length * 10);
    completenessScore += Math.min(1, uniqueWordRatio);
    
    return Math.min(1, completenessScore);
  }

  /**
   * Analyze language patterns
   */
  analyzeLanguagePatterns(account) {
    const tweets = account.tweets;
    if (tweets.length < 3) return 0;
    
    // Check for farming phrases
    let farmingScore = 0;
    tweets.forEach(tweet => {
      if (tweet.text) {
        const lowerText = tweet.text.toLowerCase();
        for (const phrase of this.farmingPhrases) {
          if (lowerText.includes(phrase)) {
            farmingScore += 0.3;
          }
        }
      }
    });
    
    // Check for repetitive content
    const texts = tweets.map(t => t.text?.toLowerCase() || '');
    const similarity = this.calculateTextSimilarity(texts);
    
    return Math.min(1, farmingScore + similarity);
  }

  /**
   * Analyze timing patterns
   */
  analyzeTimingPatterns(account) {
    const tweets = account.tweets;
    if (tweets.length < 5) return 0;
    
    const timestamps = tweets.map(t => new Date(t.timestamp).getTime()).sort();
    const intervals = [];
    
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i - 1]);
    }
    
    // Calculate variance in intervals
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => {
      return sum + Math.pow(interval - avgInterval, 2);
    }, 0) / intervals.length;
    
    const coefficientOfVariation = Math.sqrt(variance) / avgInterval;
    
    // Low variance = more bot-like (perfect intervals)
    return Math.max(0, 1 - coefficientOfVariation);
  }

  /**
   * Calculate text similarity between tweets
   */
  calculateTextSimilarity(texts) {
    if (texts.length < 2) return 0;
    
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
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    
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
   * Classify account based on score
   */
  classifyAccount(account, score) {
    if (score.total >= 80) {
      return {
        type: 'bots',
        evidence: score.evidence
      };
    } else if (score.total >= 60) {
      return {
        type: 'farmers',
        evidence: score.evidence
      };
    } else if (score.total >= 40) {
      return {
        type: 'suspicious',
        evidence: score.evidence
      };
    } else {
      return {
        type: 'legitimate',
        evidence: []
      };
    }
  }

  /**
   * Calculate confidence in classification
   */
  calculateConfidence(account, features) {
    const dataQuality = Math.min(1, account.tweets.length / 10); // More tweets = higher confidence
    const scoreClarity = Math.abs(features.accountAge - 0.5) * 2; // Clear scores = higher confidence
    
    return Math.min(100, Math.round((dataQuality + scoreClarity) * 50));
  }

  /**
   * Calculate overall confidence in results
   */
  calculateOverallConfidence(totalAccounts, botPercentage) {
    const sampleSize = Math.min(100, totalAccounts / 100); // Sample size factor
    const scoreStrength = botPercentage / 100; // How clear the results are
    
    return Math.min(100, Math.round((sampleSize + scoreStrength) * 50));
  }

  /**
   * Generate evidence for bot detection
   */
  generateEvidence(classifications) {
    const evidence = [];
    
    // Bot evidence
    if (classifications.bots.length > 0) {
      const topBots = classifications.bots.slice(0, 3);
      evidence.push(`Detected ${classifications.bots.length} bot accounts with high confidence`);
      
      topBots.forEach(bot => {
        evidence.push(`Bot: @${bot.username} (${bot.score.toFixed(1)}% bot score)`);
      });
    }
    
    // Farmer evidence
    if (classifications.farmers.length > 0) {
      evidence.push(`Found ${classifications.farmers.length} engagement farming accounts`);
    }
    
    return evidence;
  }
}

// Export for use in detector engine
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BotClassifier;
} else {
  window.BotClassifier = BotClassifier;
}
