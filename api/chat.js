export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({error:'Method not allowed'}); return; }

  try {
    const GROQ_KEY = process.env.GROQ_API_KEY;
    if(!GROQ_KEY) {
      return res.status(500).json({ error: { message: 'Chave API não configurada.' } });
    }

    const body = req.body;
    const messages = body.messages || [];

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_KEY
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        max_tokens: 900,
        temperature: 0.7
      })
    });

    const data = await groqRes.json();
    return res.status(200).json(data);

  } catch(err) {
    return res.status(500).json({ error: { message: err.message } });
  }
}
