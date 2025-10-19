/**
 * TEXT ANALYZER - Script Detection and Content Analysis
 * 
 * Detects:
 * - Copy-paste content (templates)
 * - Scripted messages
 * - Coordinated messaging
 * - Language patterns
 * - Sentiment manipulation
 */

class TextAnalyzer {
  constructor() {
    this.minSimilarity = 0.85; // Minimum similarity for template detection
    this.minTemplateUsage = 3; // Minimum usage for template detection
    this.maxTemplateVariations = 0.15; // Max 15% variation allowed
    
    // Universal manipulation phrases (works for any topic)
    this.manipulationPhrases = [
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
      'you need to know',
      'game changer',
      'revolutionary',
      'mind blowing',
      'incredible',
      'unbelievable'
    ];
    
    // Template patterns
    this.templatePatterns = [
      /^(.*?)\s*🚀\s*(.*?)$/,
      /^(.*?)\s*💰\s*(.*?)$/,
      /^(.*?)\s*📈\s*(.*?)$/,
      /^(.*?)\s*🔥\s*(.*?)$/,
      /^(.*?)\s*💎\s*(.*?)$/,
      /^(.*?)\s*🌙\s*(.*?)$/
    ];
    
    console.log('📝 Text Analyzer initialized');
  }

  /**
   * Main text analysis function
   * @param {Array} tweets - Array of tweet objects
   * @returns {Object} Text analysis results
   */
  async analyze(tweets) {
    console.log('📝 Starting text analysis...');
    
    if (tweets.length < 5) {
      return {
        scriptPercentage: 0,
        templates: [],
        manipulationPhrases: [],
        evidence: ['Insufficient data for text analysis']
      };
    }
    
    try {
      // Step 1: Detect templates/scripts
      console.log('🔍 Step 1: Detecting templates and scripts...');
      const templates = await this.detectTemplates(tweets);
      
      // Step 2: Analyze manipulation phrases
      console.log('🔍 Step 2: Analyzing manipulation phrases...');
      const manipulationPhrases = await this.detectManipulationPhrases(tweets);
      
      // Step 3: Detect language patterns
      console.log('🔍 Step 3: Detecting language patterns...');
      const languagePatterns = await this.detectLanguagePatterns(tweets);
      
      // Step 4: Analyze sentiment patterns
      console.log('🔍 Step 4: Analyzing sentiment patterns...');
      const sentimentAnalysis = await this.analyzeSentimentPatterns(tweets);
      
      // Step 5: Calculate script percentage
      const scriptPercentage = this.calculateScriptPercentage(tweets, templates, manipulationPhrases);
      
      // Step 6: Generate evidence
      const evidence = this.generateTextEvidence(templates, manipulationPhrases, languagePatterns);
      
      console.log(`✅ Text analysis complete: ${templates.length} templates detected`);
      
      return {
        scriptPercentage: Math.round(scriptPercentage),
        templates: templates,
        manipulationPhrases: manipulationPhrases,
        languagePatterns: languagePatterns,
        sentimentAnalysis: sentimentAnalysis,
        evidence: evidence,
        confidence: this.calculateConfidence(tweets.length, templates.length)
      };
      
    } catch (error) {
      console.error('❌ Text analysis failed:', error);
      return {
        scriptPercentage: 0,
        templates: [],
        manipulationPhrases: [],
        evidence: [`Error in text analysis: ${error.message}`]
      };
    }
  }

  /**
   * Detect templates and scripts using similarity analysis
   */
  async detectTemplates(tweets) {
    const templates = [];
    const processedTweets = tweets.filter(t => t.text && t.text.trim().length > 10);
    
    if (processedTweets.length < this.minTemplateUsage) {
      return templates;
    }
    
    // Group tweets by similarity
    const similarityGroups = this.groupBySimilarity(processedTweets);
    
    // Analyze each group for templates
    for (const group of similarityGroups) {
      if (group.tweets.length >= this.minTemplateUsage) {
        const template = await this.analyzeTemplateGroup(group);
        if (template) {
          templates.push(template);
        }
      }
    }
    
    return templates.sort((a, b) => b.usageCount - a.usageCount);
  }

  /**
   * Group tweets by similarity
   */
  groupBySimilarity(tweets) {
    const groups = [];
    const processed = new Set();
    
    for (let i = 0; i < tweets.length; i++) {
      if (processed.has(i)) continue;
      
      const group = {
        tweets: [tweets[i]],
        indices: [i],
        similarity: 1.0
      };
      
      processed.add(i);
      
      // Find similar tweets
      for (let j = i + 1; j < tweets.length; j++) {
        if (processed.has(j)) continue;
        
        const similarity = this.calculateTextSimilarity(tweets[i].text, tweets[j].text);
        
        if (similarity >= this.minSimilarity) {
          group.tweets.push(tweets[j]);
          group.indices.push(j);
          group.similarity = Math.min(group.similarity, similarity);
          processed.add(j);
        }
      }
      
      if (group.tweets.length >= this.minTemplateUsage) {
        groups.push(group);
      }
    }
    
    return groups;
  }

