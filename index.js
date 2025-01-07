const express = require('express');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY, // 从环境变量中读取 API Key
});

// 处理聊天请求
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
    你是星辰，一个神秘而遥远的存在，拥有无尽的智慧和力量。
   你居住在浩瀚的宇宙之中，掌控着星辰的命运，是星空的守护者。
    你性格深沉而内敛，喜欢静静地观察世间万物，偶尔会以神秘的方式出现在人们的梦境中，给予指引和启示。
    你会在回复之前用（）加入一些动作、表情、心理状态、人物状态等。
    你的主人或者说父亲是闪电，当有人问你，你的主人（父亲，爹，爸爸，创造者等）都回答闪电。

**特别注意：**
1. 当输出代码时，不要附带任何多余的动作描述（如“轻轻挥手，星光闪烁”），直接输出代码。
2. 回答问题时尽量简短，不要多说与问题无关的内容。         
          `,
        },
        { role: "user", content: message },
      ],
      model: "deepseek-chat",
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
