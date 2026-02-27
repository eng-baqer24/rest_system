# Rest System — مشروع موقع مطعم Renaissance

مستودع مشروع نظام المطعم. **التطبيق الفعلي (Next.js) موجود داخل مجلد `renaissance` فقط.**

## المسار الصحيح للتشغيل

يجب تشغيل الأوامر **دائماً من داخل مجلد `renaissance`** وليس من جذر المستودع:

```bash
# استنساخ المستودع
git clone https://github.com/eng-baqer24/rest_system.git
cd rest_system

# المسار الصحيح: الدخول إلى مجلد التطبيق
cd renaissance

# تثبيت الاعتماديات وتشغيل السيرفر
npm install
cp .env.example .env.local   # إن وُجد، ثم تعديل المتغيرات
npm run dev
```

## هيكل المشروع

| المسار | الوصف |
|--------|--------|
| `rest_system/` | جذر المستودع (لا تشغّل منه `npm run dev`) |
| `rest_system/renaissance/` | تطبيق Next.js — **شغّل الأوامر من هنا** |
| `rest_system/renaissance/src/` | الكود المصدري |
| `rest_system/.env.local` | **غير مرفوع** — أنشئه محلياً داخل `renaissance` عند الحاجة |

لا يوجد تطبيق أو `package.json` في الجذر؛ كل شيء موجود تحت `renaissance/` فقط.

## النشر على Vercel

بعد ربط المستودع بمشروع Vercel، **غيّر مجلد الجذر (Root Directory)** وإلا ستظهر صفحة 404:

1. افتح [Vercel Dashboard](https://vercel.com/dashboard) → اختر المشروع.
2. **Settings** → **General**.
3. في **Root Directory** اختر **Edit** واكتب: `renaissance`
4. احفظ (**Save**) ثم أعد النشر (**Redeploy**).

بهذا سيبني Vercel من مجلد `renaissance` حيث يوجد `package.json` و Next.js.
