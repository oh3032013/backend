import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_cyberpunk_neon_gaming_key_2026';

export const verifyToken = (req, res, next) => {
  // جلب التوكن من الهيدر
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: 'برجاء تسجيل الدخول أولاً، التوكن مفقود!' });
  }

  try {
    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next(); // انقل للمسار اللي بعده بأمان
  } catch (error) {
    return res.status(403).json({ success: false, message: 'جلسة الدخول منتهية أو التوكن غير صالح!' });
  }
};
