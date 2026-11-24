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

## Production database migrations

The [Supabase migration workflow](.github/workflows/supabase-migrations.yml) runs after Vercel reports a successful **production** deployment of `main` to `profaile.app`. It checks out that exact deployed commit, previews pending migrations, and applies them to the linked Supabase project. Preview deployments and failed production deployments do not run migrations.

Add these encrypted secrets to the GitHub repository's `production` environment (or as repository secrets):

- `SUPABASE_ACCESS_TOKEN` — a Supabase personal access token scoped to the production project with **Read** access to Project Settings, API Keys, API Key Secrets, and Connection Pooling. The last permission lets the CLI obtain the IPv4 pooler URL used by GitHub Actions runners. Token permissions cannot be changed after creation; create a replacement token and update this GitHub secret if Connection Pooling was omitted.
- `SUPABASE_DB_PASSWORD` — the production project's database password.
- `SUPABASE_PROJECT_ID` — the production Supabase project reference.

Keep Vercel's GitHub `repository_dispatch` deployment events enabled. The workflow never caches private drafts or runs database changes during pull request builds.

**One-time setup for this existing database:** migrations 001–005 were run through the Supabase SQL Editor, which does not add rows to `supabase_migrations.schema_migrations`. Confirm all five changes are present in production, then run the [Record existing Supabase migrations](.github/workflows/supabase-baseline.yml) action once and enter its requested confirmation text. This action records their new CLI versions `20261124000101` through `20261124000105`; it does not execute their SQL. The automatic workflow stops if these historical migrations still appear pending. After the one-time setup, it applies future migrations automatically. If the first deployment's migration job stopped before the baseline was recorded, redeploy the same commit to trigger it again; migration `20261124000106` will then run after the compatible app is live.

Use `supabase migration new <name>` for future migrations so filenames have the CLI's timestamp format. Do not apply new production schema changes through the SQL Editor, because that bypasses migration history.

## 🤝 Contributing

We love contributions! Profaile is designed to be highly extensible, especially when it comes to portfolio themes.

- Want to contribute code or report a bug? Please read our [Contributing Guidelines](CONTRIBUTING.md).
- **Want to design a new theme?** Check out our detailed [Theme Creation Guide](docs/CREATING-THEMES.md) to learn how to build and integrate your own beautiful template into Profaile!

## 📜 License

This project is licensed under the MIT License.
