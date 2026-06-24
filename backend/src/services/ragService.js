const axios = require('axios');
const MemoryVault = require('../models/MemoryVault');
const GraphNode = require('../models/GraphNode');
const GraphEdge = require('../models/GraphEdge');

/**
 * Generates vector embeddings for a given text using Gemini's embedding model.
 *
 * NOTE (fix): 'text-embedding-004' was retired by Google and now returns
 * 404 NOT_FOUND on v1beta. The current model is 'gemini-embedding-001'.
 * It defaults to 3072 dimensions, so we pass outputDimensionality: 768
 * to keep the vector size compatible with the existing MongoDB Atlas
 * Vector Search index (which was built for 768-dim vectors).
 */
async function generateEmbedding(text) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
    return new Array(768).fill(0.1); // Mock embedding for testing without real key
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`;

  try {
    const response = await axios.post(url, {
      model: 'models/gemini-embedding-001',
      content: {
        parts: [{ text }]
      },
      outputDimensionality: 768
    });

    let values = response.data?.embedding?.values || [];

    // gemini-embedding-001 only auto-normalizes the default 3072-dim output.
    // Truncated outputs (e.g. 768) must be manually re-normalized to unit
    // length, otherwise cosine-similarity / Atlas Vector Search scores
    // will be skewed. See: https://ai.google.dev/gemini-api/docs/embeddings
    if (values.length > 0) {
      const norm = Math.sqrt(values.reduce((sum, v) => sum + v * v, 0));
      if (norm > 0) {
        values = values.map((v) => v / norm);
      }
    }

    return values;
  } catch (err) {
    console.error('Failed to generate embedding:', err.response?.data || err.message);
    return [];
  }
}

/**
 * Searches the MemoryVault using MongoDB Atlas Vector Search.
 * Note: Requires an Atlas Vector Search index named 'vector_index' on the 'embedding' field.
 */
async function searchSimilarMemories(userId, queryText, limit = 5) {
  // Bypass RAG for extremely short/casual messages to save API limits (Gemini 15 RPM)
  const wordCount = queryText.trim().split(/\s+/).length;
  if (wordCount < 4) {
    return [];
  }

  const queryEmbedding = await generateEmbedding(queryText);
  if (!queryEmbedding || queryEmbedding.length === 0) return [];
  try {
    // Atlas Vector Search Pipeline - Fetch up to 25 for re-ranking
    const pipeline = [
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: 50,
          limit: 25,
          filter: { userId: userId }
        }
      },
      {
        $project: {
          embedding: 0,
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ];
    let results = await MemoryVault.aggregate(pipeline);

    // COHERE RE-RANKING INTEGRATION (Phase 3.2)
    const cohereKey = process.env.COHERE_API_KEY;
    if (cohereKey && results.length > 0) {
      try {
        console.log(`[Cognitive Memory] Re-ranking ${results.length} memories using Cohere...`);
        const documents = results.map(r => r.memory);
        const rerankRes = await axios.post('https://api.cohere.ai/v1/rerank', {
          model: 'rerank-english-v3.0',
          query: queryText,
          documents: documents,
          top_n: limit
        }, {
          headers: {
            'Authorization': `Bearer ${cohereKey}`,
            'Content-Type': 'application/json'
          }
        });
        if (rerankRes.data && rerankRes.data.results) {
          // Map the re-ranked indices back to our original results
          const rerankedResults = rerankRes.data.results.map(r => results[r.index]);
          return rerankedResults;
        }
      } catch (rerankErr) {
        console.error('[Cognitive Memory] Cohere Re-rank failed, returning original vector results:', rerankErr.message);
      }
    }
    return results.slice(0, limit);
  } catch (err) {
    console.error('Vector search failed, falling back to basic text matching:', err.message);
    // Fallback if Atlas Vector Search is not configured
    const fallbackResults = await MemoryVault.find({
      userId,
      memory: { $regex: queryText.split(' ')[0], $options: 'i' }
    }).limit(limit);
    return fallbackResults;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// KNOWLEDGE GRAPH TRAVERSAL (Phase 8.1)
// ─────────────────────────────────────────────────────────────────────────────
async function searchKnowledgeGraph(userId, queryText) {
  try {
    // 1. Extract potential entity names from the query (simple keyword matching)
    const words = queryText.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ').filter(w => w.length > 3);
    if (words.length === 0) return [];
    // 2. Find matching nodes
    const nodes = await GraphNode.find({
      userId,
      name: { $in: words }
    });
    if (nodes.length === 0) return [];
    const nodeIds = nodes.map(n => n._id);
    // 3. Traverse edges (Find relationships where these nodes are source or target)
    const edges = await GraphEdge.find({
      userId,
      $or: [{ sourceNodeId: { $in: nodeIds } }, { targetNodeId: { $in: nodeIds } }]
    }).populate('sourceNodeId targetNodeId');
    // 4. Format into readable facts
    const graphFacts = edges.map(edge => {
      const src = edge.sourceNodeId?.name;
      const tgt = edge.targetNodeId?.name;
      const rel = edge.relation;
      if (src && tgt) {
        return `Graph Fact: ${src} ${rel} ${tgt}`;
      }
      return null;
    }).filter(Boolean);
    return [...new Set(graphFacts)]; // Return unique facts
  } catch (err) {
    console.error('[Knowledge Graph Search Error]:', err.message);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INFINITE MEMORY ENGINE (Math Cosine Similarity)
// ─────────────────────────────────────────────────────────────────────────────
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function searchGlobalMessageHistory(userId, queryText, currentConversationId, limit = 5) {
  // Temporarily bypass RAG for ALL messages to save API Rate Limits (15 RPM) and reduce 1.5s latency.
  // Short-term conversation history is already sent, so context remains intact.
  return [];
  const queryEmbedding = await generateEmbedding(queryText);
  if (!queryEmbedding || queryEmbedding.length === 0) return [];
  try {
    // We only pull messages that actually have embeddings, excluding the current active conversation
    // to avoid duplicating the short-term memory we already feed.
    const Message = require('../models/Message');
    const allPastMessages = await Message.find({
      userId,
      conversationId: { $ne: currentConversationId },
      embedding: { $exists: true, $not: { $size: 0 } },
      isDeleted: { $ne: true }
    }).select('content embedding timestamp');
    // Perform In-Memory Cosine Similarity
    // (Extremely fast for < 10,000 messages. For 1M+ messages, use Pinecone)
    const scoredMessages = allPastMessages.map(msg => {
      const score = cosineSimilarity(queryEmbedding, msg.embedding);
      return { content: msg.content, timestamp: msg.timestamp, score };
    });
    // Sort by highest score first and grab top N
    scoredMessages.sort((a, b) => b.score - a.score);

    // Filter only good matches (score > 0.65 threshold)
    return scoredMessages.filter(m => m.score > 0.65).slice(0, limit);
  } catch (err) {
    console.error('[Infinite Memory RAG Error]:', err.message);
    return [];
  }
}

module.exports = {
  generateEmbedding,
  searchSimilarMemories,
  searchKnowledgeGraph,
  searchGlobalMessageHistory
};
