import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Play, ThumbsUp, ThumbsDown, MessageSquareDiff, ShieldCheck, PhoneCall, Copy, Edit3, RefreshCw, MoreHorizontal, BookOpen, GitBranch, Volume2, Share2, Lightbulb, Globe, ArrowUp } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { editAndResendMessage, branchConversation, sendMessage } from '../store/chatSlice';
import api from '../utils/api';
import toast from 'react-hot-toast';
import ShareModal from './ShareModal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MOOD_EMOJIS = {
  sad: '😢',
  happy: '😊',
  angry: '😠',
  lonely: '😔',
  anxious: '😰',
  tired: '😴',
  excited: '🤩',
  calm: '😌',
  frustrated: '😣',
  neutral: '😐'
};

export default function MessageBubble({ message, onArtifactOpen, onOpenSources }) {
  const isUser = message.sender === 'user';
  
  // Format timestamp helper
  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  const [rating, setRating] = useState(message.rating || 0);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState(message.feedbackText || '');
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showChangeResponse, setShowChangeResponse] = useState(false);
  const [changeInstruction, setChangeInstruction] = useState('');
  const moreActionsRef = useRef(null);
  const changeResponseRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
        setShowMoreActions(false);
      }
      if (changeResponseRef.current && !changeResponseRef.current.contains(event.target)) {
        setShowChangeResponse(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChangeResponse = (type, customInstruction = '') => {
    setShowChangeResponse(false);
    let instruction = '';
    if (type === 'try_again') {
      instruction = 'Please regenerate your previous response with a better, more detailed answer.';
    } else if (type === 'think_longer') {
      instruction = 'Please think longer and provide a much more detailed, comprehensive, and deeply analyzed answer to my previous question.';
    } else if (type === 'search_web') {
      instruction = 'Please search the web for the latest information and provide an updated answer to my previous question.';
    } else if (type === 'custom') {
      if (!customInstruction.trim()) return;
      instruction = `Please rewrite your previous response. Follow these instructions: ${customInstruction}`;
      setChangeInstruction('');
    }

    dispatch(sendMessage({
      conversationId: message.conversationId,
      message: instruction
    }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
      .then(() => toast.success('Message copied!'))
      .catch(() => toast.error('Failed to copy.'));
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content && !message.isOptimistic) {
      dispatch(editAndResendMessage({
        conversationId: message.conversationId,
        messageId: message._id,
        newText: editContent
      }));
    }
    setIsEditing(false);
  };

  const handleBranchChat = async () => {
    setShowMoreActions(false);
    try {
      const resultAction = await dispatch(branchConversation({
        conversationId: message.conversationId,
        messageId: message._id
      }));
      if (branchConversation.fulfilled.match(resultAction)) {
        const newConversationId = resultAction.payload;
        window.open(`/chat/${newConversationId}`, '_blank');
      }
    } catch (err) {
      console.error('Branching failed');
    }
  };

  const handleReadAloud = () => {
    setShowMoreActions(false);
    
    // Dynamically import googleTTS to avoid circular deps or SSR issues
    import('../utils/tts').then(({ googleTTS }) => {
      if (isReading) {
        googleTTS.cancel();
        setIsReading(false);
        return;
      }
      
      const textToSpeak = message.content.replace(/```[\s\S]*?```/g, 'Code block omitted.');
      
      googleTTS.onEnd(() => setIsReading(false));
      setIsReading(true);
      googleTTS.speak(textToSpeak, 'te');
    });
  };

  const handleRate = async (val) => {
    if (isUser) return;
    setRating(val);
    try {
      await api.post(`/chat/message/${message._id}/feedback`, { rating: val });
    } catch (err) {
      console.error('Failed to save rating');
    }
  };

  const submitFeedbackText = async () => {
    if (!feedbackText.trim()) return;
    try {
      await api.post(`/chat/message/${message._id}/feedback`, { feedbackText });
      setShowFeedbackInput(false);
      setFeedbackSaved(true);
      setTimeout(() => setFeedbackSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save feedback text');
    }
  };
  // Vibration effect removed due to browser intervention errors
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`flex w-full ${isUser ? 'mb-8 justify-end' : 'mb-12 justify-start'}`}
    >
      <div
        className={`relative max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed group ${
          isUser
            ? 'glass-bubble-user rounded-tr-sm ml-auto'
            : 'glass-bubble-ai text-text rounded-tl-sm mr-auto hover:shadow-card transition-shadow duration-300'
        }`}
      >
        {isEditing ? (
          <div className="flex flex-col gap-2 min-w-[200px]">
            <textarea
              className="w-full bg-surface/20 border border-white/20 rounded-md p-2 text-white outline-none resize-y min-h-[60px]"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-1">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-white/10 rounded-md text-xs hover:bg-white/20 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-white text-accent font-bold rounded-md text-xs hover:bg-gray-100 transition"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap word-break">
            {renderContent(message.content, isUser, onArtifactOpen)}
          </div>
        )}
        
        {/* Action Buttons for User Message (Copy / Edit) */}
        {isUser && !isEditing && !message.isOptimistic && (
          <div className="absolute -bottom-6 right-1 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-bg/80 backdrop-blur-sm rounded-md px-1.5 py-1 border border-border/40 z-10">
            <button onClick={handleCopy} className="p-1 text-muted hover:text-text transition-colors cursor-pointer" title="Copy">
              <Copy className="w-3.5 h-3.5 pointer-events-none" />
            </button>
            <button onClick={() => setIsEditing(true)} className="p-1 text-muted hover:text-text transition-colors cursor-pointer" title="Edit">
              <Edit3 className="w-3.5 h-3.5 pointer-events-none" />
            </button>
          </div>
        )}

        {/* Emergency Override (Task 5) */}
        {!isUser && message.emergency && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-500 font-semibold text-xs uppercase tracking-wide">
              <PhoneCall className="w-4 h-4" />
              <span>Emergency Detected</span>
            </div>
            <button className="px-4 py-1.5 bg-rose-500 text-white font-bold rounded-lg text-xs hover:bg-rose-600 transition shadow-lg animate-pulse cursor-pointer">
              Call Amma
            </button>
          </div>
        )}

        {/* Action Buttons for AI Message */}
        {!isUser && (
          <div className="absolute -bottom-8 left-1 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-bg/80 backdrop-blur-sm rounded-md px-2 py-1 border border-border/40 z-10">
            <button onClick={handleCopy} className="p-1 text-muted hover:text-text transition-colors cursor-pointer" title="Copy">
              <Copy className="w-4 h-4 pointer-events-none" />
            </button>
            <button onClick={() => handleRate(1)} className={`p-1 transition-colors cursor-pointer ${rating === 1 ? 'text-emerald-500' : 'text-muted hover:text-emerald-400'}`} title="Good response">
              <ThumbsUp className="w-4 h-4 pointer-events-none" />
            </button>
            <button onClick={() => { handleRate(-1); setShowFeedbackInput(!showFeedbackInput); }} className={`p-1 transition-colors cursor-pointer ${rating === -1 ? 'text-rose-500' : 'text-muted hover:text-rose-400'}`} title="Bad response">
              <ThumbsDown className="w-4 h-4 pointer-events-none" />
            </button>
            <button onClick={() => setShowShareModal(true)} className="p-1 text-muted hover:text-text transition-colors cursor-pointer" title="Share">
              <Share2 className="w-4 h-4 pointer-events-none" />
            </button>
            <div className="relative" ref={changeResponseRef}>
              <button onClick={() => setShowChangeResponse(!showChangeResponse)} className="p-1 text-muted hover:text-text transition-colors cursor-pointer" title="Ask to change response">
                <RefreshCw className="w-4 h-4 pointer-events-none" />
              </button>
              
              <AnimatePresence>
                {showChangeResponse && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute bottom-full left-0 mb-2 w-64 bg-panel border border-border rounded-xl shadow-xl p-2 z-20"
                  >
                    <div className="flex items-center bg-surface border border-white/5 rounded-lg p-1.5 mb-2 focus-within:border-white/20 transition-colors">
                      <input 
                        type="text" 
                        placeholder="Ask to change response" 
                        className="bg-transparent outline-none flex-1 px-2 text-xs text-white"
                        value={changeInstruction}
                        onChange={(e) => setChangeInstruction(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChangeResponse('custom', changeInstruction)}
                      />
                      <button onClick={() => handleChangeResponse('custom', changeInstruction)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors">
                        <ArrowUp className="w-3 h-3 text-white" />
                      </button>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => handleChangeResponse('try_again')} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-surface flex items-center gap-3 transition-colors">
                        <RefreshCw className="w-4 h-4 text-gray-400" />
                        Try again
                      </button>
                      <button onClick={() => handleChangeResponse('think_longer')} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-surface flex items-center gap-3 transition-colors">
                        <Lightbulb className="w-4 h-4 text-gray-400" />
                        Think longer
                      </button>
                      <button onClick={() => handleChangeResponse('search_web')} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-surface flex items-center gap-3 transition-colors">
                        <Globe className="w-4 h-4 text-gray-400" />
                        Search the web
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative" ref={moreActionsRef}>
              <button onClick={() => setShowMoreActions(!showMoreActions)} className="p-1 text-muted hover:text-text transition-colors" title="More actions">
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {showMoreActions && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute bottom-full left-0 mb-2 w-48 bg-panel border border-border rounded-xl shadow-xl py-1 overflow-hidden z-20"
                  >
                    <button onClick={() => { setShowMoreActions(false); onOpenSources(message); }} className="w-full text-left px-4 py-2 text-sm text-text hover:bg-surface flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted" />
                      View sources
                    </button>
                    <button onClick={handleBranchChat} className="w-full text-left px-4 py-2 text-sm text-text hover:bg-surface flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-muted" />
                      Branch in new chat
                    </button>
                    <button onClick={handleReadAloud} className="w-full text-left px-4 py-2 text-sm text-text hover:bg-surface flex items-center gap-2">
                      <Volume2 className={`w-4 h-4 ${isReading ? 'text-accent animate-pulse' : 'text-muted'}`} />
                      {isReading ? 'Stop reading' : 'Read aloud'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Timestamp Row */}
        <div className="flex items-center justify-end mt-2 text-[10px] opacity-60">
          <span>{formatTime(message.timestamp || message.createdAt)}</span>
        </div>

        {/* Feedback Input Dropdown */}
        {!isUser && showFeedbackInput && (
          <div className="mt-2 flex items-center gap-2">
            <input 
              type="text" 
              className="flex-1 bg-surface border border-border rounded-md px-2 py-1 text-xs outline-none focus:border-accent text-text"
              placeholder="Suggest a correction..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
            <button onClick={submitFeedbackText} className="px-2 py-1 bg-accent text-white rounded-md text-xs hover:bg-accent/80 transition">
              Send
            </button>
          </div>
        )}
        {feedbackSaved && <span className="text-[10px] text-emerald-500 mt-1 block">Feedback saved. Thank you!</span>}
      </div>

      <ShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        message={message}
        conversationTitle="MEGHA AI Conversation"
      />
    </motion.div>
  );
}

// ReactMarkdown code block parser
function renderContent(text, isUser, onArtifactOpen) {
  if (isUser || !text) return text;
  
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const lang = match ? match[1].toLowerCase() : '';
          const isRenderable = ['html', 'javascript', 'js', 'react', 'jsx', 'python', 'py', 'java', 'c', 'cpp', 'go', 'ruby', 'rust'].includes(lang);
          const codeString = String(children).replace(/\n$/, '');

          if (!inline && match) {
            return (
              <div className="mac-window">
                <div className="mac-header">
                  <div className="flex items-center gap-1.5 mr-2">
                    <div className="mac-dot mac-dot-red" />
                    <div className="mac-dot mac-dot-yellow" />
                    <div className="mac-dot mac-dot-green" />
                  </div>
                  <div className="flex items-center gap-2 flex-1 font-mono text-xs text-gray-400 justify-center">
                    <Code2 className="w-3.5 h-3.5" />
                    <span className="uppercase tracking-wider">{lang}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {onArtifactOpen && (
                      <button 
                        onClick={() => onArtifactOpen(codeString, lang)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/20 text-accent hover:bg-accent hover:text-white rounded-md transition font-semibold cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Run Code</span>
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(codeString);
                        toast.success('Code copied!', { icon: '📋', style: { borderRadius: '10px', background: '#333', color: '#fff' } });
                      }}
                      className="p-1.5 text-gray-400 hover:text-white transition-colors"
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-[13px] leading-relaxed">
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={lang}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      background: 'transparent',
                    }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              </div>
            );
          }
          return (
            <code className="bg-white/10 text-accent-light px-1.5 py-0.5 rounded-md font-mono text-[0.9em]" {...props}>
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p className="mb-1.5 last:mb-0 leading-relaxed text-[15px]">{children}</p>;
        },
        h1({ children }) { return <h1 className="text-2xl font-bold mt-6 mb-4 font-outfit text-white">{children}</h1>; },
        h2({ children }) { return <h2 className="text-xl font-bold mt-5 mb-3 font-outfit text-white">{children}</h2>; },
        h3({ children }) { return <h3 className="text-lg font-bold mt-4 mb-2 font-outfit text-white">{children}</h3>; },
        ul({ children }) { return <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>; },
        ol({ children }) { return <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>; },
        li({ children }) { return <li className="mb-1 leading-relaxed">{children}</li>; },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-accent bg-accent/5 pl-4 py-2 pr-4 my-4 rounded-r-lg italic text-gray-300">
              {children}
            </blockquote>
          );
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto mb-4 border border-border/50 rounded-lg">
              <table className="w-full text-left border-collapse text-sm">{children}</table>
            </div>
          );
        },
        th({ children }) { return <th className="bg-surface/50 border-b border-border/50 p-3 font-semibold">{children}</th>; },
        td({ children }) { return <td className="border-b border-border/30 p-3">{children}</td>; }
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
// force vite update
