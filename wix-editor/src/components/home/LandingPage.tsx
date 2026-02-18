'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './LandingPage.module.css';

export default function LandingPage() {
    const router = useRouter();

    const handleGetStarted = () => {
        router.push('/dashboard');
    };

    return (
        <div className={styles.landingContainer}>
            <header style={{ position: 'absolute', top: 0, width: '100%', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1.5rem' }}>SiteApe</div>
                <button
                    onClick={handleGetStarted}
                    style={{ background: 'transparent', border: '1px solid #333', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '30px', cursor: 'pointer' }}
                >
                    Login
                </button>
            </header>

            <section className={styles.heroSection}>
                <h1 className={styles.heroTitle}>Create without limits.</h1>
                <p className={styles.heroSubtitle}>
                    The platform that gives you the freedom to create, design, manage and develop your web presence exactly the way you want.
                </p>
                <button className={styles.ctaButton} onClick={handleGetStarted}>
                    Get Started
                </button>
            </section>

            <section className={styles.featuresSection}>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <h3 className={styles.featureTitle}>Absolute Design Freedom</h3>
                        <p className={styles.featureDescription}>
                            Design your website exactly how you want with our drag-and-drop editor. No coding required.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <h3 className={styles.featureTitle}>Advanced Web Features</h3>
                        <p className={styles.featureDescription}>
                            Built on Next.js for blazing fast performance and SEO out of the box.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <h3 className={styles.featureTitle}>Professional Templates</h3>
                        <p className={styles.featureDescription}>
                            Start with a blank canvas or choose from over 500 designer-made templates.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
