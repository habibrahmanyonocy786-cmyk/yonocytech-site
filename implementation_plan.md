# Implementation Plan

[Overview]
ساخت یک سایت آنلاین به نام YonocyTech که بدون نیاز به API پولی/کلید Muapi کار می‌کند و تولید واقعی تصویر را فقط با موتور لوکال sd.cpp (در سمت کاربر یا در یک سرویس لوکال قابل اجرا) انجام می‌دهد.

این پروژه‌ی پایه‌ی شما در README نشان می‌دهد که بخش «Local Model Inference» دو موتور دارد (sd.cpp و Wan2GP). اما در پاسخ شما مشخص شد: 
- بدون API = فقط sd.cpp لوکال (گزینه A)
- هاست آنلاین = Vercel/Netlify (گزینه A)

پس در عمل، چون Vercel/Netlify اجازه اجرای sd.cpp داخل سرور ندارند، باید معماری را طوری بچینیم که sd.cpp در “کلاینت کاربر” اجرا شود (WebAssembly/worker) یا به شکل یک ابزار قابل اجرا کنار وب (مثلاً Progressive Web App یا دانلود یک کلاینت کوچک) ارائه شود. چون چارچوب پروژه‌ی موجود شما (Next.js/React) عمدتاً UI است و sd.cpp به‌صورت باینری در دسکتاپ اجرا می‌شود، بهترین راه عملی برای «بدون API و با تولید واقعی» این است:
1) یک فرانت‌اند وب ساده برای YonocyTech بسازیم (Next.js/React) که فقط UI/History/مدل‌کیو را مدیریت می‌کند.
2) تولید تصویر را از طریق یک “کلاینت لوکال” انجام دهیم که sd-cli را اجرا می‌کند (یا یک فایل باینری WebAssembly). چون گزینه‌ی صفرکُد برای WASM در مستندات موجود دیده نمی‌شود، پل عملی این است که وب یک پل Local HTTP یا پیام‌رسانی به یک helper محلی داشته باشد.
3) وب روی Vercel/Netlify بدون هیچ API خارجی deploy می‌شود و وقتی کاربر می‌خواهد تولید کند، یک درخواست به helper لوکال می‌فرستد (بدون Muapi).

[Types]  
تعریف مدل‌های UI و قرارداد پیام بین صفحه‌ی YonocyTech و helper لوکال (local sd.cpp runner) شامل حالت‌ها، پارامترها و خروجی تصویر.

- `YonocyModel`
  - `id: string` (شناسه مدل)
  - `name: string` (نام نمایش)
  - `type: 'sd15' | 'sdxl' | 'z-image'`
  - `endpointHint?: string` (برای محلی لازم نیست؛ فقط برای UI)
- `GenerateImageRequest`
  - `modelId: string`
  - `prompt: string`
  - `negativePrompt?: string`
  - `steps: number` (محدوده پیشنهادی 4..80)
  - `cfgScale: number` (محدوده پیشنهادی 1..20)
  - `seed: number` (اگر -1 باشد یعنی random)
  - `width: number`
  - `height: number`
  - `samplingMethod: string` (مثلاً `euler_a`)
  - `extra?: Record<string, any>`
- `GenerateImageResponse`
  - `requestId: string`
  - `status: 'queued' | 'running' | 'completed' | 'failed'`
  - `imageDataUrl?: string` یا `imageUrl?: string` (برای نمایش سریع)
  - `error?: string`
- `LocalHelperCapabilities`
  - `supported: { models: string[]; samplingMethods: string[]; }`
  - `engine: 'sd.cpp'`
  - `version: string`
- `LocalHelperAPI`
  - `POST /generate` با body نوع `GenerateImageRequest`
  - `GET /status?requestId=...` برای polling
  - `GET /capabilities`

[Files]
ایجاد یک فولدر جدید در `C:/Users/habib/Desktop/yonocytech-site` شامل Next.js فرانت‌اند YonocyTech و یک قرارداد/اسکلت برای Local Helper (برای اجرای sd.cpp)؛ بدون تغییر در مخزن اصلی.

