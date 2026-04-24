const axios = require('axios');

class OpenRouterService {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://openrouter.ai/api/v1',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY}`,
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
        'X-Title': 'TravelMate',
        'Content-Type': 'application/json'
      }
    });
  }

  async sendMessage(params) {
    let retries = 3;
    let delay = 1000;

    let messages = params.messages || [];
    if (params.system) {
        messages = [{ role: 'system', content: params.system }, ...messages];
    }

    const payload = {
        model: params.model.includes('claude') && !params.model.startsWith('anthropic/') 
            ? `anthropic/${params.model}` 
            : params.model,
        messages: messages,
    };
    
    if (params.max_tokens) {
        payload.max_tokens = params.max_tokens;
    }
    if (params.response_format) {
        payload.response_format = params.response_format;
    }

    while (retries > 0) {
      try {
        const response = await this.client.post('/chat/completions', payload);
        
        return {
            content: [ { text: response.data.choices[0].message.content } ]
        };
      } catch (error) {
        if (error.response && (error.response.status === 429 || error.response.status >= 500)) {
          retries--;
          if (retries === 0) throw error;
          await new Promise(res => setTimeout(res, delay));
          delay *= 2;
        } else {
          throw error;
        }
      }
    }
  }
}

module.exports = new OpenRouterService();
