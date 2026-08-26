أنشئ تطبيق ويب عربي RTL احترافي وتفاعلي باسم:

# CampusNow AI

باستخدام:

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS أو CSS حديث
* Lucide React Icons
* Responsive Design
* REST API integration

لا تنشئ Login أو Sign Up.

استخدم مستخدمًا تجريبيًا ثابتًا:

```ts
const CURRENT_USER_ID = "student-demo-01";
```

---

# فكرة التطبيق

CampusNow AI منصة لطلاب جامعة جدة.

المستخدم يختار فرع الجامعة والمبنى، ثم يكتب سؤالًا مثل:

* هل المبنى مزدحم الآن؟
* هل توجد أماكن متاحة؟
* هل يوجد انتظار طويل؟
* هل يوجد أحد يستطيع مساعدتي؟
* هل يوجد بلاغ عن غرض مفقود؟

يرسل React السؤال إلى Python/FastAPI.

Python يحتوي على 3 AI Agents:

1. Routing Agent
2. Verification Agent
3. Community & Volunteer Agent

ثم يعيد JSON للواجهة.

---

# الهوية البصرية

استخدم الألوان التالية في كامل التطبيق:

```css
--primary-dark: #004F6E;
--primary-light: #83CCEA;
--secondary-blue: #6E96A2;

--background: #F7FBFD;
--surface: #FFFFFF;
--text-primary: #19343F;
--text-secondary: #6E7B80;
--border: #DCEAF0;

--success: #22A06B;
--warning: #D99A25;
--danger: #D64545;
```

استخدم خط:

**Cairo**

العناوين:
Cairo Bold

النص:
Cairo Regular

استخدم:

* مساحات بيضاء واضحة
* Cards بيضاء
* Border radius بين 14px و18px
* Shadows خفيفة
* Hover transitions
* أزرار واضحة
* تصميم Minimal
* لا تستخدم مؤثرات AI مستقبلية أو Neon
* لا تجعل التصميم Dashboard مزدحمًا

---

# عدد الصفحات

أنشئ 3 صفحات فقط:

```text
/
الرئيسية

/volunteer
مساهماتي

/admin
مراجعات المسؤول
```

لا تنشئ صفحة مستقلة للسؤال.

السؤال والنتيجة يكونان في الصفحة الرئيسية نفسها.

---

# الصفحة الرئيسية

المستخدم عند فتح الموقع يجب أن يرى السؤال مباشرة.

## Header

Header أبيض ثابت وبسيط.

يمين الصفحة:

Logo صغير

**CampusNow AI**

القائمة:

* الرئيسية
* مساهماتي

يسار الصفحة:

زر نصي صغير:

**لوحة المسؤول**

لا تضع Sidebar.

---

# Hero Section

اجعل Hero في أعلى الصفحة بعد Header.

ارتفاعه متوسط، وليس Full Screen.

استخدم خلفية:

```css
background: linear-gradient(
  135deg,
  #004F6E 0%,
  #267C9B 55%,
  #83CCEA 100%
);
```

في منتصف Hero:

عنوان كبير:

# اسأل.. واعرف الآن

النص:

**اسأل عن أي موقع في جامعة جدة واعرف آخر المعلومات المتاحة من مجتمع الجامعة.**

ثم مباشرة تحت النص ضع Search / Question Card كبيرة باللون الأبيض.

هذه البطاقة هي أهم عنصر في الصفحة.

---

# Question Card

اجعل البطاقة بعرض كبير في منتصف الصفحة.

داخلها:

## حقل السؤال

Textarea أو Input كبير.

Placeholder:

**مثال: هل مبنى 11 مزدحم الآن؟**

---

## اختيار الفرع

Dropdown بعنوان:

**المقر أو الفرع**

القيم:

```text
شطر الطالبات - فرع الفيصلية
شطر الطالبات - فرع الرحاب
مقر التخصصات الصحية - فرع الشرفية
شطر الطلاب - فرع عسفان
شطر الطلاب - فرع الفيصلية
شطر الطلاب - فرع خليص
شطر الطالبات - فرع خليص
شطر الطلاب - فرع الكامل
```

---

## اختيار المبنى

Dropdown ثانٍ بعنوان:

**المبنى أو الموقع**

يجب أن يعتمد على الفرع المختار.

إذا لم يحدد المستخدم الفرع، يكون Disabled.

---

# مواقع شطر الطالبات - الفيصلية

