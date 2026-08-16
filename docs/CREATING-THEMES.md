# Creating a New Theme for Profaile

Themes are the core visual identity of Profaile. We want to offer users a wide variety of beautiful, responsive, and unique portfolios.

This guide will walk you through how themes are currently implemented and how you can add your own.

## Theme Architecture

All themes live in the `src/app/template/` directory. Each theme is its own isolated route folder, containing a `page.tsx` and a `components/` folder for its specific UI elements.

A typical theme structure looks like this:

```
src/app/template/
└── your-theme-name/
    ├── page.tsx               # The root layout/orchestrator for your theme
    └── components/
        ├── Navbar.tsx
        ├── Hero.tsx
        ├── Experience.tsx
        ├── Projects.tsx
        ├── Skills.tsx
        └── Footer.tsx
```

### Data Injection

Your theme's components do not need to worry about fetching data from the database. The data is passed down securely. During development and inside your `page.tsx`, you will typically receive or import `PortfolioData` (defined in `src/app/types.ts`).

The `PortfolioData` object contains:
- `personal_info` (name, title, email, links, etc.)
- `experience` (array of work history)
- `projects` (array of portfolio projects)
- `education`
- `skills`
- `stats` & `core_stack` (AI generated metrics and technologies)

## Step-by-Step Guide to Adding a Theme

### Step 1: Create the Theme Directory
Create a new folder in `src/app/template/` with the name of your theme (use kebab-case, e.g., `cyberpunk-neon`).

### Step 2: Build Your Components
Inside your new theme folder, create a `components/` directory. Start building your UI!
- **Styling:** We highly encourage using **Tailwind CSS**. If you need custom CSS variables or specific fonts, you can inject them via a `<style>` tag in your `page.tsx` or create a specific CSS module.
- **Responsiveness:** Ensure your components look great on both mobile (using `flex-col`, wrapping, and appropriate padding) and desktop screens.
- **Animation:** Feel free to use Framer Motion or pure CSS animations to make the theme feel alive and premium.

### Step 3: Orchestrate in `page.tsx`
Create `src/app/template/your-theme-name/page.tsx`. This file should act as the root of your theme.

```tsx
"use client";

import { data } from "@/libs/constants"; // Use dummy data during development
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
// ... import other components

export default function YourThemeNamePortfolio() {
  return (
    <>
      {/* Inject custom fonts or global CSS variables here if needed */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');
        body { font-family: 'Your Font', sans-serif; background: #...; color: #...; }
      `}</style>
      
      <Navbar data={data} />
      <Hero data={data.personal_info} stats={data.stats} core_stack={data.core_stack} />
      {/* ... render the rest of your components */}
    </>
  );
}
```
*Note: In the final dynamic route (`/p/[username]/page.tsx`), your theme components will be dynamically imported and passed real user data.*

### Step 4: Register Your Theme
Once your theme looks amazing locally, you need to make it selectable in the dashboard and in the renderer. There are three places to register it:

**a) `src/app/components/ThemePicker.tsx`** — Locate the `themes` array at the top of the file and add your new theme:

```typescript
const themes = [
  // ... existing themes
  {
    id: "your-theme-name", // Must match your folder name exactly!
    name: "Your Theme Display Name",
    description: "A short, catchy description of your theme's vibe.",
    colors: ["#BgColor", "#AccentColor", "#TextColor"],
    preview: {
      bg: "#BgColor",
      accent: "#AccentColor",
      text: "#TextColor",
      card: "#CardBgColor",
    },
  },
];
```
*The `preview` object powers the mini-mockup generated in the Theme Picker UI.*

**b) `src/themes/index.ts`** — Import your theme wrapper and add it to the `THEMES` record so the portfolio renderer can use it:

```typescript
import YourTheme from "./YourTheme";

const THEMES: Record<string, ThemeComponent> = {
  // ... existing themes
  "your-theme-name": YourTheme,
};
```

**c) `src/libs/theme-registry.ts`** — Add your theme id to the `THEME_IDS` array. This powers server-side validation on `/api/profile` so unknown theme names are rejected:

```typescript
export const THEME_IDS = [/* ...existing ids */, "your-theme-name"] as const;
```

> If your theme has a distinctive accent color, also add it to the `CHAT_ACCENTS` map in `src/app/p/[username]/PortfolioRenderer.tsx` so the AI chat widget matches your theme.

### Step 5: Database Constraint
The `profiles.selected_theme` column has a `CHECK` constraint listing every valid theme. If you add a new theme you must update it in the Supabase SQL editor:

```sql
ALTER TABLE public.profiles
  DROP CONSTRAINT profiles_selected_theme_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_selected_theme_check
  CHECK (selected_theme IN ('minimal', 'modern', 'professional', 'neon', 'elegant', 'vibrant', 'terminal', 'your-theme-name'));
```

### Step 6: Test and Submit!
1. Go to your local dashboard (`http://localhost:3000/edit` or the theme selection step).
2. Select your new theme and verify that the preview works and that publishing applies the theme properly.
3. Take a screenshot or record a short GIF of your theme.
4. Open a Pull Request! Include your screenshots in the PR description so everyone can admire your work.

## Design Guidelines
- **Make it Premium:** Avoid generic layouts. Use harmonious color palettes, modern typography, and adequate whitespace.
- **Micro-interactions:** Add hover effects to buttons and links. It makes the portfolio feel responsive and polished.
- **Accessibility:** Ensure there is sufficient contrast between background and text colors. 

We can't wait to see what you build!
