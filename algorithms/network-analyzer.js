/**
 * NETWORK ANALYZER - Louvain Community Detection and Network Analysis
 * 
 * Analyzes:
 * - Social network communities
 * - Influence patterns
 * - Coordination networks
 * - Bridge accounts
 * - Centrality measures
 */

class NetworkAnalyzer {
  constructor() {
    this.minCommunitySize = 3; // Minimum size for a community
    this.maxCommunities = 50; // Maximum communities to analyze
    this.influenceThreshold = 0.1; // Minimum influence score
    
    console.log('🔗 Network Analyzer initialized');
  }

  /**
   * Main network analysis function
   * @param {Array} tweets - Array of tweet objects
   * @returns {Object} Network analysis results
   */
  async analyze(tweets) {
    console.log('🔗 Starting network analysis...');
    
    if (tweets.length < 10) {
      return {
        communities: [],
        manipulationScore: 0,
        influence: {},
        evidence: ['Insufficient data for network analysis']
      };
    }
    
    try {
      // Step 1: Build social graph
      console.log('🔍 Step 1: Building social graph...');
      const graph = await this.buildSocialGraph(tweets);
      
      // Step 2: Detect communities using Louvain method
      console.log('🔍 Step 2: Detecting communities...');
      const communities = await this.detectCommunities(graph);
      
      // Step 3: Analyze influence patterns
      console.log('🔍 Step 3: Analyzing influence...');
      const influence = await this.analyzeInfluence(graph, communities);
      
      // Step 4: Detect coordination networks
      console.log('🔍 Step 4: Detecting coordination networks...');
      const coordination = await this.detectCoordinationNetworks(graph, communities);
      
      // Step 5: Calculate network manipulation score
      const manipulationScore = this.calculateNetworkManipulationScore(communities, influence, coordination);
      
      // Step 6: Generate evidence
      const evidence = this.generateNetworkEvidence(communities, influence, coordination);
      
      console.log(`✅ Network analysis complete: ${communities.length} communities detected`);
      
      return {
        communities: communities,
        manipulationScore: Math.round(manipulationScore),
        influence: influence,
        coordination: coordination,
        evidence: evidence,
        confidence: this.calculateConfidence(tweets.length, communities.length)
      };
      
    } catch (error) {
      console.error('❌ Network analysis failed:', error);
      return {
        communities: [],
        manipulationScore: 0,
        influence: {},
        evidence: [`Error in network analysis: ${error.message}`]
      };
    }
  }

  /**
   * Build social graph from tweets
   */
  async buildSocialGraph(tweets) {
    const graph = {
      nodes: new Map(),
      edges: new Map(),
      adjacency: new Map()
    };
    
    // Extract accounts and build nodes
    tweets.forEach(tweet => {
      if (!tweet.author) return;
      
      const author = tweet.author.toLowerCase();
      
      if (!graph.nodes.has(author)) {
        graph.nodes.set(author, {
          id: author,
          username: tweet.author,
          tweets: [],
          followers: 0, // Would need actual follower data
          following: 0, // Would need actual following data
          accountAge: this.estimateAccountAge(tweet),
          influence: 0
        });
      }
      
      const node = graph.nodes.get(author);
      node.tweets.push(tweet);
    });
    
    // Build edges based on interactions
    await this.buildEdgesFromInteractions(graph, tweets);
    
    // Calculate node metrics
    this.calculateNodeMetrics(graph);
    
    return graph;
  }

