const express = require('express');
const app = express();

// استخدام Middleware لمعالجة بيانات JSON الواردة من واتساب
app.use(express.json());

// --- إعدادات التحقق ---
// اختر أي كلمة سر تريدها واكتبها هنا، واستخدم نفس الكلمة في خانة "تحقق من الرمز" في فيسبوك
const VERIFY_TOKEN = "ahmed123"; 

// 1. رابط التحقق (GET): يستخدمه واتساب للتأكد من أن السيرفر خاص بك
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // التحقق من أن الطلب قادم من واتساب وبواسطة الرمز الصحيح
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('✅ WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
    } else {
        console.log('❌ Verification failed. Token mismatch.');
        res.sendStatus(403);
    }
});

// 2. رابط استقبال الرسائل (POST): حيث تصل رسائل المستخدمين وتحديثات الحالة
app.post('/webhook', (req, res) => {
    const body = req.body;

    // طباعة البيانات المستلمة في سجلات Render لمراقبتها
    console.log('📩 New Webhook Received:');
    console.log(JSON.stringify(body, null, 2));

    // واتساب يتطلب الرد دائماً بحالة 200 لتأكيد الاستلام
    res.status(200).send('EVENT_RECEIVED');
});

// إعداد المنفذ (Port) الخاص بـ Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
});
