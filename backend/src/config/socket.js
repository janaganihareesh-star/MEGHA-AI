let io;

module.exports = {
  init: (server) => {
    const { Server } = require('socket.io');
    const { createAdapter } = require('@socket.io/cluster-adapter');
    const { setupWorker } = require('@socket.io/sticky');

    io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
      }
    });

    // Phase 2: Backend Scalability (WebSockets)
    try {
      // io.adapter(createAdapter()); // Crashing due to process.send
      // setupWorker(io);
    } catch (e) {
      console.warn("Socket clustering adapter could not be initialized:", e.message);
    }

    io.on('connection', (socket) => {
      // Authenticate socket using token if available in handshake query
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      let userId;

      if (token) {
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
          userId = decoded.userId || decoded.id;
          if (userId) {
            socket.join(`user_${userId}`);
            console.log(`Authenticated user ${userId} joined room user_${userId}`);
          }
        } catch (err) {
          console.error('Socket authentication failed:', err.message);
        }
      }

      socket.on('join', (roomUserId) => {
        socket.join(`user_${roomUserId}`);
        console.log(`Socket ${socket.id} joined room user_${roomUserId}`);
      });

      socket.on('typing', (data) => {
        // data contains: conversationId, recipientId, typing (boolean)
        if (data.recipientId) {
          io.to(`user_${data.recipientId}`).emit('typing', {
            conversationId: data.conversationId,
            typing: data.typing
          });
        }
      });

      // VOICE OS: Duplex WebSocket Streaming
      socket.on('voice_stream_chunk', async (data) => {
        const { text, audioBase64, userId, conversationId } = data;
        if (!text && !audioBase64) return;

        try {
          const aiService = require('../services/aiService');
          const promptBuilder = require('../services/promptBuilder');
          const emotionService = require('../services/emotionService');
          const Conversation = require('../models/Conversation');
          const Message = require('../models/Message');
          
          let activeConvId = conversationId;
          
          // Fast path compilation for Voice OS
          const [emotionResult, promptData] = await Promise.all([
            emotionService.detectEmotion({ userId, text: text || 'Voice Input' }),
            promptBuilder.buildPrompt({ userId, currentMessage: text || 'Voice Input', conversationId: activeConvId })
          ]);

          const parts = [{ text: text || 'Native Audio Provided' }];
          if (audioBase64) {
            try {
              const matches = audioBase64.match(/^data:(audio\/[a-zA-Z0-9.-]+);base64,(.+)$/);
              if (matches && matches.length === 3) {
                parts.push({
                  inlineData: { mimeType: matches[1], data: matches[2] }
                });
              }
            } catch (e) {
              console.error("Failed to parse audioBase64", e);
            }
          }

          // Create or find Conversation
          let conversation;
          if (activeConvId) {
            conversation = await Conversation.findOne({ _id: activeConvId, participants: userId });
          }
          if (!conversation) {
            conversation = await Conversation.create({
              participants: [userId],
              title: text ? text.substring(0, 30) + '...' : 'Voice Conversation',
              isGroup: false,
              lastMessageAt: new Date()
            });
            activeConvId = conversation._id;
          }

          // Save User Message
          const userMessageText = text ? text.replace(/^\[AudioEmotion Detected:.*?\]\s*/, '') : 'Voice Input';
          await Message.create({
            conversationId: activeConvId,
            sender: 'user',
            senderId: userId,
            content: userMessageText,
            timestamp: new Date()
          });

          // Inject specific Voice OS system prompt rules BEFORE sending to AI
          const voiceRules = `\n\n[VOICE OS MODE ACTIVATED]
CRITICAL RULES FOR VOICE MODE:
1. Speak exactly in the language the user is speaking to you. If they ask a question in Telugu, reply in Telugu.
2. Match the user's emotion/mood in your response.
3. If the user asks you to write code, provide the code block using markdown as normal, BUT in your spoken conversational text, explicitly say: "I have provided the code in our chat history, please check it there." (Translate this phrase to their language). Do not attempt to read raw code syntax out loud.`;
          
          if (promptData.systemPrompt) {
            promptData.systemPrompt += voiceRules;
          } else {
            promptData.systemPrompt = voiceRules;
          }

          promptData.messages.push({ role: 'user', parts });

          const aiResult = await aiService.generateAIResponse({
            ...promptData,
            energyLevel: emotionResult.energyLevel || 'medium',
            domain: promptData.domain,
            domains: promptData.domains || []
          });

          // Save AI Message
          await Message.create({
            conversationId: activeConvId,
            sender: 'ai',
            content: aiResult.text,
            timestamp: new Date()
          });

          // Update Conversation
          conversation.lastMessageAt = new Date();
          await conversation.save();

          // Simulate Duplex Stream to Frontend TTS
          const words = aiResult.text.split(' ');
          let chunk = '';
          for (let i = 0; i < words.length; i++) {
            chunk += words[i] + ' ';
            // Emit every 5 words to trigger TTS immediately
            if (i % 5 === 0 || i === words.length - 1) {
              socket.emit('ai_voice_stream_response', { chunk: chunk.trim() });
              chunk = '';
              await new Promise(resolve => setTimeout(resolve, 50)); // Simulating chunked network delay
            }
          }
          
          socket.emit('ai_voice_stream_end', { fullText: aiResult.text });
        } catch (err) {
          console.error("Voice stream error:", err);
          socket.emit('ai_voice_stream_error', { error: 'Voice OS Failed' });
        }
      });

      socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
  emitToUser: (userId, event, data) => {
    if (io) {
      io.to(`user_${userId}`).emit(event, data);
    }
  }
};