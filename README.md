# Profaile 🚀

**Resume to Portfolio in Seconds, Powered by AI.**

Profaile is an open-source web application that allows developers and professionals to upload their PDF or DOCX resumes and instantly generate a stunning, fully-responsive portfolio website. Our AI extracts your experience, skills, and projects, formatting them perfectly into a theme of your choice.

## ✨ Features

- **AI-Powered Parsing:** Upload your resume and let Gemini automatically extract your experience, projects, education, and calculate impressive core stats.
- **Seven Premium Themes:** Choose from Minimal, Modern, Professional, Neon, Elegant, Vibrant, or Terminal aesthetics.
- **AI Portfolio Assistant (RAG):** Every published portfolio automatically gets an AI chat widget. Visitors can ask questions about the owner's experience, projects, and skills — answers are grounded in the portfolio's own data using retrieval-augmented generation, with cited sources.
- **Instant Preview & Editing:** Review the parsed data and tweak any fields in a seamless editor interface.
- **Custom URLs:** Claim a unique username (e.g., `profaile.app/p/your-name`) to share with recruiters.
- **Lightning Fast:** Built with Next.js App Router and TanStack React Query for snappy performance and instant updates.

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS Modules
- **State Management:** [TanStack React Query](https://tanstack.com/query)
- **Database & Auth:** [Supabase](https://supabase.com/)
- **AI Integration:** Google Gemini 2.5 Flash

## 🚀 Getting Started

To run Profaile locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/profaile.git
cd profaile
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root of your project and add the following keys. You will need a Supabase project and a Google Gemini API key.

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# Gemini AI Configuration
NEXT_GEMINI_API_KEY=your_gemini_api_key

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

## 🤝 Contributing

We love contributions! Profaile is designed to be highly extensible, especially when it comes to portfolio themes.

- Want to contribute code or report a bug? Please read our [Contributing Guidelines](CONTRIBUTING.md).
- **Want to design a new theme?** Check out our detailed [Theme Creation Guide](docs/CREATING-THEMES.md) to learn how to build and integrate your own beautiful template into Profaile!

## 📜 License

This project is licensed under the MIT License.