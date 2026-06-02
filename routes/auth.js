import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_cyberpunk_neon_gaming_key_2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'OmarXGaming2026';

// تسجيل الدخول للأدمن بدون مكاتب ترجمة مسببة للوقوع أونلاين
router.post('/login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ 
      success: false, 
      message: 'كلمة المرور مطلوبة لتسجيل الدخول!'
    });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ 
      success: false, 
      message: 'كلمة المرور التي أدخلتها غير صحيحة!'
    });
  }

  // إنشاء توكن الإدارة صالح لمدة 24 ساعة
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });

  return res.json({
    success: true,
    message: 'تم تسجيل الدخول بنجاح! مرحباً بك يا عمر في لوحة التحكم 🚀',
    token
  });
});

export default router;
