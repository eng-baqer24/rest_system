# Renaissance — مطعم فاخر (Fine Dining)

موقع ويب لمطعم فاخر يركز على الحجز وتجربة المستخدم. مبني بـ Next.js و shadcn/ui و Prisma و Supabase.

## التشغيل المحلي

```bash
cd renaissance
npm install
cp .env.example .env
# عدّل .env وأضف DATABASE_URL (Supabase Postgres أو أي PostgreSQL)
npx prisma generate
npx prisma db push   # أو prisma migrate dev لإنشاء الجداول
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

## المتطلبات

- Node.js 18+
- قاعدة بيانات PostgreSQL (مثلاً عبر Supabase)

## الصفحات

- **الرئيسية**: Hero، نبذة عنا، أطباق مميزة، آراء العملاء، CTA للحجز
- **احجز طاولة** (`/booking`): خطوتان — التاريخ/الوقت/عدد الأشخاص ثم الاسم والبريد والهاتف والملاحظات، ثم صفحة تأكيد
- **قائمة الطعام** (`/menu`): مقبلات، أطباق رئيسية، حلويات، مشروبات + قسم قائمة التذوق
- **من نحن** (`/about`): رؤية المطعم، فلسفة الشيف، قصة العلامة
- **تواصل** (`/contact`): الموقع مع خريطة، ساعات العمل، هاتف، سياسة اللباس، المواقف

## التقنيات

- **Next.js 16** (App Router)
- **shadcn/ui** (مكونات واجهة)
- **Prisma** (ORM للحجز والبيانات)
- **Supabase** (قاعدة بيانات PostgreSQL + إعداد للمستقبل)
- **Tailwind CSS** (تصميم، ثيم داكن + ذهبي)

## التقرير

راجع ملف `تقرير-المشروع.md` لتفاصيل ما تم إنجازه والمشاكل والحلول.