```text
مبنى 14
مبنى 1
مبنى 5
مبنى الأمير عبدالمجيد (3)
معامل كلية العلوم
الحضانة
مبنى 9 - عمادة القبول والتسجيل
مبنى 11 - كلية علوم وهندسة الحاسب
مبنى 12 - مركز التعلم الإلكتروني والتعليم عن بعد
مبنى 17
مركز المؤتمرات
قاعة الأميرة الجوهرة
```

# شطر الطالبات - الرحاب

```text
كلية التصاميم والفنون
```

# مقر التخصصات الصحية - الشرفية

```text
كلية الطب
كلية العلوم الطبية التطبيقية
```

# شطر الطلاب - عسفان

```text
مبنى 19
مبنى 20
مبنى 21
مبنى 16
مبنى 18
مبنى 2 - المركز الطبي الجامعي
مبنى 4 - السنة التحضيرية
مبنى 1 - عمادة الدراسات العليا
مبنى 3
مبنى 6
مبنى 8
مبنى 10
مبنى 12 - عمادة القبول والتسجيل
مبنى 13
مبنى 5 - عمادة شؤون الطلاب
مبنى 9 - معامل كلية العلوم
الملاعب الرياضية
مبنى الإدارة العامة
مبنى الإدارة العليا
مبنى كلية علوم وهندسة الحاسب وكلية الأعمال
```

# شطر الطلاب - الفيصلية

```text
مبنى أ
مبنى ب
مبنى الإدارة والكليات
المسجد
```

# شطر الطلاب - خليص

```text
مقر فرع خليص - شطر الطلاب
```

# شطر الطالبات - خليص

```text
مقر فرع خليص - شطر الطالبات
```

# شطر الطلاب - الكامل

```text
مقر فرع الكامل - شطر الطلاب
```

---

# زر السؤال

تحت الحقول:

زر كبير:

**اسأل الآن**

استخدم:

```css
background: #004F6E;
color: white;
```

وعند Hover:

```css
background: #83CCEA;
color: #004F6E;
```

لا يسمح بالإرسال حتى:

* يوجد سؤال
* تم اختيار الفرع
* تم اختيار الموقع

---

# الأسئلة السريعة

أسفل البطاقة مباشرة:

النص:

**أسئلة سريعة**

ثم Chips:

```text
هل المكان مزدحم الآن؟
هل توجد أماكن متاحة؟
هل يوجد انتظار طويل؟
هل يوجد أحد يستطيع مساعدتي؟
هل توجد مفقودات هنا؟
```

عند الضغط على Chip:

ضع النص تلقائيًا داخل حقل السؤال.

---

# إرسال السؤال إلى Python

عند الضغط على:

**اسأل الآن**

استدع:

```http
POST http://localhost:8000/api/ask
```

أرسل:

```json
{
  "question": "هل مبنى 11 مزدحم الآن؟",
  "campus_id": "female-faisaliyah",
  "location_id": "faisaliyah-f-11",
  "requester_id": "student-demo-01"
}
```

---

# حالة الانتظار

بعد إرسال السؤال لا تختفِ الصفحة.

غيّر مكان النتيجة تحت Question Card إلى Loading Card.

اعرض:

**جاري تحليل سؤالك...**

ثم 3 خطوات بصرية:

```text
✓ فهم الطلب

● التحقق من المعلومات

○ إعداد النتيجة
```

بعد ثوانٍ أو عند تقدم الـRequest غيّر المظهر.

لا تعرض:

* Chain of Thought
* Agent prompts
* Hidden reasoning

---

# النتيجة

تظهر في الصفحة الرئيسية تحت Question Card.

لا تفتح صفحة جديدة.

إذا كان:

```text
status = verified
```

اعرض Card كبيرة.

Badge:

**✓ نتيجة موثقة**

ثم:

### الإجابة

اعرض:

`verification.answer`

بخط واضح.

---

## معلومات النتيجة

أسفل الإجابة اعرض 3 Mini Cards:

### مستوى الثقة

مثال:

**84%**

مع Progress bar.

---

### المصادر

مثال:

**3 مصادر**

باستخدام:

```ts
verification.evidence_used.length
```

---

### الموقع

اعرض:

```ts
routing.location_name
```

---

# Confidence

إذا Confidence:

```text
80 - 100
```

لون أخضر.

إذا:

```text
70 - 79
```

لون أصفر.

أقل من 70:

لا تعرض Verified.

---

# Low Confidence

إذا رجع Python:

```text
status = low_confidence
```

اعرض Card صفراء.

أيقونة:

⚠

العنوان:

**المعلومات غير كافية حتى الآن**

النص:

اعرض:

```ts
verification.warning
```

لا تعرض الإجابة على أنها حقيقة مؤكدة.

---

