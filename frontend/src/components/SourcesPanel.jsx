import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Globe, FileText, BrainCircuit } from 'lucide-react';

export default function SourcesPanel({ isOpen, onClose, message }) {
  if (!message) return null;

  // Derive sources from message contextUsed or memory
  const memorySources = message.contextUsed?.filter(c => c.source === 'memory') || [];
  const webSources = message.contextUsed?.filter(c => c.source === 'web') || [];
  const fileSources = message.contextUsed?.filter(c => c.source === 'file') || [];

  // Fallback if contextUsed array is missing but memory text is available
  const hasFallbackMemory = memorySources.length === 0 && message.memoryContext;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[350px] lg:w-[400px] bg-bg border-l border-border/40 z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/40 bg-surface/50 backdrop-blur-md">
              <div className="flex items-center gap-2 text-text font-semibold">
                <BrainCircuit className="w-5 h-5 text-accent" />
                <span>Sources</span>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              {/* Memory Section */}
              {(memorySources.length > 0 || hasFallbackMemory) && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted">
                    <BookOpen className="w-4 h-4" />
                    <span>Memory • {memorySources.length || 1}</span>
                  </div>
                  
                  {memorySources.map((mem, idx) => (
                    <div key={idx} className="p-3 bg-surface border border-white/5 rounded-lg text-sm text-text/90 shadow-sm">
                      <div className="text-xs text-muted mb-1 font-medium">{mem.title || 'Memory snippet'}</div>
                      <p className="leading-relaxed">{mem.content}</p>
                    </div>
                  ))}

                  {hasFallbackMemory && (
                    <div className="p-3 bg-surface border border-white/5 rounded-lg text-sm text-text/90 shadow-sm">
                      <div className="text-xs text-muted mb-1 font-medium">Memory Context</div>
                      <p className="leading-relaxed">{message.memoryContext}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Web Section */}
              {webSources.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted">
                    <Globe className="w-4 h-4" />
                    <span>Web Search • {webSources.length}</span>
                  </div>
                  
                  {webSources.map((web, idx) => (
                    <a 
                      key={idx} 
                      href={web.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-surface border border-white/5 rounded-lg text-sm text-text/90 shadow-sm hover:border-accent/50 transition-colors group"
                    >
                      <div className="text-xs text-accent mb-1 font-medium truncate group-hover:underline">{web.title || web.url}</div>
                      <p className="leading-relaxed line-clamp-3">{web.content}</p>
                    </a>
                  ))}
                </div>
              )}

              {/* Files Section */}
              {fileSources.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted">
                    <FileText className="w-4 h-4" />
                    <span>Files • {fileSources.length}</span>
                  </div>
                  
                  {fileSources.map((file, idx) => (
                    <div key={idx} className="p-3 bg-surface border border-white/5 rounded-lg text-sm text-text/90 shadow-sm">
                      <div className="text-xs text-muted mb-1 font-medium">{file.filename || 'Uploaded Document'}</div>
                      <p className="leading-relaxed line-clamp-3">{file.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {memorySources.length === 0 && !hasFallbackMemory && webSources.length === 0 && fileSources.length === 0 && (
                <div className="text-center text-muted py-10">
                  <BrainCircuit className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No specific sources were used<br/>for this response.</p>
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
