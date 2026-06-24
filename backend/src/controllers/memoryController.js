const MemoryVault = require('../models/MemoryVault');

// GET /api/memory
exports.getMemories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { category, grouped, page = 1, limit = 20 } = req.query;

    if (grouped === 'true') {
      const allMemories = await MemoryVault.find({ userId }).sort({ isPinned: -1, importanceScore: -1 });
      const groups = {};
      allMemories.forEach(mem => {
        if (!groups[mem.category]) {
          groups[mem.category] = [];
        }
        groups[mem.category].push(mem);
      });
      return res.status(200).json({ success: true, memories: groups });
    }

    const query = { userId };
    if (category) {
      query.category = category;
    }

    const memories = await MemoryVault.find(query)
      .sort({ isPinned: -1, importanceScore: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.status(200).json({ success: true, memories });
  } catch (err) {
    next(err);
  }
};

// POST /api/memory
exports.createMemory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { category, memory, importanceScore, tags } = req.body;

    if (!category || !memory) {
      return res.status(400).json({ success: false, message: 'Category and memory content are required.' });
    }

    const newMemory = await MemoryVault.create({
      userId,
      category,
      memory,
      importanceScore: importanceScore || 5,
      tags: tags || [],
      source: 'user' // manual addition
    });

    res.status(201).json({ success: true, memory: newMemory });
  } catch (err) {
    next(err);
  }
};

// PUT /api/memory/:id
exports.updateMemory = async (req, res, next) => {
  try {
    const memoryId = req.params.id;
    const userId = req.user.id;
    const { memory, importanceScore, tags, isPinned } = req.body;

    const memoryObj = await MemoryVault.findOne({ _id: memoryId, userId });
    if (!memoryObj) {
      return res.status(404).json({ success: false, message: 'Memory not found or unauthorized.' });
    }

    if (memory) memoryObj.memory = memory;
    if (importanceScore !== undefined) memoryObj.importanceScore = importanceScore;
    if (tags) memoryObj.tags = tags;
    if (isPinned !== undefined) memoryObj.isPinned = isPinned;

    await memoryObj.save();
    res.status(200).json({ success: true, memory: memoryObj });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/memory/:id
exports.deleteMemory = async (req, res, next) => {
  try {
    const memoryId = req.params.id;
    const userId = req.user.id;

    const memoryObj = await MemoryVault.findOneAndDelete({ _id: memoryId, userId });
    if (!memoryObj) {
      return res.status(404).json({ success: false, message: 'Memory not found or unauthorized.' });
    }

    res.status(200).json({ success: true, message: 'Memory deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// PUT /api/memory/:id/pin
exports.togglePin = async (req, res, next) => {
  try {
    const memoryId = req.params.id;
    const userId = req.user.id;

    const memoryObj = await MemoryVault.findOne({ _id: memoryId, userId });
    if (!memoryObj) {
      return res.status(404).json({ success: false, message: 'Memory not found or unauthorized.' });
    }

    memoryObj.isPinned = !memoryObj.isPinned;
    await memoryObj.save();

    res.status(200).json({ success: true, memory: memoryObj });
  } catch (err) {
    next(err);
  }
};

// GET /api/memory/export
exports.exportMemories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const allMemories = await MemoryVault.find({ userId }).sort({ category: 1, importanceScore: -1 });

    const groupedMemories = {};
    allMemories.forEach(mem => {
      if (!groupedMemories[mem.category]) {
        groupedMemories[mem.category] = [];
      }
      groupedMemories[mem.category].push({
        memory: mem.memory,
        score: mem.importanceScore,
        tags: mem.tags,
        pinned: mem.isPinned,
        source: mem.source,
        date: mem.createdAt
      });
    });

    res.status(200).json({ success: true, export: groupedMemories });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/memory/all
exports.deleteAllMemories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { confirm } = req.body;

    if (confirm !== 'DELETE_ALL_MEMORIES') {
      return res.status(400).json({
        success: false,
        message: 'Confirmation key must match "DELETE_ALL_MEMORIES".'
      });
    }

    await MemoryVault.deleteMany({ userId });
    res.status(200).json({ success: true, message: 'All memories cleared successfully.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/memory/search
exports.searchMemories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Query parameter q is required.' });
    }

    const matches = await MemoryVault.find({
      userId,
      memory: { $regex: q, $options: 'i' }
    }).sort({ isPinned: -1, importanceScore: -1 });

    res.status(200).json({ success: true, memories: matches });
  } catch (err) {
    next(err);
  }
};

// PUT /api/memory/correct (Manual edit)
exports.correctMemory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { memoryId, correctedText } = req.body;

    if (!memoryId || !correctedText) {
      return res.status(400).json({ success: false, message: 'MemoryId and correctedText are required.' });
    }

    const memoryObj = await MemoryVault.findOneAndUpdate(
      { _id: memoryId, userId },
      { memory: correctedText },
      { new: true }
    );

    if (!memoryObj) {
      return res.status(404).json({ success: false, message: 'Memory not found or unauthorized.' });
    }

    res.status(200).json({ success: true, memory: memoryObj });
  } catch (err) {
    next(err);
  }
};