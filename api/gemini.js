export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method Not Allowed' } });
  }

  try {
    const { contents } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;
    
    // 모델 명칭을 2.0 정식 버전으로 고정합니다.
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    // 구글 서버 에러를 상세하게 화면에 표시하기 위한 로직
    if (data.error) {
      console.error('Google API Error:', data.error);
      return res.status(200).json({ error: { message: `[Google 에러] ${data.error.message} (코드: ${data.error.code})` } });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(200).json({ error: { message: `[서버 에러] ${error.message}` } });
  }
}
