# Interview Practice Portal

A complete, professional, and responsive "Interview Practice Portal" for job seekers. Build using **Next.js 15**, **Supabase**, and **shadcn/ui**.

## 🚀 Features

- **Secure Authentication**: Built with Supabase Auth (Signup/Login) and middleware-protected dashboard routes.
- **Resume Parsing UI**: Automated skill extraction and role suggestion based on uploaded resumes.
- **Realistic Proctoring Engine**: Enforces fullscreen mode, hardware checks (Camera/Mic), and tracks tab-switching violations.
- **Interactive Mock Rounds**:
  - **Aptitude & Technical MCQ**: Timed quiz with a modern navigation palette.
  - **Proctored Coding IDE**: Powered by Monaco Editor and Piston API (supports Python, JS, Java, C++).
  - **Communication Round**: Live Speech-to-Text recording for behavioral practice.
  - **AI HR Interview**: Dynamic chat simulation for mock interviews.
- **Performance Analytics**: Detailed reports with visual charts (Recharts) to track strengths and readiness.
- **Modern UI**: Full glass-morphic design, responsive layouts, and dark mode support.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui & Lucide React
- **Backend**: Supabase (Auth, Database, SSR)
- **Editor**: Monaco Editor (@monaco-editor/react)
- **Charts**: Recharts

## ⚙️ Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SelvavikashP/Interview_Practice_Portal.git
   cd Interview_Practice_Portal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📄 License

MIT