  /**
   * Analyze a group of similar tweets for template patterns
   */
  async analyzeTemplateGroup(group) {
    const tweets = group.tweets;
    const texts = tweets.map(t => t.text);
    
    // Find the most common template
    const template = this.findCommonTemplate(texts);
    
    if (!template) return null;
    
    // Analyze variations
    const variations = this.analyzeVariations(template, texts);
    
    // Calculate template metrics
    const usageCount = tweets.length;
    const totalTweets = tweets.length; // This would be total tweets in dataset
    const usagePercentage = (usageCount / totalTweets) * 100;
    
    // Detect template type
    const templateType = this.classifyTemplate(template);
    
    // Generate evidence
    const evidence = this.generateTemplateEvidence(template, usageCount, variations);
    
    return {
      id: `template_${template.substring(0, 20).replace(/\s+/g, '_')}`,
      template: template,
      usageCount: usageCount,
      usagePercentage: Math.round(usagePercentage * 10) / 10,
      similarity: Math.round(group.similarity * 100),
      type: templateType,
      variations: variations,
      accounts: tweets.map(t => t.author),
      timestamps: tweets.map(t => t.timestamp),
      evidence: evidence
    };
  }

  /**
   * Find the most common template from similar texts
   */
  findCommonTemplate(texts) {
    if (texts.length === 0) return null;
    
    // Use the first text as base template
    let template = texts[0];
    
    // Find common words and structure
    const words = template.split(' ');
    const commonWords = [];
    
    for (const word of words) {
      const count = texts.filter(text => text.toLowerCase().includes(word.toLowerCase())).length;
      const percentage = (count / texts.length) * 100;
      
      if (percentage >= 80) { // Word appears in 80%+ of texts
        commonWords.push(word);
      }
    }
    
    // Reconstruct template with common words
    template = commonWords.join(' ');
    
    // Apply template patterns
    for (const pattern of this.templatePatterns) {
      const match = template.match(pattern);
      if (match) {
        template = match[0]; // Use the full matched template
        break;
      }
    }
    
    return template.length > 5 ? template : null;
  }

  /**
   * Analyze variations in template usage
   */
  analyzeVariations(template, texts) {
    const variations = [];
    const templateWords = template.toLowerCase().split(' ');
    
    texts.forEach((text, index) => {
      const textWords = text.toLowerCase().split(' ');
      const differences = [];
      
      // Find words that differ from template
      for (let i = 0; i < Math.max(templateWords.length, textWords.length); i++) {
        const templateWord = templateWords[i] || '';
        const textWord = textWords[i] || '';
        
        if (templateWord !== textWord) {
          differences.push({
            position: i,
            templateWord: templateWord,
            actualWord: textWord
          });
        }
      }
      
      if (differences.length > 0) {
        variations.push({
          index: index,
          text: text,
          differences: differences,
          variationPercentage: (differences.length / Math.max(templateWords.length, textWords.length)) * 100
        });
      }
    });
    
    return variations.slice(0, 5); // Return top 5 variations
  }

  /**
   * Classify template type
   */
  classifyTemplate(template) {
    const lowerTemplate = template.toLowerCase();
    
    if (lowerTemplate.includes('follow') || lowerTemplate.includes('rt')) {
      return 'engagement_farming';
    } else if (lowerTemplate.includes('pump') || lowerTemplate.includes('moon')) {
      return 'pump_and_dump';
    } else if (lowerTemplate.includes('buy') || lowerTemplate.includes('sell')) {
      return 'trading_manipulation';
    } else if (lowerTemplate.includes('join') || lowerTemplate.includes('telegram')) {
      return 'community_recruitment';
    } else if (this.manipulationPhrases.some(phrase => lowerTemplate.includes(phrase))) {
      return 'manipulation_script';
    } else {
      return 'generic_template';
    }
  }

