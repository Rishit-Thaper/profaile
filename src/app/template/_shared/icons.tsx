interface IconProps {
  size?: number;
  className?: string;
}

export function IconGithub({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 015.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.14c0 .31.21.68.8.56A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export function IconLinkedin({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

export function IconTwitter({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" />
    </svg>
  );
}

export function IconMail({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLink({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBehance({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8.65 11.45c.63-.42.94-1.01.94-1.88 0-1.76-1.4-2.32-3.06-2.32H0v10.5h6.6c1.84 0 3.56-.78 3.56-2.7 0-1.43-.88-2.18-1.51-2.6zm-5.4-2.44h2.05c.73 0 1.57.25 1.57 1.17 0 .9-.78 1.12-1.49 1.12H3.25V9.01zm2.35 6.23H3.25v-2.51h2.4c.89 0 1.71.22 1.71 1.3 0 1.12-.89 1.21-1.76 1.21zM22.4 8.54h-5.47V7.14h5.47v1.4zm-2.71 7.1c-1.18 0-2.17-.55-2.17-1.65h4.97c.12-2.18-1.34-3.59-3.46-3.59-2.18 0-3.72 1.63-3.72 3.72 0 2.15 1.48 3.63 3.71 3.63 1.89 0 3.01-.91 3.43-2.68h-1.8c-.18.5-.62.57-.96.57zm-.16-3.28c.98 0 1.45.5 1.49 1.48h-3.06c.08-.98.55-1.48 1.57-1.48zM14.5 7.14h5.99v1.4H14.5v-1.4z" />
    </svg>
  );
}

export function IconDribbble({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm7.85 5.4c1.24 1.83 1.97 4.03 1.97 6.42 0-.77-3.15-.58-6.07-.09-.19-.43-.36-.86-.54-1.28 2.9-1.2 4.48-3.2 4.64-5.05zM12 1.34c2.68 0 5.13 1.03 6.97 2.72-.13 1.66-1.6 3.48-4.24 4.5-1.36-2.5-2.91-4.6-4.23-6.15.5-.06 1-.1 1.5-.1zM7.13 3.05c1.38 1.63 2.95 3.76 4.32 6.28-3.38.9-7.14 1.03-8.54 1.03.68-3.2 2.25-5.85 4.22-7.31zM1.18 12.7h.02c0-.23-.01-.46-.01-.7 1.59 0 5.97-.13 9.83-1.25.25.5.49 1 .72 1.5-1.3.42-2.46 1.32-2.46 2.62 0 .21.03.43.08.63-4.45 1.5-7.5 1.38-8.18-1.3zM12 22.65c-1.94 0-3.76-.56-5.29-1.53.05-1.98 2.99-3.55 7.15-4.34 1.11 2.87 1.63 5.3 1.72 5.84-1.13.67-2.42 1.03-3.58 1.03zm5.36-2.01c-.08-.5-.57-2.86-1.59-5.65 2.7-.43 5.14-.4 6.02-.34-.59 2.66-2.12 4.9-4.43 5.99z" />
    </svg>
  );
}

export function IconFigma({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 0C5.8 0 4 1.8 4 4c0 1.2.6 2.3 1.5 3C4.6 7.7 4 8.8 4 10c0 1.2.6 2.3 1.5 3-.9.7-1.5 1.8-1.5 3 0 2.2 1.8 4 4 4s4-1.8 4-4v-4h4c2.2 0 4-1.8 4-4s-1.8-4-4-4H8zm0 2h4v4H8c-1.1 0-2-.9-2-2s.9-2 2-2zm6 0h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4V2zM8 8h4v4H8c-1.1 0-2-.9-2-2s.9-2 2-2zm4 8v-2h4c1.1 0 2 .9 2 2s-.9 2-2 2-4 0-4-2z" />
    </svg>
  );
}

export function IconMedium({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42zM24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

export function IconYoutube({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 00.5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 002.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 002.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
    </svg>
  );
}

export function IconArrowUpRight({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 17L17 7M7 7h10v10" />
    </svg>
  );
}
