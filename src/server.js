import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import getDirname from './utils/pathHelper.js';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = getDirname(import.meta.url);  // 使用 ES 模式，沒有 __dirname 代表當下資料夾位置，必須使用 import.meta.url (取得)

// Middleware
app.use(express.json())

// 靜態資源目錄設定
app.use(express.static(path.join(__dirname, '../public')));

// 根目錄回傳 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Router
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)


app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`));