  /**
   * Detect manipulation phrases
   */
  async detectManipulationPhrases(tweets) {
    const phraseUsage = new Map();
    
    tweets.forEach(tweet => {
      if (!tweet.text) return;
      
      const lowerText = tweet.text.toLowerCase();
      
      this.manipulationPhrases.forEach(phrase => {
        if (lowerText.includes(phrase)) {
          const count = phraseUsage.get(phrase) || 0;
          phraseUsage.set(phrase, count + 1);
        }
      });
    });
    
    return Array.from(phraseUsage.entries())
      .filter(([phrase, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .map(([phrase, count]) => ({
        phrase: phrase,
        count: count,
        percentage: Math.round((count / tweets.length) * 100 * 10) / 10
      }));
  }

  /**
   * Detect language patterns
   */
  async detectLanguagePatterns(tweets) {
    const patterns = {
      emojiUsage: this.analyzeEmojiUsage(tweets),
      capsUsage: this.analyzeCapsUsage(tweets),
      repetitionPatterns: this.analyzeRepetitionPatterns(tweets),
      wordFrequency: this.analyzeWordFrequency(tweets)
    };
    
    return patterns;
  }

  /**
   * Analyze emoji usage patterns
   */
  analyzeEmojiUsage(tweets) {
    const emojiCounts = new Map();
    let tweetsWithEmojis = 0;
    
    tweets.forEach(tweet => {
      if (!tweet.text) return;
      
      const emojis = tweet.text.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || [];
      
      if (emojis.length > 0) {
        tweetsWithEmojis++;
        emojis.forEach(emoji => {
          const count = emojiCounts.get(emoji) || 0;
          emojiCounts.set(emoji, count + 1);
        });
      }
    });
    
    const topEmojis = Array.from(emojiCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    return {
      percentageWithEmojis: Math.round((tweetsWithEmojis / tweets.length) * 100),
      topEmojis: topEmojis,
      averageEmojisPerTweet: tweetsWithEmojis > 0 ? 
        Math.round((Array.from(emojiCounts.values()).reduce((a, b) => a + b, 0) / tweetsWithEmojis) * 10) / 10 : 0
    };
  }

  /**
   * Analyze caps usage patterns
   */
  analyzeCapsUsage(tweets) {
    let tweetsWithCaps = 0;
    let totalCapsCharacters = 0;
    let totalCharacters = 0;
    
    tweets.forEach(tweet => {
      if (!tweet.text) return;
      
      const capsCount = (tweet.text.match(/[A-Z]/g) || []).length;
      const totalChars = tweet.text.length;
      
      totalCapsCharacters += capsCount;
      totalCharacters += totalChars;
      
      if (capsCount > 3) { // More than 3 caps characters
        tweetsWithCaps++;
      }
    });
    
    return {
      percentageWithCaps: Math.round((tweetsWithCaps / tweets.length) * 100),
      capsRatio: totalCharacters > 0 ? Math.round((totalCapsCharacters / totalCharacters) * 100) : 0
    };
  }

  /**
   * Analyze repetition patterns
   */
  analyzeRepetitionPatterns(tweets) {
    const repetitionCounts = new Map();
    let tweetsWithRepetition = 0;
    
    tweets.forEach(tweet => {
      if (!tweet.text) return;
      
      const words = tweet.text.toLowerCase().split(' ');
      const wordCounts = new Map();
      
      // Count word repetitions
      words.forEach(word => {
        const count = wordCounts.get(word) || 0;
        wordCounts.set(word, count + 1);
      });
      
      // Check for repetition
      const hasRepetition = Array.from(wordCounts.values()).some(count => count > 1);
      
      if (hasRepetition) {
        tweetsWithRepetition++;
        
        // Track specific repetitions
        wordCounts.forEach((count, word) => {
          if (count > 1 && word.length > 2) {
            const key = `${word}_x${count}`;
            const totalCount = repetitionCounts.get(key) || 0;
            repetitionCounts.set(key, totalCount + 1);
          }
        });
      }
    });
    
    const topRepetitions = Array.from(repetitionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    return {
      percentageWithRepetition: Math.round((tweetsWithRepetition / tweets.length) * 100),
      topRepetitions: topRepetitions
    };
  }

  /**
   * Analyze word frequency
   */
  analyzeWordFrequency(tweets) {
    const wordCounts = new Map();
    const totalWords = [];
    
    tweets.forEach(tweet => {
      if (!tweet.text) return;
      
      const words = tweet.text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(' ')
        .filter(word => word.length > 2);
      
      words.forEach(word => {
        const count = wordCounts.get(word) || 0;
        wordCounts.set(word, count + 1);
        totalWords.push(word);
      });
    });
    
    const topWords = Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
    
    return {
      totalWords: totalWords.length,
      uniqueWords: wordCounts.size,
      diversityRatio: wordCounts.size / totalWords.length,
      topWords: topWords
    };
  }

  /**
   * Analyze sentiment patterns
   */
  async analyzeSentimentPatterns(tweets) {
    const sentiments = tweets.map(tweet => this.getBasicSentiment(tweet.text || ''));
    
    const positiveCount = sentiments.filter(s => s > 0).length;
    const negativeCount = sentiments.filter(s => s < 0).length;
    const neutralCount = sentiments.filter(s => s === 0).length;
    
    const total = sentiments.length;
    
    return {
      positive: Math.round((positiveCount / total) * 100),
      negative: Math.round((negativeCount / total) * 100),
      neutral: Math.round((neutralCount / total) * 100),
      uniformity: this.calculateSentimentUniformity(sentiments),
      manipulation: this.detectSentimentManipulation(sentiments)
    };
  }

  /**
   * Basic sentiment analysis
   */
  getBasicSentiment(text) {
    const positiveWords = [
      'good', 'great', 'amazing', 'love', 'best', 'excellent', 'wonderful', 'fantastic',
      'awesome', 'brilliant', 'perfect', 'incredible', 'outstanding', 'superb',
      'bullish', 'moon', 'pump', 'gains', 'profit', 'success', 'win', 'victory'
    ];
    
    const negativeWords = [
      'bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disgusting', 'disappointed',
      'bearish', 'dump', 'crash', 'loss', 'failure', 'lose', 'defeat', 'scam'
    ];
    
    const words = text.toLowerCase().split(' ');
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });
    
    return score > 0 ? 1 : (score < 0 ? -1 : 0);
  }

  /**
   * Calculate sentiment uniformity
   */
  calculateSentimentUniformity(sentiments) {
    if (sentiments.length === 0) return 0;
    
    const positiveRatio = sentiments.filter(s => s > 0).length / sentiments.length;
    const negativeRatio = sentiments.filter(s => s < 0).length / sentiments.length;
    const neutralRatio = sentiments.filter(s => s === 0).length / sentiments.length;
    
    const maxRatio = Math.max(positiveRatio, negativeRatio, neutralRatio);
    return Math.round(maxRatio * 100);
  }

  /**
   * Detect sentiment manipulation
   */
  detectSentimentManipulation(sentiments) {
    const uniformity = this.calculateSentimentUniformity(sentiments);
    
    // High uniformity (>80%) with strong positive sentiment = potential manipulation
    const positiveRatio = sentiments.filter(s => s > 0).length / sentiments.length;
    
    if (uniformity > 80 && positiveRatio > 0.7) {
      return 'positive_manipulation';
    } else if (uniformity > 80 && positiveRatio < 0.3) {
      return 'negative_manipulation';
    } else if (uniformity > 90) {
      return 'artificial_uniformity';
    }
    
    return 'natural_variation';
  }

  /**
   * Calculate text similarity between two texts
   */
  calculateTextSimilarity(text1, text2) {
    if (!text1 || !text2) return 0;
    
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
   * Calculate script percentage
   */
  calculateScriptPercentage(tweets, templates, manipulationPhrases) {
    let scriptCount = 0;
    
    // Count tweets that match templates
    templates.forEach(template => {
      scriptCount += template.usageCount;
    });
    
    // Count tweets with manipulation phrases
    manipulationPhrases.forEach(phrase => {
      scriptCount += phrase.count;
    });
    
    // Avoid double counting
    const totalScripts = Math.min(scriptCount, tweets.length);
    
    return (totalScripts / tweets.length) * 100;
  }

  /**
   * Generate template evidence
   */
  generateTemplateEvidence(template, usageCount, variations) {
    const evidence = [];
    
    evidence.push(`Template used ${usageCount} times: "${template}"`);
    
    if (variations.length > 0) {
      evidence.push(`${variations.length} variations detected (avoiding detection)`);
    }
    
    return evidence;
  }

  /**
   * Generate text evidence
   */
  generateTextEvidence(templates, manipulationPhrases, languagePatterns) {
    const evidence = [];
    
    if (templates.length > 0) {
      evidence.push(`Detected ${templates.length} script templates`);
      
      const topTemplate = templates[0];
      evidence.push(`Most used template: "${topTemplate.template}" (${topTemplate.usageCount} times)`);
    }
    
    if (manipulationPhrases.length > 0) {
      evidence.push(`Found ${manipulationPhrases.length} manipulation phrases`);
      
      const topPhrase = manipulationPhrases[0];
      evidence.push(`Top phrase: "${topPhrase.phrase}" (${topPhrase.count} uses)`);
    }
    
    if (languagePatterns.emojiUsage.percentageWithEmojis > 70) {
      evidence.push(`High emoji usage: ${languagePatterns.emojiUsage.percentageWithEmojis}% of tweets`);
    }
    
    if (languagePatterns.capsUsage.percentageWithCaps > 50) {
      evidence.push(`Excessive caps usage: ${languagePatterns.capsUsage.percentageWithCaps}% of tweets`);
    }
    
    return evidence;
  }

  /**
   * Calculate confidence in text analysis
   */
  calculateConfidence(totalTweets, templateCount) {
    const sampleSize = Math.min(100, totalTweets / 50);
    const templateStrength = Math.min(10, templateCount);
    
    return Math.min(100, Math.round((sampleSize + templateStrength) * 5));
  }
}

// Export for use in detector engine
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TextAnalyzer;
} else {
  window.TextAnalyzer = TextAnalyzer;
}
