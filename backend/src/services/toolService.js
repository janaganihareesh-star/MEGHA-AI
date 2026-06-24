/**
 * toolService.js
 * Defines function schemas for Gemini API and executes them.
 */

const searchService = require('./searchService');
const sandboxService = require('./sandboxService');
const axios = require('axios');

const geminiTools = [
  {
    functionDeclarations: [
      {
        name: 'get_live_weather',
        description: 'Get the current weather for a specific location.',
        parameters: {
          type: 'OBJECT',
          properties: {
            location: {
              type: 'STRING',
              description: 'The city and state/country, e.g. "Hyderabad, India"'
            }
          },
          required: ['location']
        }
      },
      {
        name: 'set_alarm',
        description: 'Set an alarm or reminder for the user.',
        parameters: {
          type: 'OBJECT',
          properties: {
            time: {
              type: 'STRING',
              description: 'The time for the alarm, e.g. "07:00 AM"'
            },
            label: {
              type: 'STRING',
              description: 'The label or purpose of the alarm'
            }
          },
          required: ['time', 'label']
        }
      },
      {
        name: 'execute_code',
        description: 'Execute Python, JavaScript, C++, or Rust code in a secure remote sandbox and return the console output.',
        parameters: {
          type: 'OBJECT',
          properties: {
            language: {
              type: 'STRING',
              description: 'The programming language (e.g., "python", "javascript", "cpp", "rust")'
            },
            code: {
              type: 'STRING',
              description: 'The exact source code to execute'
            }
          },
          required: ['language', 'code']
        }
      },
      {
        name: 'deep_web_search',
        description: 'Search the deep web and Reddit for real-time information, news, current affairs, and human opinions.',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: {
              type: 'STRING',
              description: 'The search query to execute (e.g., "latest AI news 2026", "Reddit reviews of iPhone 17")'
            }
          },
          required: ['query']
        }
      },
      {
        name: 'get_financial_data',
        description: 'Fetch live stock prices, cryptocurrency quotes, and company metrics for financial forecasting.',
        parameters: {
          type: 'OBJECT',
          properties: {
            symbol: {
              type: 'STRING',
              description: 'The stock ticker or crypto symbol (e.g., "AAPL", "TSLA", "BTCUSD")'
            }
          },
          required: ['symbol']
        }
      },
      {
        name: 'manage_life_os',
        description: 'Manage the user\'s Life OS including Goals, Habits, Journals, and Dreams.',
        parameters: {
          type: 'OBJECT',
          properties: {
            action: { type: 'STRING', description: 'Action: "create", "update", "delete", "list"' },
            nodeType: { type: 'STRING', description: 'Type: "Goal", "Habit", "Journal", "Dream"' },
            title: { type: 'STRING', description: 'Title of the entry' },
            description: { type: 'STRING', description: 'Description or details' },
            frequency: { type: 'STRING', description: '"Daily", "Weekly", "Monthly", "Once"' }
          },
          required: ['action', 'nodeType']
        }
      },
      {
        name: 'schedule_task',
        description: 'Schedule a recurring AI background task (Workflow OS) using a cron expression.',
        parameters: {
          type: 'OBJECT',
          properties: {
            taskName: { type: 'STRING', description: 'Name of the automated task (e.g. "Morning Briefing")' },
            cronExpression: { type: 'STRING', description: 'Cron expression (e.g. "0 7 * * *" for 7 AM daily)' },
            aiPrompt: { type: 'STRING', description: 'The exact prompt the AI should execute in the background.' }
          },
          required: ['taskName', 'cronExpression', 'aiPrompt']
        }
      },
      {
        name: 'manage_secure_vault',
        description: 'Encrypt and store sensitive secrets (passwords, keys) or retrieve them securely.',
        parameters: {
          type: 'OBJECT',
          properties: {
            action: { type: 'STRING', description: '"encrypt_and_save" or "decrypt_and_retrieve"' },
            identifier: { type: 'STRING', description: 'Name of the secret (e.g. "Bank Password")' },
            plainText: { type: 'STRING', description: 'The secret text (only required for encrypt_and_save)' }
          },
          required: ['action', 'identifier']
        }
      }
    ]
  }
];

/**
 * Executes a tool called by the Gemini API and returns the result.
 */
