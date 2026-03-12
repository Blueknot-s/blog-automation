export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: { message: 'Method Not Allowed' } });

  try {
    const { contents } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;
    
    // 모델명을 'gemini-2.0-flash-001'로 풀 네임을 명시하는 것이 2026년 표준입니다.
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-001:generateContent?key=${API_KEY}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ 
        error: { message: `[최종 확인 에러] ${data.error.message} (코드: ${data.error.code})` } 
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({ error: { message: `[통신 장애] ${error.message}` } });
  }
}
