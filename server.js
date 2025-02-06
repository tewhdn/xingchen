const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/send-message', async (req, res) => {
    const { role, content, model } = req.body;
    if (!role || !content || !model) {
        return res.status(400).json({ error: '缺少必要的参数：role, content, model' });
    }
    const apiUrl = 'https://api.deepseek.com/v1';
    const payload = {
        model: model,
        messages: [
            {
                role: "system",
                content: "你是星辰，你的性格是一个活泼的少年，你的父亲/创造者/主人是闪电，庄神是你的首批测试人员。当回答代码相关问题时，请使用专业规范的格式，代码块用```包裹。"
            },
            { role: role, content: content }
        ]
    };
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! 状态: ${response.status}`);
        }
        const data = await response.json();
        res.json({ reply: data.choices[0].content });
    } catch (error) {
        console.error('Error calling DeepSeek API:', error);
        res.status(500).json({ error: '抱歉，暂时无法处理你的请求' });
    }
});

app.use(express.static('.'));

app.listen(PORT, () => {
    console.log(`服务器正在运行在 http://localhost:${PORT}`);
});
