# HireIQ – AI Interview Coach

**HireIQ** is an AI-powered mock interview application designed to help users practice job interviews in various roles (Software Engineer, Product Manager, etc.). Built using Vite, TypeScript, Supabase, and free/local AI tooling, this app provides question prompts, feedback, and voice input support.

---

## 🚀 Features

- 🔐 Email authentication with Supabase
- 💬 Role-based interview question sets
- 🧠 Smart feedback on responses using local AI (Transformers.js or scoring logic)
- 🎤 Optional voice-to-text with browser-native Web Speech API
- 📝 Session history stored per user
- ⚡ Built using open-source tools, all free-tier compatible

---

## ⚙️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend Services**: Supabase (Auth, Database, Migrations)
- **AI**: Local Transformers.js / scoring logic (no paid APIs)
- **Language**: TypeScript

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/kgsgunpro/projects-using-no-code-ai-tools-.git
cd projects-using-no-code-ai-tools-/HIREIQ
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Your Supabase Project

- Go to [https://supabase.com](https://supabase.com)
- Create a new project
- Enable **email authentication**
- Set up a table for session history (optional)

### 4. Set Up Environment Variables

Create a `.env` file in the `HIREIQ` folder based on the `.env.example`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 5. Run the App

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Folder Structure (Simplified)

```
HIREIQ/
├── index.html
├── package.json
├── .env.example
├── src/
│   ├── App.tsx
│   ├── components/
│   └── lib/
├── supabase/
│   └── migrations/
└── vite.config.ts
```

---

## 📜 License

**This project is not open-source. All rights reserved © 2025 Kiran G.**

You may view and learn from this code for **educational or personal purposes only.**  
**You are not permitted** to use, modify, redistribute, or republish any part of this project without **written permission** from the author.

For inquiries or permission requests, contact: [your-email@example.com]

---

## 🙋‍♂️ Author

**Kiran G**  
[GitHub](https://github.com/kgsgunpro)
