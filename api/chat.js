import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY
});

// 模型白名单
const VALID_MODELS = ['deepseek-chat', 'deepseek-reasoner'];

app.post('/api/chat', async (req, res) => {
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
      messages,
      temperature: 0.7,
      max_tokens: 2000
    });

    res.json({ choices: completion.choices });
  } catch (error) {
    console.error('API错误:', error);
    res.status(500).json({
      error: {
        code: 'STAR_TRAIL_ERROR',
        message: error.message
      }
    });
  }
});

app.listen(port, () => {
  console.log(`🌠 星辰服务器运行在 http://localhost:${port}`);
});