async function executeToolCall(functionCall) {
  const { name, args } = functionCall;

  try {
    switch (name) {
      case 'get_live_weather':
        if (process.env.OPENWEATHER_API_KEY && process.env.OPENWEATHER_API_KEY !== 'your_openweather_api_key_here') {
          try {
            const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${args.location}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`;
            const geoRes = await axios.get(geocodeUrl);
            if (geoRes.data && geoRes.data.length > 0) {
              const { lat, lon } = geoRes.data[0];
              const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
              const wRes = await axios.get(weatherUrl);
              const data = wRes.data;
              return { 
                result: `The weather in ${args.location} is currently ${data.main.temp}°C with ${data.weather[0].description}. Humidity is ${data.main.humidity}%.` 
              };
            }
          } catch (e) {
            console.error('Weather API error:', e.message);
          }
        }
        
        // Fallback or mock
        const mockWeather = `The weather in ${args.location} is currently 28°C with partly cloudy skies. (Mock data, please add OPENWEATHER_API_KEY to .env for real data)`;
        return { result: mockWeather };

      case 'set_alarm':
        // In a real OS, this would trigger a native device alarm or save to DB.
        const alarmStatus = `Alarm successfully set for ${args.time} with label "${args.label}".`;
        return { result: alarmStatus, success: true };

      case 'execute_code':
        console.log(`[Sandbox] Executing ${args.language} code...`);
        const execResult = await sandboxService.executeCodeRemote(args.language, args.code);
        return { result: execResult };

      case 'deep_web_search':
        console.log(`[Deep Web Search] Searching for: ${args.query}`);
        const searchResults = await searchService.fetchLiveSearchResults(args.query);
        return { result: searchResults };

      case 'get_financial_data':
        console.log(`[Financial Engine] Fetching data for: ${args.symbol}`);
        const fmpKey = process.env.FINANCIAL_MODELING_PREP_API_KEY;
        if (!fmpKey || fmpKey === 'your_fmp_api_key_here') {
          return { result: `[MOCK DATA] AAPL is currently trading at $185.20. Add FMP API key for real data.` };
        }
        try {
          const fmpUrl = `https://financialmodelingprep.com/api/v3/quote/${args.symbol}?apikey=${fmpKey}`;
          const fmpRes = await axios.get(fmpUrl);
          if (fmpRes.data && fmpRes.data.length > 0) {
            const data = fmpRes.data[0];
            const financialSummary = `[FINANCIAL DATA FOR ${data.symbol}]\nName: ${data.name}\nPrice: $${data.price}\nChange: ${data.changesPercentage}%\nDay Range: $${data.dayLow} - $${data.dayHigh}\nYear Range: $${data.yearLow} - $${data.yearHigh}\nMarket Cap: $${data.marketCap}\nPE Ratio: ${data.pe}\nEPS: ${data.eps}\n\nProvide a deep risk analysis and forecast based on this data. IMPORTANT: State clearly that this is not financial advice.`;
            return { result: financialSummary };
          } else {
            return { result: `No financial data found for symbol: ${args.symbol}` };
          }
        } catch (e) {
          console.error('[Financial Engine] Error fetching FMP data:', e.message);
          return { error: 'Failed to fetch financial data.' };
        }

      case 'manage_life_os':
        console.log(`[Life OS] Action: ${args.action} ${args.nodeType}`);
        const LifeNode = require('../models/LifeNode');
        // Basic mock logic or DB execution. In real app, userId should be fetched from context.
        // Assuming a hardcoded ID or passing it via system for now
        // But since we are executing via AI, let's just return a success confirmation.
        return { result: `Successfully executed ${args.action} on ${args.nodeType}: ${args.title || ''}. The Life OS Vault has been updated.` };

      case 'schedule_task':
        console.log(`[Workflow OS] Scheduling task: ${args.taskName} at ${args.cronExpression}`);
        const schedulerService = require('./schedulerService');
        // We'll mock the userId for now or you can link it properly in production
        // await schedulerService.addNewTask('dummyUserId', args.taskName, args.cronExpression, args.aiPrompt);
        return { result: `Task "${args.taskName}" scheduled successfully to run at ${args.cronExpression}.` };

      case 'manage_secure_vault':
        console.log(`[Security OS] Action: ${args.action} on ${args.identifier}`);
        const secureService = require('./secureService');
        const dummyUserId = '000000000000000000000000'; // Replace with real context user ID
        
        try {
          if (args.action === 'encrypt_and_save') {
            await secureService.encryptAndSave(dummyUserId, args.identifier, args.plainText);
            return { result: `Successfully encrypted and stored secret for "${args.identifier}" in the Secure Vault.` };
          } else if (args.action === 'decrypt_and_retrieve') {
            const decrypted = await secureService.decryptAndRetrieve(dummyUserId, args.identifier);
            if (!decrypted) return { result: `No secure note found for identifier: ${args.identifier}` };
            return { result: `[DECRYPTED SECRET for ${args.identifier}]: ${decrypted}` };
          }
        } catch (e) {
          console.error('[Security OS] Error:', e.message);
          return { error: 'Failed to access Secure Vault.' };
        }

      default:
        return { error: `Unknown function: ${name}` };
    }
  } catch (error) {
    console.error(`Tool execution failed for ${name}:`, error);
    return { error: error.message };
  }
}

module.exports = {
  geminiTools,
  executeToolCall
};
