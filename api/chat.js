// api/chat.js (Vercel专用格式)
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();

// 中间件配置
app.use(cors({
  origin: '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY
});

const VALID_MODELS = ['deepseek-chat', 'deepseek-reasoner'];

// Vercel Serverless Function入口
export default async (req, res) => {
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { model = 'deepseek-chat', messages } = req.body;

    if (!VALID_MODELS.includes(model)) {
      return res.status(400).json({
        error: '无效的星轨模式',
        validModels: VALID_MODELS
      });
    }

    const completion = await deepseek.chat.completions.create({
      model,
      messages: [{
        role: "system",
        content: `（${model === 'deepseek-reasoner' ? '星河推演' : '星海漫游'}模式启动）`
      }, ...messages],
      temperature: 0.7,
      max_tokens: 2000
    });

    res.json({ choices: completion.choices });
  } catch (error) {
    console.error('🌌星轨异常:', error);
    res.status(500).json({
      error: {
        code: error.code || 'QUANTUM_DISRUPTION',
        message: error.message
      }
    });
  }
};
