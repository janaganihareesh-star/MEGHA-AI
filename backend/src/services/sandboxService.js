const axios = require('axios');

/**
 * Executes code using the public Piston execution engine (emkc.org).
 * Supports Python, JavaScript, C++, Java, Rust, Go, etc.
 * 
 * @param {string} language - The programming language (e.g., 'python', 'javascript')
 * @param {string} code - The source code to execute
 */
async function executeCodeRemote(language, code) {
  // Normalize languages for Piston
  let pistonLang = language.toLowerCase();
  let version = '*';

  // Map common names to piston names
  const langMap = {
    'js': 'javascript',
    'py': 'python',
    'node': 'javascript',
    'c++': 'cpp'
  };

  if (langMap[pistonLang]) {
    pistonLang = langMap[pistonLang];
  }

  // Map known good versions (Piston supports '*' for latest)
  const versionMap = {
    'python': '3.10.0',
    'javascript': '18.15.0',
    'cpp': '10.2.0',
    'java': '15.0.2',
    'c': '10.2.0'
  };

  if (versionMap[pistonLang]) {
    version = versionMap[pistonLang];
  }

  const payload = {
    language: pistonLang,
    version: version,
    files: [
      {
        content: code
      }
    ],
    stdin: "",
    args: [],
    compile_timeout: 10000,
    run_timeout: 3000,
    compile_memory_limit: -1,
    run_memory_limit: -1
  };

  try {
    const response = await axios.post('https://emkc.org/api/v2/piston/execute', payload);
    const result = response.data;

    let output = '';
    if (result.compile && result.compile.output) {
      output += `[Compiler Output]\n${result.compile.output}\n`;
    }
    if (result.run && result.run.output) {
      output += result.run.output;
    }

    if (!output) {
      output = "Execution completed successfully with no console output.";
    }

    return {
      success: result.run?.code === 0,
      output: output.trim(),
      language: result.language,
      version: result.version
    };
  } catch (error) {
    console.error('Piston Execution Error:', error.response?.data || error.message);
    return {
      success: false,
      output: `Failed to execute code: ${error.message}`
    };
  }
}

module.exports = {
  executeCodeRemote
};
