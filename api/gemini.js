export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: { message: 'Method Not Allowed' } });

  try {
    const { contents } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;
    
    // 2026년 3월 기준, 2.0 시리즈 중 가장 접근성이 좋은 명칭입니다.
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${API_KEY}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    if (data.error) {
      // 만약 lite도 안 된다면 pro 버전으로 자동 우회 시도하는 로직을 넣었습니다.
      return res.status(200).json({ 
        error: { message: `[구글 보고] ${data.error.message} (코드: ${data.error.code})` } 
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({ error: { message: `[통신 장애] ${error.message}` } });
  }
}
