import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiBookOpen,
  FiCheck,
  FiEdit3,
  FiFileText,
  FiGithub,
  FiLayers,
  FiMessageCircle,
  FiMoon,
  FiShare2,
  FiSun,
  FiUser,
} from "react-icons/fi";
import { routes } from "@/config/routes";
import styles from "./landing.module.css";

export const metadata: Metadata = {
  title: "Profaile — Make your work feel like you",
  description:
    "Turn your resume into a personal portfolio, create a shareable card, and publish when you are ready. Built with Profaile.",
};

const repository = "https://github.com/Rishit-Thaper/profaile";
const contributing = `${repository}/blob/main/CONTRIBUTING.md`;

const steps = [
  {
    number: "01",
    icon: FiFileText,
    title: "Bring your story",
    description:
      "Upload a resume or start with a blank page. Profaile turns the details into a draft you can shape.",
  },
  {
    number: "02",
    icon: FiEdit3,
    title: "Make it your own",
    description:
      "Edit the words, choose a theme, and find a headline that sounds like you.",
  },
  {
    number: "03",
    icon: FiShare2,
    title: "Share when ready",
    description:
      "Preview privately, then publish your portfolio and share its matching card and QR code.",
  },
];

const features = [
  {
    icon: FiLayers,
    title: "Seven ways to show up",
    description:
      "Move between seven portfolio themes and fine-tune the look with light and dark appearances.",
  },
  {
    icon: FiMessageCircle,
    title: "A portfolio that can answer back",
    description:
      "Give visitors an AI assistant that helps them explore the work and experience on your page.",
  },
  {
    icon: FiEdit3,
    title: "Draft first. Go live later.",
    description:
      "Keep changes private, review versions, and decide exactly when your latest work is public.",
  },
];

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link href={routes.home} className={styles.brand} aria-label="Profaile home">
      <span className={styles.brandMark}>
        <Image src="/20260816_152547.jpg" alt="" width={28} height={28} priority={!footer} />
      </span>
      <span>profaile</span>
    </Link>
  );
}

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Brand />
          <nav className={styles.nav} aria-label="Main navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
            <a href="#blogs">Blogs <span className={styles.navSoon}>soon</span></a>
          </nav>
          <div className={styles.headerActions}>
            <a className={styles.headerContribute} href={contributing} target="_blank" rel="noopener noreferrer">
              Contribute <FiArrowUpRight aria-hidden />
            </a>
            <Link className={styles.headerCta} href={routes.dashboard}>
              Get started <FiArrowRight aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroGlow} aria-hidden />
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}><span className={styles.eyebrowDot} /> Your story, beyond the resume</span>
              <h1 id="hero-title">Make your work <em>feel like you.</em></h1>
              <p>
                Build a portfolio with personality. Start from your resume, make every detail yours,
                and share it with a card made for your next introduction.
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryButton} href={routes.dashboard}>Create your portfolio <FiArrowRight aria-hidden /></Link>
                <a className={styles.textButton} href="#how-it-works">See how it works <FiArrowUpRight aria-hidden /></a>
              </div>
              <div className={styles.heroNote}><FiCheck aria-hidden /> A private draft until you choose to publish</div>
            </div>

            <div className={styles.heroVisual} aria-label="Example of a Profaile share card">
              <div className={styles.visualOrbit} aria-hidden />
              <div className={styles.visualLabel}><span /> YOUR DIGITAL INTRODUCTION</div>
              <div className={styles.sampleCard}>
                <div className={styles.sampleTop}><span className={styles.sampleMonogram}>p.</span><span>THE PERSONAL PORTFOLIO CARD <FiArrowUpRight aria-hidden /></span></div>
                <div className={styles.sampleAvatar}><FiUser aria-hidden /></div>
                <div className={styles.sampleName}>Alex Morgan</div>
                <div className={styles.sampleHeadline}>Making the complex feel human.</div>
                <div className={styles.sampleRule} />
                <div className={styles.sampleBottom}><span>DESIGNER &amp; BUILDER</span><span>profaile / alex</span></div>
              </div>
              <div className={styles.visualTag}><FiShare2 aria-hidden /> Shareable card</div>
              <div className={styles.visualTagSecondary}><FiMoon aria-hidden /> Your theme, your way</div>
            </div>
          </div>
        </section>

        <section className={styles.workflow} id="how-it-works" aria-labelledby="workflow-title">
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>01 / THE JOURNEY</span>
            <h2 id="workflow-title">From a document to a destination.</h2>
            <p>A simple path from what you have done to how you want to be seen.</p>
          </div>
          <div className={styles.stepGrid}>
            {steps.map(({ number, icon: Icon, title, description }) => (
              <article className={styles.stepCard} key={number}>
                <div className={styles.stepTop}><span className={styles.stepIcon}><Icon aria-hidden /></span><span className={styles.stepNumber}>{number}</span></div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.features} id="features" aria-labelledby="features-title">
          <div className={styles.featuresInner}>
            <div className={styles.featuresCopy}>
              <span className={styles.sectionKicker}>02 / MADE FOR THE WHOLE YOU</span>
              <h2 id="features-title">More than a page with your name on it.</h2>
              <p className={styles.featuresLead}>Your portfolio should grow with your work and still sound like you.</p>
              <div className={styles.featureList}>
                {features.map(({ icon: Icon, title, description }) => (
                  <div className={styles.featureItem} key={title}>
                    <span className={styles.featureIcon}><Icon aria-hidden /></span>
                    <div><h3>{title}</h3><p>{description}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.featurePreview} aria-label="Preview of portfolio theme options">
              <div className={styles.previewChrome}><span className={styles.chromeDots}><i /><i /><i /></span><span>YOUR PORTFOLIO</span><FiArrowUpRight aria-hidden /></div>
              <div className={styles.previewContent}>
                <span className={styles.previewGreeting}>HELLO, I&apos;M ALEX.</span>
                <strong>Thoughtful work.<br /><span>Real impact.</span></strong>
                <p>I bring clarity to ambitious ideas and build experiences that last.</p>
                <span className={styles.previewLink}>Explore my work <FiArrowUpRight aria-hidden /></span>
              </div>
              <div className={styles.previewToolbar}><span><FiLayers aria-hidden /> Seven themes</span><span><FiSun aria-hidden /> Light</span><span><FiMoon aria-hidden /> Dark</span></div>
            </div>
          </div>
        </section>

        <section className={styles.blogs} id="blogs" aria-labelledby="blogs-title">
          <div className={styles.blogsInner}>
            <div className={styles.blogsCopy}>
              <span className={styles.sectionKicker}>03 / COMING NEXT</span>
              <h2 id="blogs-title">The thinking behind the work deserves a place, too.</h2>
              <p>
                A blog feed is on the way. Write freely in Markdown, pin two favorite posts to your
                portfolio, and give readers a path to the rest of your stories.
              </p>
              <span className={styles.comingBadge}><FiBookOpen aria-hidden /> Blogs are coming soon</span>
            </div>
            <div className={styles.blogPreview} aria-label="Concept preview of upcoming blog posts">
              <div className={styles.blogPreviewHeader}><span>FROM THE JOURNAL</span><span>CONCEPT PREVIEW</span></div>
              <div className={styles.blogPost}><span className={styles.blogPostIndex}>01</span><div><small>PINNED STORY</small><h3>What building for people taught me about simplicity</h3><p>Notes on craft, curiosity, and the details that matter.</p></div><FiArrowUpRight aria-hidden /></div>
              <div className={styles.blogPost}><span className={styles.blogPostIndex}>02</span><div><small>PINNED STORY</small><h3>Finding the thread between design and code</h3><p>A look at the choices behind the finished work.</p></div><FiArrowUpRight aria-hidden /></div>
              <div className={styles.blogMore}>More stories, all in one feed <FiArrowRight aria-hidden /></div>
            </div>
          </div>
          <div className={styles.contributeStrip}>
            <div><span className={styles.sectionKicker}>OPEN SOURCE, OPEN TO IDEAS</span><h3>Help shape what comes next.</h3><p>Contribute a theme, improve the app, or suggest a feature.</p></div>
            <a className={styles.contributeButton} href={contributing} target="_blank" rel="noopener noreferrer"><FiGithub aria-hidden /> Contribute on GitHub <FiArrowUpRight aria-hidden /></a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div><Brand footer /><p>A better way to share the person behind the work.</p></div>
          <div className={styles.footerLinks}><a href="#how-it-works">How it works</a><a href="#features">Features</a><a href="#blogs">Blogs</a><a href={contributing} target="_blank" rel="noopener noreferrer">Contribute</a><a href={repository} target="_blank" rel="noopener noreferrer">GitHub <FiArrowUpRight aria-hidden /></a></div>
        </div>
        <div className={styles.footerBottom}><span>© {new Date().getFullYear()} Profaile</span><span>Made for stories worth sharing.</span></div>
      </footer>
    </div>
  );
}
