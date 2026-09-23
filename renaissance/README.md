# Rest System — مشروع موقع مطعم Renaissance

**خطأ "Command cd renaissance && npm install exited with 1"؟**

يظهر هذا الخطأ عندما يكون في Vercel **أمر تثبيت مخصص** قديم. يجب تطبيق **نقطتين** معاً:

1. **ضبط مجلد الجذر (Root Directory)**
   - **Settings** → **General** → **Root Directory** → **Edit**
   - اكتب: `renaissance` (بدون مسافات، بحروف صغيرة)
   - **Save**

2. **إلغاء أوامر التثبيت والبناء المخصصة**
   - **Settings** → **Build and Deployment** (أو **General**)
   - في **Build and Development Settings** تأكد أن **Override** غير مفعّل لأمر التثبيت والبناء، أو:
   - **Install Command**: اتركه **فارغاً** (احذف أي نص مثل `cd renaissance && npm install`)
   - **Build Command**: اتركه **فارغاً**
   - احفظ ثم **Redeploy**

بعد ذلك يبني Vercel من مجلد `renaissance` ويشغّل `npm install` و `npm run build` تلقائياً داخل ذلك المجلد.

---

**هل تظهر لديك صفحة 404 على Vercel؟** أو **"No Next.js version detected"** أو **"The specified Root Directory does not exist"**؟ اضبط **مجلد الجذر (Root Directory)** على `renaissance` (بدون مسافة قبل أو بعد): **Settings → Build and Deployment → Root Directory** → Edit → اكتب `renaissance` → Save ثم **Redeploy**.

---

## لا زالت تظهر 404؟ استكشاف الأخطاء

اتبع الخطوات بالترتيب:

1. **تأكد من مجلد الجذر بالضبط**
   - القيمة الصحيحة فقط: `renaissance` (حرفاً بحرف، **بدون مسافة في البداية أو النهاية**).
   - إذا ظهرت رسالة **"The specified Root Directory ... does not exist"** فغالباً يوجد مسافة زائدة: مثلاً `renaissance ` أو ` renaissance`. احذفها واترك `renaissance` فقط.
   - بدون شرطة `/` في البداية أو النهاية، بدون مسافات، وبحروف صغيرة (r صغيرة).

2. **احفظ ثم أعد النشر**
   - بعد تغيير **Root Directory** اضغط **Save**.
   - ثم اذهب إلى **Deployments** → اختر آخر نشر → من القائمة (⋯) اختر **Redeploy**.
   - أو ادفع أي تعديل جديد إلى Git ثم انتظر اكتمال النشر الجديد.

3. **تحقق من سجلات البناء (Build Logs)**
   - في **Deployments** افتح آخر نشر ثم **Building** أو **Logs**.
   - إذا ظهر **Build failed** أو **Error**، المشكلة من البناء (مثلاً: متغيرات بيئة، أو خطأ في Prisma). أصلح الخطأ ثم أعد النشر.
   - إذا اكتمل البناء بنجاح ولكن الموقع يعطي 404، تأكد مرة أخرى أن **Root Directory** = `renaissance` وأنك فتحت رابط **أحدث** نشر (Production أو أحدث Preview).

4. **الرابط الذي تفتحه**
   - تأكد أنك تفتح رابط **نشر تم بناؤه بعد** تغيير مجلد الجذر (مثلاً رابط Production أو أحدث Preview)، وليس رابط نشر قديم.

5. **إن لم ينجح شيء**
   - احذف المشروع من Vercel ثم أعد ربط المستودع من جديد، وعند إنشاء المشروع اختر **Root Directory** = `renaissance` من البداية، ولا تضف أي **Install Command** أو **Build Command** مخصص.

---

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

لا يوجد تطبيق أو `package.json` في الجذر؛ كل شيء موجود تحت `renaissance/` فقط. (يوجد في الجذر `package.json` و `vercel.json` للمساعدة في البناء فقط؛ **يجب أن يبقى Root Directory في Vercel = `renaissance`** حتى يعمل الموقع.)

## النشر على Vercel

بعد ربط المستودع بمشروع Vercel، **غيّر مجلد الجذر (Root Directory)** وإلا ستظهر صفحة 404:

1. افتح [Vercel Dashboard](https://vercel.com/dashboard) → اختر المشروع.
2. **Settings** → **Build and Deployment** (أو **General**).
3. في **Root Directory** اختر **Edit** واكتب: `renaissance`
4. احفظ (**Save**) ثم أعد النشر (**Redeploy**).

بهذا سيبني Vercel من مجلد `renaissance` حيث يوجد `package.json` و Next.js.