# تفاصيل المصادر

ضع Accordion:

**كيف تم التحقق؟**

عند الضغط:

اعرض IDs أو عدد المصادر فقط بطريقة مبسطة.

مثال:

```text
3 مساهمات حديثة تم تحليلها.

تم التحقق من حداثة المعلومات وموثوقية المساهمات.
```

لا تعرض أسماء حقيقية للطلاب.

---

# قسم "ماذا يحدث الآن؟"

تحت النتيجة:

# ماذا يحدث في الجامعة الآن؟

اعرض 3 أو 4 Cards فقط.

مثال:

### مبنى 11

كلية علوم وهندسة الحاسب

**3 تحديثات حديثة**

Badge:

**معلومات متاحة**

---

### الخدمات الطلابية

**2 تحديث حديث**

Badge:

**نشط**

---

لا تجعل هذا القسم أكبر من قسم السؤال.

السؤال يجب أن يبقى محور الصفحة.

---

# قسم المفقودات

أسفل الصفحة:

# المفقودات مؤخرًا

اعرض 3 Cards تجريبية فقط.

مثال:

### سماعات AirPods

مبنى 11

**مفقود**

---

### بطاقة جامعية

مبنى 17

**تم العثور عليها**

---

هذه Demo Data في React ويمكن أن تكون Static في النسخة الأولى.

---

# صفحة مساهماتي

Route:

```text
/volunteer
```

Header نفسه.

العنوان:

# مساهماتي

Subtitle:

**تابع مساهماتك في مساعدة مجتمع الجامعة.**

استدع:

```http
GET http://localhost:8000/api/volunteer/student-demo-01
```

اعرض 3 Cards:

### نقاط المجتمع

`points`

### مستوى الثقة

`trust_score`

### المساهمات الموثقة

`verified_contributions`

---

# التطوع

اعرض Card:

**الساعات التطوعية**

الحالة:

**قيد المراجعة**

ثم Notice:

**الساعات التطوعية الرسمية لا يعتمدها الذكاء الاصطناعي تلقائيًا، وإنما تحتاج مراجعة مسؤول بشري.**

---

# صفحة المسؤول

Route:

```text
/admin
```

العنوان:

# مراجعة المساهمات

استدع:

```http
GET http://localhost:8000/api/reviews
```

اعرض Reviews كـCards.

كل Card:

* Request ID
* Confidence
* Agent recommendation
* Status

الأزرار:

**اعتماد**

**رفض**

**طلب تعديل**

عند الاختيار:

```http
POST /api/reviews/{review_id}/decision
```

Body:

```json
{
  "reviewer_id": "admin-demo-01",
  "decision": "approved",
  "feedback": ""
}
```

اعرض Confirmation Toast بعد نجاح العملية.

---

# React Project Structure

استخدم:

```text
src/
├── components/
│   ├── Header.tsx
│   ├── AskCard.tsx
│   ├── CampusSelector.tsx
│   ├── QuickQuestions.tsx
│   ├── AgentLoading.tsx
│   ├── AnswerCard.tsx
│   ├── ConfidenceBar.tsx
│   ├── LocationCard.tsx
│   └── StatusBadge.tsx
│
├── pages/
│   ├── Home.tsx
│   ├── Volunteer.tsx
│   └── Admin.tsx
│
├── services/
│   └── campusNowApi.ts
│
├── types/
│   └── campusNow.ts
│
├── App.tsx
└── main.tsx
```

---

# API Service

أنشئ:

```text
src/services/campusNowApi.ts
```

استخدم:

```ts
const API_BASE =
  import.meta.env.VITE_API_URL ??
  "http://localhost:8000/api";
```

أنشئ الدوال:

```ts
getCampuses()
askCampusNow()
getVolunteerProfile()
getReviews()
submitReviewDecision()
```

لا تكتب fetch داخل كل Component.

---

# Backend Integration

React يعمل على:

```text
http://localhost:5173
```

Python FastAPI يعمل على:

```text
http://localhost:8000
```

الاتصال:

```text
React
   ↓ JSON
FastAPI
   ↓
Agent 1
Routing
   ↓
Agent 2
Verification
   ↓
Agent 3
Community & Volunteer
   ↓
JSON
   ↓
React Result Card
```

لا تضع:

* OpenAI API Key في React
* AI Agent logic في TypeScript
* Fake AI Answer داخل React

React مسؤول فقط عن:

* UI
* إرسال JSON
* استقبال JSON
* عرض النتيجة

Python مسؤول عن:

* Agents
* AI
* Verification
* Guardrails
* Confidence
* Human Review logic
