# Acadize Mobile App (React Native / Expo)

The official cross-platform mobile application for **Acadize** (https://acadize.com), matching the original web portal's features, visual styling, and backend services.

---

## 📱 Features

1. **Authentication & Session Persistence:**
   - Sign in with email or username + password (matches `login.tsx`).
   - New user registration with role selector (**Student**, **Teacher**, **Parent**).
   - Session restoration with JWT Bearer tokens and `x-tenant-subdomain: default`.

2. **Student Dashboard & Gamification:**
   - **Study Streak (Flame)** and **XP Progress / Level Badge** matching `student-dashboard.tsx`.
   - **Active Live Session card** for upcoming Zoom/physical lectures with start time and instructor details.
   - **Enrolled Courses with Progress Bars** (0-100% completion).
   - **Recent Announcements** from school/teachers.

3. **Join Course with Code:**
   - Dedicated **Join with Code** screen matching `student-join-course.tsx`.
   - Enter a 6-character code (e.g. `MATH01`) to preview syllabus and instructor, then enroll with one tap.

4. **AI Study Buddy (Versa):**
   - Full interactive chat interface matching `ai-study-buddy.tsx`.
   - Students can ask questions about homework, math problems, science concepts, and exam prep 24/7.
   - Connects to `/api/ai-chat/message`.

5. **Course Catalog & Lesson Viewer:**
   - Browse published courses from `https://acadize.com/api/courses`.
   - Search by course title, topic, or instructor.
   - Category filtering (Mathematics, Computer Science, Science, Languages).
   - Syllabus breakdown with lesson durations, materials download, and completion checkboxes.

6. **Paymob Unified Checkout Flow:**
   - Matches `activate.tsx` on the website:
     - **Annual Plan**: 768 EGP / year (save 20%).
     - **Monthly Plan**: 80 EGP / month.
   - Promo code validation calling `/api/subscription/validate-promo`.
   - Free trial activation calling `/api/subscription/activate-trial`.
   - In-app **Paymob WebView** loading the checkout portal (Cards, Mobile Wallets, Valu).
   - Automatic redirection interception to `checkout-success`.

7. **Configurable Server Settings:**
   - Switch in real-time between production (`https://acadize.com/api`), local Wi-Fi IP, and Android emulator (`10.0.2.2`).

---

## 🚀 How to Run the App

```powershell
cd D:\Acadize-app\mobile

# 1. Install dependencies
npm install

# 2. Start Expo
npx expo start
```

* **To test on a physical phone:** Install **Expo Go** (from Play Store or App Store) and scan the terminal QR code.
* **To test on Android Emulator:** Press `a` in the terminal.
* **To preview in browser:** Press `w` in the terminal.