- New files to create:
  - `C:/Users/habib/Desktop/yonocytech-site/README.md` (دستور نصب/اجرا)
  - `C:/Users/habib/Desktop/yonocytech-site/package.json`
  - `C:/Users/habib/Desktop/yonocytech-site/next.config.js`
  - `C:/Users/habib/Desktop/yonocytech-site/public/*` (آیکن‌ها)
  - `C:/Users/habib/Desktop/yonocytech-site/src/app/layout.tsx`
  - `C:/Users/habib/Desktop/yonocytech-site/src/app/page.tsx` (UI)
  - `C:/Users/habib/Desktop/yonocytech-site/src/components/PromptBox.tsx`
  - `C:/Users/habib/Desktop/yonocytech-site/src/components/ModelPicker.tsx`
  - `C:/Users/habib/Desktop/yonocytech-site/src/components/GeneratePanel.tsx`
  - `C:/Users/habib/Desktop/yonocytech-site/src/components/HistoryPanel.tsx`
  - `C:/Users/habib/Desktop/yonocytech-site/src/lib/localHelperClient.ts` (کال به لوکال helper)
  - `C:/Users/habib/Desktop/yonocytech-site/src/lib/storage.ts` (history در localStorage)
  - `C:/Users/habib/Desktop/yonocytech-site/src/lib/models.ts` (کاتالوگ مدل‌های sd.cpp که می‌خواهیم)
  - `C:/Users/habib/Desktop/yonocytech-site/implementation_plan.md` (این فایل)
- Existing files to modify:
  - هیچ‌کدام (فقط افزودن در فولدر جدید)
- Configuration updates:
  - در `next.config.js` برای Vercel سازگار می‌کنیم؛ و هیچ proxy به Muapi نمی‌زنیم.

- Local Helper (اختیاری ولی ضروری برای تولید واقعی): چون sd.cpp در پروژه اصلی در Electron/LocalInference با باینری کار می‌کند، یک helper کوچک Node/Electron-bridge هم لازم است.
  - New files to create:
    - `C:/Users/habib/Desktop/yonocytech-site/local-helper/server.js` (HTTP server که sd-cli را اجرا می‌کند)
    - `C:/Users/habib/Desktop/yonocytech-site/local-helper/README.md` (راه‌اندازی)

[Functions]
تغییر/افزودن توابع برای ارتباط فرانت‌اند با helper لوکال و مدیریت تاریخچه.

- New functions:
  - `createLocalHelperClient()` in `src/lib/localHelperClient.ts`
    - `getCapabilities()`
    - `generateImage(req: GenerateImageRequest)` -> returns `requestId`
    - `pollStatus(requestId)` -> returns `GenerateImageResponse`
  - `loadHistory()` / `saveHistory()` in `src/lib/storage.ts`
- Modified functions:
  - هیچ؛ چون کد موجود را copy مستقیم نمی‌کنیم، فقط فرانت‌اند جدید می‌نویسیم.
- Removed functions:
  - none

[Classes]
کلاس‌های دامنه‌ای فقط در سطح TS types/utility؛ UI به شکل functional components.

- New components (React FC):
  - `PromptBox` (state textarea + validation)
  - `ModelPicker` (renders sd model list)
  - `GeneratePanel` (handles submit + progress)
  - `HistoryPanel` (shows thumbnails)
- No classes needed.

[Dependencies]
افزودن dependencyهای Next.js برای UI و یک dependency سبک برای helper لوکال.

- Frontend:
  - `next`, `react`, `react-dom`, `tailwindcss` (در صورت نیاز)
- Local helper:
  - `express` یا `fastify` برای HTTP endpoints
  - `execa` برای اجرای `sd-cli`

[Testing]
تست واحد برای client لوکال helper (mock HTTP) و تست یکپارچه برای تولید (در سیستم خود کاربر) با چند مدل کوچک.

- `src/lib/localHelperClient.test.ts` (mock fetch)
- `local-helper` smoke test:
  - اجرای یک نمونه درخواست با prompt کوتاه و steps کم.

[Implementation Order]
1) ساخت اسکلت پروژه‌ی YonocyTech در فولدر جدید و پیاده‌سازی UI/History.
2) ساخت `local-helper` با endpoints و اجرای `sd-cli`.
3) اتصال `localHelperClient` به helper و افزودن polling تا خروجی تصویر.
4) آماده‌سازی deploy روی Vercel (فقط فرانت‌اند) و نوشتن راهنمای نصب/اجرا برای helper.

