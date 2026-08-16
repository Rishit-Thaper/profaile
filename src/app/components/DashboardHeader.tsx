"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/libs/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import styles from "./DashboardHeader.module.css";

export default function DashboardHeader({
  email,
  isPublished,
  username,
}: {
  email: string;
  isPublished: boolean;
  username: string | null;
}) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  const initials = email
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/edit", label: "Edit Profile" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <button
            className={styles.logo}
            onClick={() => router.push("/")}
            aria-label="Profaile home"
          >
            <span className={styles.logoMark} aria-hidden>
              <Image
                src="/20260816_152547.jpg"
                alt="Profaile logo"
                width={30}
                height={30}
                className={styles.logoImg}
                priority
              />
            </span>
            <span className={styles.logoText}>profaile</span>
          </button>

          <nav className={styles.nav} aria-label="Primary">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <button
                  key={item.href}
                  className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                  onClick={() => router.push(item.href)}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className={styles.right}>
          {isPublished && username && (
            <a
              href={`/p/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.liveLink}
            >
              <span className={styles.liveDot} />
              View site
            </a>
          )}

          {/* Avatar + Dropdown */}
          <div className={styles.avatarWrapper} ref={menuRef}>
            <button
              className={styles.avatar}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="User menu"
            >
              {initials}
            </button>

            {menuOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownAvatar}>{initials}</span>
                  <span className={styles.dropdownEmail}>{email}</span>
                </div>
                <div className={styles.dropdownDivider} />
                <button
                  className={styles.dropdownItem}
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/");
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2.5 6.5 8 2l5.5 4.5V13a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V6.5Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Dashboard
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/edit");
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path
                      d="M10.586 1.586a2 2 0 0 1 2.828 2.828l-7.5 7.5L2 13l1.086-3.914 7.5-7.5Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Edit Profile
                </button>
                <div className={styles.dropdownDivider} />
                <button
                  className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
                  onClick={handleLogout}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path
                      d="M5.5 13.5h-3a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1h3M10 10.5l3-3-3-3M13 7.5H5.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
