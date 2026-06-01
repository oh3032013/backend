import axios from 'axios';

// الروابط دي هتقرأ أوتوماتيك من الـ Environment Variables اللي هنضيفها في Render
const BIN_URL = process.env.BIN_URL;
const MASTER_KEY = process.env.MASTER_KEY;

// القيمة الافتراضية في حال حدوث أي خطأ
const initialData = { stats: { subscribers: 0, views: 0, videos: 0 }, videos: [], messages: [] };

// قراءة البيانات من JSONbin أونلاين
export const readData = async () => {
  try {
    const response = await axios.get(BIN_URL, {
      headers: {
        'X-Master-Key': MASTER_KEY,
        'X-Bin-Meta': 'false' // عشان يجيب البيانات مباشرة بدون الـ Metadata بتاعة الموقع
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error reading from online database:', error);
    return initialData;
  }
};

// حفظ البيانات في JSONbin أونلاين
export const writeData = async (data) => {
  try {
    await axios.put(BIN_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY
      }
    });
    return true;
  } catch (error) {
    console.error('Error writing to online database:', error);
    return false;
  }
};