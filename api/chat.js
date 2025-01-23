// 安装所需依赖：npm install express cors dotenv openai
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 配置中间件
app.use(cors());
app.use(express.json());

// 初始化DeepSeek客户端
const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY // 从环境变量读取API密钥
});

// 处理聊天请求
app.post('/api/chat', async (req, res) => {
  try {
    const { model, messages } = req.body;

    // 调用DeepSeek API
    const completion = await deepseek.chat.completions.create({
      model: model || 'deepseek-chat',
      messages,
      temperature: 0.7,
      max_tokens: 2000
    });

    // 返回标准化响应
    res.json({
      success: true,
      choices: [{
        message: {
          role: 'assistant',
          content: completion.choices[0].message.content
        }
      }]
    });

  } catch (error) {
    console.error('API调用失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DEEPSEEK_API_ERROR',
        message: error.message
      }
    });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`🌌 星辰服务器已启动，监听端口：${port}`);
});