  /**
   * Build edges from tweet interactions
   */
  async buildEdgesFromInteractions(graph, tweets) {
    tweets.forEach(tweet => {
      if (!tweet.text) return;
      
      const author = tweet.author.toLowerCase();
      const text = tweet.text;
      
      // Extract mentions
      const mentions = text.match(/@(\w+)/g) || [];
      
      mentions.forEach(mention => {
        const mentionedUser = mention.substring(1).toLowerCase();
        
        if (graph.nodes.has(mentionedUser)) {
          // Create edge between author and mentioned user
          const edgeKey = `${author}-${mentionedUser}`;
          const reverseEdgeKey = `${mentionedUser}-${author}`;
          
          if (!graph.edges.has(edgeKey)) {
            graph.edges.set(edgeKey, {
              from: author,
              to: mentionedUser,
              weight: 0,
              type: 'mention'
            });
          }
          
          const edge = graph.edges.get(edgeKey);
          edge.weight += 1;
        }
      });
      
      // Extract hashtags for co-engagement
      const hashtags = text.match(/#\w+/g) || [];
      
      if (hashtags.length > 0) {
        // Find other tweets with same hashtags
        const relatedTweets = tweets.filter(t => {
          if (t.author === tweet.author) return false;
          
          const tHashtags = t.text.match(/#\w+/g) || [];
          return hashtags.some(h => tHashtags.includes(h));
        });
        
        relatedTweets.forEach(relatedTweet => {
          const relatedAuthor = relatedTweet.author.toLowerCase();
          
          if (graph.nodes.has(relatedAuthor)) {
            const edgeKey = `${author}-${relatedAuthor}`;
            
            if (!graph.edges.has(edgeKey)) {
              graph.edges.set(edgeKey, {
                from: author,
                to: relatedAuthor,
                weight: 0,
                type: 'hashtag_coengagement'
              });
            }
            
            const edge = graph.edges.get(edgeKey);
            edge.weight += 0.5; // Lower weight for hashtag co-engagement
          }
        });
      }
    });
    
    // Build adjacency list
    this.buildAdjacencyList(graph);
  }

  /**
   * Build adjacency list from edges
   */
  buildAdjacencyList(graph) {
    graph.edges.forEach((edge, key) => {
      const from = edge.from;
      const to = edge.to;
      
      if (!graph.adjacency.has(from)) {
        graph.adjacency.set(from, []);
      }
      
      if (!graph.adjacency.has(to)) {
        graph.adjacency.set(to, []);
      }
      
      graph.adjacency.get(from).push(to);
      graph.adjacency.get(to).push(from);
    });
  }

  /**
   * Calculate node metrics
   */
  calculateNodeMetrics(graph) {
    graph.nodes.forEach((node, id) => {
      // Calculate degree (number of connections)
      const degree = graph.adjacency.get(id)?.length || 0;
      node.degree = degree;
      
      // Calculate weighted degree (sum of edge weights)
      let weightedDegree = 0;
      graph.edges.forEach(edge => {
        if (edge.from === id || edge.to === id) {
          weightedDegree += edge.weight;
        }
      });
      node.weightedDegree = weightedDegree;
      
      // Estimate influence based on metrics
      node.influence = this.calculateInfluenceScore(node, graph);
    });
  }

  /**
   * Detect communities using Louvain method
   */
  async detectCommunities(graph) {
    // Simplified Louvain implementation
    const communities = this.louvainAlgorithm(graph);
    
    // Filter and analyze communities
    const filteredCommunities = communities.filter(community => 
      community.nodes.length >= this.minCommunitySize
    ).slice(0, this.maxCommunities);
    
    // Analyze each community
    const analyzedCommunities = filteredCommunities.map(community => 
      this.analyzeCommunity(community, graph)
    );
    
    return analyzedCommunities.sort((a, b) => b.suspicionScore - a.suspicionScore);
  }

  /**
   * Simplified Louvain algorithm implementation
   */
  louvainAlgorithm(graph) {
    // Initialize each node as its own community
    const communities = new Map();
    const nodeToCommunity = new Map();
    
    graph.nodes.forEach((node, id) => {
      communities.set(id, [id]);
      nodeToCommunity.set(id, id);
    });
    
    let improved = true;
    let iterations = 0;
    const maxIterations = 10;
    
    while (improved && iterations < maxIterations) {
      improved = false;
      iterations++;
      
      // Try to move each node to a better community
      for (const [nodeId, node] of graph.nodes) {
        const currentCommunity = nodeToCommunity.get(nodeId);
        const neighbors = graph.adjacency.get(nodeId) || [];
        
        let bestCommunity = currentCommunity;
        let bestGain = 0;
        
        // Check all neighboring communities
        const neighborCommunities = new Set();
        neighbors.forEach(neighbor => {
          neighborCommunities.add(nodeToCommunity.get(neighbor));
        });
        
        for (const communityId of neighborCommunities) {
          const gain = this.calculateModularityGain(nodeId, currentCommunity, communityId, graph);
          
          if (gain > bestGain) {
            bestGain = gain;
            bestCommunity = communityId;
          }
        }
        
        // Move node if improvement found
        if (bestCommunity !== currentCommunity && bestGain > 0) {
          this.moveNode(nodeId, currentCommunity, bestCommunity, communities, nodeToCommunity);
          improved = true;
        }
      }
    }
    
    // Convert to community list
    const communityList = [];
    communities.forEach((nodes, communityId) => {
      if (nodes.length >= this.minCommunitySize) {
        communityList.push({
          id: communityId,
          nodes: nodes,
          size: nodes.length
        });
      }
    });
    
    return communityList;
  }

  /**
   * Calculate modularity gain for moving a node
   */
  calculateModularityGain(nodeId, fromCommunity, toCommunity, graph) {
    // Simplified modularity calculation
    // In a real implementation, this would use the full modularity formula
    
    const node = graph.nodes.get(nodeId);
    const neighbors = graph.adjacency.get(nodeId) || [];
    
    let connectionsToFrom = 0;
    let connectionsToTo = 0;
    
    neighbors.forEach(neighbor => {
      if (neighbor === fromCommunity) connectionsToFrom++;
      if (neighbor === toCommunity) connectionsToTo++;
    });
    
    // Simple heuristic: prefer communities with more connections
    return connectionsToTo - connectionsToFrom;
  }

  /**
   * Move node between communities
   */
  moveNode(nodeId, fromCommunity, toCommunity, communities, nodeToCommunity) {
    // Remove from old community
    const fromNodes = communities.get(fromCommunity);
    const index = fromNodes.indexOf(nodeId);
    if (index > -1) {
      fromNodes.splice(index, 1);
    }
    
    // Add to new community
    if (!communities.has(toCommunity)) {
      communities.set(toCommunity, []);
    }
    communities.get(toCommunity).push(nodeId);
    
    // Update mapping
    nodeToCommunity.set(nodeId, toCommunity);
  }

  /**
   * Analyze individual community
   */
  analyzeCommunity(community, graph) {
    const nodes = community.nodes.map(id => graph.nodes.get(id));
    
    // Calculate community metrics
    const metrics = {
      size: nodes.length,
      totalTweets: nodes.reduce((sum, node) => sum + node.tweets.length, 0),
      avgInfluence: nodes.reduce((sum, node) => sum + node.influence, 0) / nodes.length,
      totalConnections: 0,
      internalConnections: 0,
      externalConnections: 0
    };
    
    // Count connections
    nodes.forEach(node => {
      const neighbors = graph.adjacency.get(node.id) || [];
      metrics.totalConnections += neighbors.length;
      
      neighbors.forEach(neighbor => {
        if (community.nodes.includes(neighbor)) {
          metrics.internalConnections++;
        } else {
          metrics.externalConnections++;
        }
      });
    });
    
    // Calculate suspicion score
    const suspicionScore = this.calculateCommunitySuspicionScore(metrics, nodes);
    
    // Detect community type
    const type = this.classifyCommunityType(metrics, nodes);
    
    // Generate evidence
    const evidence = this.generateCommunityEvidence(community, metrics, type);
    
    return {
      id: community.id,
      size: metrics.size,
      metrics: metrics,
      suspicionScore: Math.round(suspicionScore),
      type: type,
      evidence: evidence,
      nodes: nodes.map(node => ({
        username: node.username,
        influence: Math.round(node.influence),
        tweets: node.tweets.length
      }))
    };
  }

  /**
   * Calculate community suspicion score
   */
  calculateCommunitySuspicionScore(metrics, nodes) {
    let suspicionScore = 0;
    
    // Size factor (larger communities can be more suspicious)
    if (metrics.size > 10) suspicionScore += 20;
    if (metrics.size > 20) suspicionScore += 10;
    
    // Density factor (high internal connections = coordination)
    const density = metrics.internalConnections / (metrics.size * (metrics.size - 1));
    if (density > 0.3) suspicionScore += 30;
    
    // Influence factor (low influence accounts working together = suspicious)
    if (metrics.avgInfluence < 0.1) suspicionScore += 25;
    
    // Activity factor (high activity = potential manipulation)
    const avgTweetsPerUser = metrics.totalTweets / metrics.size;
    if (avgTweetsPerUser > 5) suspicionScore += 15;
    
    // Homogeneity factor (similar account characteristics = bot network)
    const accountAges = nodes.map(node => node.accountAge);
    const ageVariance = this.calculateVariance(accountAges);
    if (ageVariance < 30) suspicionScore += 10; // Low variance = similar ages
    
    return Math.min(100, suspicionScore);
  }

  /**
   * Classify community type
   */
  classifyCommunityType(metrics, nodes) {
    if (metrics.size > 20 && metrics.avgInfluence < 0.1) {
      return 'bot_network';
    } else if (metrics.internalConnections > metrics.externalConnections * 2) {
      return 'coordinated_group';
    } else if (metrics.avgInfluence > 0.5) {
      return 'influence_network';
    } else if (metrics.size < 5 && metrics.internalConnections > metrics.size * 2) {
      return 'close_knit_group';
    } else {
      return 'organic_community';
    }
  }

  /**
   * Analyze influence patterns
   */
  async analyzeInfluence(graph, communities) {
    const influence = {
      topInfluencers: [],
      influenceDistribution: {},
      bridgeAccounts: []
    };
    
    // Find top influencers
    const allNodes = Array.from(graph.nodes.values());
    const sortedByInfluence = allNodes.sort((a, b) => b.influence - a.influence);
    
    influence.topInfluencers = sortedByInfluence.slice(0, 10).map(node => ({
      username: node.username,
      influence: Math.round(node.influence * 100) / 100,
      degree: node.degree,
      tweets: node.tweets.length
    }));
    
    // Find bridge accounts (connect different communities)
    influence.bridgeAccounts = this.findBridgeAccounts(graph, communities);
    
    // Analyze influence distribution
    influence.influenceDistribution = this.analyzeInfluenceDistribution(allNodes);
    
    return influence;
  }

  /**
   * Find bridge accounts
   */
  findBridgeAccounts(graph, communities) {
    const bridgeAccounts = [];
    
    graph.nodes.forEach((node, nodeId) => {
      const neighbors = graph.adjacency.get(nodeId) || [];
      const neighborCommunities = new Set();
      
      neighbors.forEach(neighbor => {
        communities.forEach(community => {
          if (community.nodes.includes(neighbor)) {
            neighborCommunities.add(community.id);
          }
        });
      });
      
      // Bridge account if it connects to multiple communities
      if (neighborCommunities.size > 1) {
        bridgeAccounts.push({
          username: node.username,
          communities: Array.from(neighborCommunities),
          connections: neighbors.length
        });
      }
    });
    
    return bridgeAccounts.slice(0, 5);
  }

  /**
   * Analyze influence distribution
   */
  analyzeInfluenceDistribution(nodes) {
    const influences = nodes.map(node => node.influence);
    
    return {
      mean: this.calculateMean(influences),
      median: this.calculateMedian(influences),
      variance: this.calculateVariance(influences),
      skewness: this.calculateSkewness(influences)
    };
  }

  /**
   * Detect coordination networks
   */
  async detectCoordinationNetworks(graph, communities) {
    const coordination = {
      suspiciousCommunities: [],
      coordinationScore: 0,
      patterns: []
    };
    
    // Find suspicious communities
    coordination.suspiciousCommunities = communities
      .filter(community => community.suspicionScore > 50)
      .map(community => ({
        id: community.id,
        size: community.size,
        type: community.type,
        suspicionScore: community.suspicionScore
      }));
    
    // Calculate overall coordination score
    coordination.coordinationScore = this.calculateCoordinationScore(communities);
    
    // Detect patterns
    coordination.patterns = this.detectCoordinationPatterns(graph, communities);
    
    return coordination;
  }

  /**
   * Calculate coordination score
   */
  calculateCoordinationScore(communities) {
    if (communities.length === 0) return 0;
    
    const suspiciousCommunities = communities.filter(c => c.suspicionScore > 50);
    const totalNodes = communities.reduce((sum, c) => sum + c.size, 0);
    const suspiciousNodes = suspiciousCommunities.reduce((sum, c) => sum + c.size, 0);
    
    return (suspiciousNodes / totalNodes) * 100;
  }

  /**
   * Detect coordination patterns
   */
  detectCoordinationPatterns(graph, communities) {
    const patterns = [];
    
    // Pattern 1: Star networks (one central account)
    communities.forEach(community => {
      const nodes = community.nodes.map(id => graph.nodes.get(id));
      const degrees = nodes.map(node => node.degree);
      const maxDegree = Math.max(...degrees);
      const avgDegree = degrees.reduce((a, b) => a + b, 0) / degrees.length;
      
      if (maxDegree > avgDegree * 3) {
        patterns.push({
          type: 'star_network',
          community: community.id,
          centralNode: nodes.find(n => n.degree === maxDegree).username
        });
      }
    });
    
    return patterns;
  }

  /**
   * Calculate network manipulation score
   */
  calculateNetworkManipulationScore(communities, influence, coordination) {
    let score = 0;
    
    // Community factor (50% of score)
    const suspiciousCommunities = communities.filter(c => c.suspicionScore > 50);
    const communityScore = (suspiciousCommunities.length / communities.length) * 50;
    score += communityScore;
    
    // Coordination factor (30% of score)
    score += (coordination.coordinationScore * 0.3);
    
    // Influence factor (20% of score)
    const lowInfluenceRatio = influence.topInfluencers.filter(i => i.influence < 0.1).length / influence.topInfluencers.length;
    score += (lowInfluenceRatio * 20);
    
    return Math.min(100, score);
  }

  /**
   * Generate network evidence
   */
  generateNetworkEvidence(communities, influence, coordination) {
    const evidence = [];
    
    if (communities.length > 0) {
      evidence.push(`Detected ${communities.length} network communities`);
      
      const suspiciousCommunities = communities.filter(c => c.suspicionScore > 50);
      if (suspiciousCommunities.length > 0) {
        evidence.push(`${suspiciousCommunities.length} suspicious communities identified`);
        
        const topSuspicious = suspiciousCommunities[0];
        evidence.push(`Most suspicious: ${topSuspicious.type} with ${topSuspicious.size} accounts`);
      }
    }
    
    if (coordination.patterns.length > 0) {
      evidence.push(`Found ${coordination.patterns.length} coordination patterns`);
    }
    
    if (influence.bridgeAccounts.length > 0) {
      evidence.push(`${influence.bridgeAccounts.length} bridge accounts connecting communities`);
    }
    
    return evidence;
  }

  /**
   * Calculate influence score for a node
   */
  calculateInfluenceScore(node, graph) {
    let score = 0;
    
    // Degree centrality (number of connections)
    score += Math.min(0.5, node.degree / 20);
    
    // Weighted degree (strength of connections)
    score += Math.min(0.3, node.weightedDegree / 50);
    
    // Activity level (number of tweets)
    score += Math.min(0.2, node.tweets.length / 100);
    
    return Math.min(1, score);
  }

  /**
   * Estimate account age from first tweet
   */
  estimateAccountAge(tweet) {
    // In real implementation, would use actual account creation date
    // For now, estimate based on tweet timestamp
    const tweetDate = new Date(tweet.timestamp);
    const now = new Date();
    return Math.floor((now - tweetDate) / (1000 * 60 * 60 * 24));
  }

  /**
   * Utility functions for statistical calculations
   */
  calculateMean(values) {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  calculateMedian(values) {
    const sorted = values.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  calculateVariance(values) {
    const mean = this.calculateMean(values);
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return this.calculateMean(squaredDiffs);
  }

  calculateSkewness(values) {
    const mean = this.calculateMean(values);
    const variance = this.calculateVariance(values);
    const stdDev = Math.sqrt(variance);
    
    const cubedDiffs = values.map(value => Math.pow((value - mean) / stdDev, 3));
    return this.calculateMean(cubedDiffs);
  }

  /**
   * Calculate confidence in network analysis
   */
  calculateConfidence(totalTweets, communityCount) {
    const sampleSize = Math.min(100, totalTweets / 50);
    const communityStrength = Math.min(10, communityCount);
    
    return Math.min(100, Math.round((sampleSize + communityStrength) * 5));
  }
}

// Export for use in detector engine
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NetworkAnalyzer;
} else {
  window.NetworkAnalyzer = NetworkAnalyzer;
}
