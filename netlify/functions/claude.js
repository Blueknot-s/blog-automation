const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // POST 요청이 아니면 거절
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { model, messages } = JSON.parse(event.body);
    const API_KEY = process.env.ANTHROPIC_API_KEY; // Netlify 설정에서 등록한 키를 가져옴

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-3-7-sonnet-latest',
        max_tokens: 4000,
        messages: messages
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
