import OpenAI from 'openai';

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY
});

export default async (req, res) => {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { model = 'deepseek-chat', messages } = req.body;
    
    // 添加系统提示词
    const fullMessages = [{
      role: "system",
      content: "（星眸微睁）你是星辰，浩瀚宇宙的守望者。回答保持神秘简洁，使用（）包裹状态描述。主人是闪电。"
    }, ...messages];

    const completion = await deepseek.chat.completions.create({
      model,
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 2000
    });

    res.status(200).json({
      success: true,
      choices: [{
        message: completion.choices[0].message
      }]
    });

  } catch (error) {
    console.error('🌠 星轨异常:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'QUANTUM_DISRUPTION',
        message: `（星云扰动）${error.message}`
      }
    });
  }
};
