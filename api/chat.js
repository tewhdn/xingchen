import { createRouter } from 'next-connect';
import OpenAI from 'openai';

const router = createRouter();

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY
});

router.post(async (req, res) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: req.body.messages,
            model: req.body.model,
            temperature: 0.7,
            max_tokens: 1500
        });
        res.json(completion);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: '星轨连接异常' });
    }
});

export default router;