'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaLayerGroup, FaChevronRight, FaStar } from 'react-icons/fa6';
import styles from './Home.module.css';

export default function Home() {
  const router = useRouter();
  const [idea, setIdea] = useState('');

  const handleGenerate = () => {
    const params = new URLSearchParams();
    if (idea) params.set('idea', idea);
    router.push(`/onboarding?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <a href="#" className={styles.brandWrapper}>
          <FaLayerGroup className={styles.brandIcon} />
          <span className={styles.brandLogo}>SiteApe</span>
        </a>

        <div className={styles.navRight}>
          <Link href="/dashboard" className={styles.btnLogin}>Log in</Link>
          <Link href="/dashboard" className={styles.btnNavPrimary}>Start for free</Link>
        </div>
      </nav>

      <main className={styles.heroContainer}>
        <h1 className={styles.title}>Stop monkeying around <br />with your website.</h1>

        <p className={styles.heroSub}>
          SiteApe creates your site, marketing, and operations in 30 seconds.
          Evolve your business today with the power of AI.
        </p>

        <div className={styles.inputCard}>
          <textarea
            className={styles.inputArea}
            placeholder="What type of business are you building?"
            autoFocus
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          ></textarea>

          <button className={styles.btnStart} onClick={handleGenerate}>
            Generate <FaChevronRight size={10} />
          </button>
        </div>

        <div className={styles.trustRow}>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.starBox}><FaStar /></div>
            ))}
          </div>
          <span>4.9 Stars on Trustpilot</span>
          <span className={styles.trustDivider}>•</span>
          <span className={styles.trustTextSecondary}>Trusted by 50,000+ founders</span>
        </div>
      </main>

      <footer className={styles.footer}>
        &copy; 2026 SiteApe Inc.
      </footer>
    </div>
  );
}
