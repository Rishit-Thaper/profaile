# Contributing to Profaile

Thank you for your interest in contributing to Profaile! We welcome community contributions, especially when it comes to adding new, beautiful portfolio themes for users to choose from.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate to all contributors.

## How Can I Contribute?

### 1. Reporting Bugs
If you find a bug, please open an issue in the repository. Include as much detail as possible:
- Steps to reproduce the bug
- Expected behavior vs. actual behavior
- Browser and OS information

### 2. Suggesting Enhancements
If you have an idea for a new feature or improvement, feel free to open an issue to discuss it. We are always looking for ways to make Profaile better!

### 3. Creating New Themes (Most Wanted!)
We want to give users a diverse set of stunning templates to choose from. If you have an eye for design and know React/Tailwind, this is the perfect way to contribute.

Please read our detailed [Theme Creation Guide](./docs/CREATING-THEMES.md) for step-by-step instructions on how to build and integrate a new theme into the application.

## Development Setup

1. **Fork & Clone**
   Fork the repository and clone it to your local machine.
   ```bash
   git clone https://github.com/YOUR_USERNAME/profaile.git
   cd profaile
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file based on the `.env.example` file (if available) or reach out to the maintainers for the required API keys (e.g., Supabase, Gemini).

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Pull Request Process

1. Create a new branch for your feature or fix: `git checkout -b feature/your-feature-name` or `git checkout -b theme/your-theme-name`.
2. Make your changes and test them thoroughly.
3. Commit your changes with clear and descriptive commit messages.
4. Push your branch to your fork: `git push origin your-branch-name`.
5. Open a Pull Request against the `main` branch of this repository. Include screenshots if you are adding or modifying a theme!

We will review your PR as soon as possible. Thank you for making Profaile better!
