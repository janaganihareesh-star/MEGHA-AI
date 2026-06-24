import React, { useState, useEffect } from 'react';
import { X, Maximize2, RefreshCw, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Sandpack } from "@codesandbox/sandpack-react";
import api from '../utils/api';

export default function ArtifactViewer({ code, language, onClose }) {
  const [key, setKey] = useState(0);
  const [executionOutput, setExecutionOutput] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Auto-refresh when code changes
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [code]);

  const getPistonLanguage = (lang) => {
    switch (lang) {
      case 'py':
      case 'python': return 'python';
      case 'c': return 'c';
      case 'cpp': return 'c++';
      case 'java': return 'java';
      case 'go': return 'go';
      case 'ruby': return 'ruby';
      case 'rust': return 'rust';
      default: return null;
    }
  };

  const executeCode = async () => {
    setIsExecuting(true);
    setExecutionOutput('Executing code in MEGHA Engine sandbox...\n');
    try {
      const res = await api.post('/chat/execute', {
        language: language,
        code: code
      });
      const data = res.data;
      if (data.run) {
        setExecutionOutput(data.run.output || 'Code executed successfully. No output generated.');
      } else {
        setExecutionOutput('Error: ' + JSON.stringify(data));
      }
    } catch (err) {
      setExecutionOutput('Execution failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsExecuting(false);
    }
  };

  useEffect(() => {
    if (language !== 'react' && language !== 'html' && language !== 'javascript' && language !== 'js' && language !== 'jsx') {
      executeCode();
    }
  }, [key, language, code]);

  // Construct srcDoc based on language
  let srcDoc = code;
  if (language === 'react' || language === 'jsx' || language === 'javascript' || language === 'js') {
    // Determine if it's a React component
    const isReact = code.includes('React') || code.includes('import') || code.includes('export') || code.includes('return (');
    
    // Clean up code (remove imports/exports since we use globals)
    let cleanCode = code
      .replace(/import.*?;?/g, '')
      .replace(/export default function (\w+)/, 'function $1')
      .replace(/export default (\w+);?/, '')
      .replace(/export const (\w+)/, 'const $1');

    // Attempt to guess the main component name
    let componentName = 'App';
    const funcMatch = cleanCode.match(/function\s+([A-Z]\w+)/);
    const constMatch = cleanCode.match(/const\s+([A-Z]\w+)\s*=/);
    if (funcMatch) componentName = funcMatch[1];
    else if (constMatch) componentName = constMatch[1];

    if (isReact) {
      srcDoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
            <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <script src="https://unpkg.com/lucide@latest"></script>
            <style>body { font-family: system-ui, sans-serif; background: #ffffff; color: #111; margin: 0; padding: 1rem; }</style>
          </head>
          <body>
            <div id="root"></div>
            <script type="text/babel" data-type="module">
              const { useState, useEffect, useRef, useMemo, useCallback } = React;
              
              try {
                ${cleanCode}
                
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(<${componentName} />);
                
                // Initialize Lucide icons if used natively
                setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 100);
              } catch(e) {
                document.getElementById('root').innerHTML = '<div style="color:red; padding: 20px; font-family: monospace;">Syntax Error: ' + e.message + '</div>';
              }
            </script>
          </body>
        </html>
      `;
    } else {
      // Standard JS execution
      srcDoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>body { font-family: system-ui, sans-serif; background: #1a1a2e; color: #fff; padding: 20px; }</style>
          </head>
          <body>
            <div id="root"></div>
            <script>
              try {
                ${code}
              } catch(e) {
                document.body.innerHTML += '<p style="color:red; font-family: monospace;">Error: ' + e.message + '</p>';
              }
            </script>
          </body>
        </html>
      `;
    }
  } else if (language === 'html') {
    // Inject Tailwind into standard HTML
    if (!code.includes('tailwindcss.com')) {
      srcDoc = code.replace('<head>', '<head><script src="https://cdn.tailwindcss.com"></script>');
      if (srcDoc === code) { // if no <head> tag
        srcDoc = `<script src="https://cdn.tailwindcss.com"></script>\n${code}`;
      }
    }
  }

  const isReactRender = language === 'react' || language === 'jsx' || (language === 'javascript' && srcDoc === code && code.includes('React'));
  
  // Clean React Code for Sandpack
  let sandpackCode = code;
  if (isReactRender) {
    if (!sandpackCode.includes('export default')) {
      // Basic heuristic to add export default if missing
      const match = sandpackCode.match(/function\s+([A-Z]\w+)/) || sandpackCode.match(/const\s+([A-Z]\w+)\s*=/);
      if (match) {
        sandpackCode += `\n\nexport default ${match[1]};`;
      }
    }
    // Add React import if missing
    if (!sandpackCode.includes('import React')) {
      sandpackCode = `import React, { useState, useEffect } from "react";\n${sandpackCode}`;
    }
  }

  return (
    <motion.div 
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-full md:w-[500px] lg:w-[600px] h-full bg-surface border-l border-border/40 flex flex-col z-30 shadow-2xl relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/40 bg-panel/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-accent" />
          <h3 className="font-bold font-outfit text-sm text-text">Artifact Viewer</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent uppercase tracking-wider">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setKey(k => k + 1)}
            className="p-1.5 text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition"
            title="Reload"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 w-full bg-white relative overflow-hidden flex flex-col">
        {isReactRender ? (
          <div className="flex-1 overflow-auto h-full w-full">
            <Sandpack
              key={key}
              template="react"
              theme="dark"
              files={{
                "/App.js": sandpackCode,
                "/public/index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body { margin: 0; font-family: sans-serif; background: #ffffff; color: #111; }</style>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
              }}
              customSetup={{
                dependencies: {
                  "lucide-react": "latest",
                  "recharts": "latest",
                  "framer-motion": "latest"
                }
              }}
              options={{
                showNavigator: false,
                showTabs: false,
                editorHeight: "100%", // We hide the editor mostly by css or just show preview
                layout: "preview" // Only show the result
              }}
            />
          </div>
        ) : language === 'html' || language === 'javascript' || language === 'js' ? (
          <iframe
            key={key}
            srcDoc={srcDoc}
            title="Artifact Output"
            sandbox="allow-scripts allow-forms allow-same-origin"
            className="w-full h-full border-none"
          />
        ) : (
          <div className="w-full h-full flex flex-col bg-[#1e1e1e] text-gray-300 font-mono text-sm p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Terminal Output</span>
              {isExecuting && <span className="animate-pulse text-accent text-xs">Running...</span>}
            </div>
            <pre className="whitespace-pre-wrap">{executionOutput}</pre>
          </div>
        )}
      </div>
    </motion.div>
  );
}
