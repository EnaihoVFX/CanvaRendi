'use client';

import React, { useState, Suspense, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaLayerGroup, FaCheck, FaHammer, FaWandMagicSparkles, FaGlobe, FaStar, FaRotate, FaCamera, FaPenNib } from 'react-icons/fa6';
import styles from './MediaSelection.module.css';

import AssetDetailModal from './AssetDetailModal';
import { themeConfigs } from '@/lib/themes';
import {
    isDemoMode, DEMO_MEDIA_ASSETS, DEMO_HEADLINE_ASSET,
    DEMO_TESTIMONIAL_ASSET, DEMO_LOGO_ASSET, DEMO_SITE_DATA, DEMO_BUSINESS_NAME
} from '@/data/demoData';

interface MediaAsset {
    id: string;
    type: 'image' | 'logo' | 'text';
    src?: string;
    content?: string;
    label: string;
    desc: string;
    source: string;
    bg?: string;
}

function MediaSelectionContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
    const [viewingAsset, setViewingAsset] = useState<MediaAsset | null>(null);
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [isBuilding, setIsBuilding] = useState(false);

    // Get params from onboarding
    const businessName = searchParams.get('name') || 'My Business';
    const industry = searchParams.get('industry') || 'Business';
    const vibe = searchParams.get('vibe') || 'Minimal';
    const pitch = searchParams.get('pitch') || '';
    const features = searchParams.get('features')?.split(',').filter(Boolean) || [];

    // Loading State
    const [isLoading, setIsLoading] = useState(true);
    const [loadingStep, setLoadingStep] = useState('Initializing...');
    const [progress, setProgress] = useState(0);
    const loadedRef = useRef(false);
    const isDemo = searchParams.get('demo') === 'true' || isDemoMode(businessName);

    // Real data loading
    React.useEffect(() => {
        if (loadedRef.current) return;
        loadedRef.current = true;

        const loadAssets = async () => {
            const allAssets: MediaAsset[] = [];

            // ── DEMO FLOW: Use pre-picked assets, zero API calls ──
            if (isDemo) {
                console.log('[DEMO] Using pre-picked assets — no API calls');
                setLoadingStep('Loading curated assets...');
                setProgress(50);

                // Small artificial delay to feel natural
                await new Promise(r => setTimeout(r, 600));

                DEMO_MEDIA_ASSETS.forEach(a => allAssets.push(a as any));
                allAssets.push(DEMO_HEADLINE_ASSET as any);
                allAssets.push(DEMO_TESTIMONIAL_ASSET as any);
                allAssets.push(DEMO_LOGO_ASSET as any);

                setProgress(100);
                setAssets(allAssets);
                setSelectedAssets(allAssets.map(a => a.id));
                setTimeout(() => setIsLoading(false), 300);
                return;
            }

            // ── Normal flow (unchanged) ──
            try {
                // Step 1: Search for media images
                setLoadingStep('Searching for relevant images...');
                setProgress(15);

                const mediaRes = await fetch('/api/media-search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ industry, vibe, count: 6 }),
                });

                if (mediaRes.ok) {
                    const mediaData = await mediaRes.json();
                    if (mediaData.assets) {
                        mediaData.assets.forEach((asset: any, idx: number) => {
                            allAssets.push({
                                id: `img-${idx}`,
                                type: 'image',
                                src: asset.url,
                                label: asset.label || 'Gallery',
                                desc: `${asset.source === 'Unsplash' ? 'Found on Unsplash' : 'Curated collection'} — by ${asset.photographer}`,
                                source: asset.source === 'Unsplash' ? 'Unsplash' : 'Web Source',
                            });
                        });
                    }
                }

                setProgress(40);

                // Step 2: Generate AI content — hero headline
                setLoadingStep('Generating brand copy with AI...');
                setProgress(50);

                const headlineRes = await fetch('/api/generate-content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ businessName, industry, pitch, contentType: 'hero-headline' }),
                });

                if (headlineRes.ok) {
                    const headlineData = await headlineRes.json();
                    allAssets.push({
                        id: 'ai-headline',
                        type: 'text',
                        content: headlineData.content,
                        label: 'Hero Headline',
                        desc: 'AI-generated headline for your hero section.',
                        source: 'AI Generated',
                        bg: '#f0fdf4',
                    });
                }

                setProgress(65);

                // Step 3: Generate AI content — testimonial
                setLoadingStep('Creating testimonial...');

                const testimonialRes = await fetch('/api/generate-content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ businessName, industry, pitch, contentType: 'testimonial' }),
                });

                if (testimonialRes.ok) {
                    const testimonialData = await testimonialRes.json();
                    const tContent = testimonialData.content;
                    const testimonialText = typeof tContent === 'string'
                        ? tContent
                        : `"${tContent.quote}" - ${tContent.author}`;

                    allAssets.push({
                        id: 'ai-testimonial',
                        type: 'text',
                        content: testimonialText,
                        label: 'Testimonials',
                        desc: 'AI-generated customer testimonial.',
                        source: 'AI Generated',
                        bg: '#fffbe6',
                    });
                }

                setProgress(80);

                // Step 4: Add brand logo asset
                setLoadingStep('Finalizing assets...');

                allAssets.push({
                    id: 'brand-logo',
                    type: 'logo',
                    content: businessName,
                    label: 'Brand Logo',
                    desc: 'Your business name as a brand mark.',
                    source: 'AI Generated',
                    bg: '#f4f4f5',
                });

                setProgress(100);

                // Set assets and auto-select all
                setAssets(allAssets);
                setSelectedAssets(allAssets.map(a => a.id));

                setTimeout(() => setIsLoading(false), 400);

            } catch (error) {
                console.error('Failed to load assets:', error);
                // Fallback: show something even if APIs fail
                allAssets.push({
                    id: 'brand-logo',
                    type: 'logo',
                    content: businessName,
                    label: 'Brand Logo',
                    desc: 'Your business name as a brand mark.',
                    source: 'AI Generated',
                    bg: '#f4f4f5',
                });

                setAssets(allAssets);
                setSelectedAssets(allAssets.map(a => a.id));
                setIsLoading(false);
            }
        };

        loadAssets();
    }, [businessName, industry, pitch, vibe]);

    if (isLoading) {
        return (
            <div className={styles.loadingOverlay}>
                <div className={styles.loadingSpinner}></div>
                <h2 className={styles.loadingText}>{loadingStep}</h2>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        );
    }

    const toggleAsset = (id: string) => {
        if (selectedAssets.includes(id)) {
            setSelectedAssets(selectedAssets.filter(aid => aid !== id));
        } else {
            setSelectedAssets([...selectedAssets, id]);
        }
    };

    const handleCardClick = (asset: MediaAsset) => {
        setViewingAsset(asset);
    };

    const handleKeepAsset = () => {
        if (viewingAsset && !selectedAssets.includes(viewingAsset.id)) {
            setSelectedAssets([...selectedAssets, viewingAsset.id]);
        }
        setViewingAsset(null);
    };

    const handleBuild = async () => {
        setIsBuilding(true);

        // ── DEMO FLOW: Use perfect hardcoded site — no AI generation ──
        if (isDemo) {
            console.log('[DEMO] Using pre-crafted site data — skipping AI generation');
            try {
                const siteData = JSON.parse(JSON.stringify(DEMO_SITE_DATA));
                const siteId = 'daisy-rose-garden';

                const pagesForSave = siteData.pages.map((page: any, pageIdx: number) => {
                    const uniquePageId = `${siteId}-${page.id || `page-${pageIdx}`}`;
                    return {
                        id: uniquePageId,
                        name: page.name || 'Home',
                        slug: page.slug || '/',
                        isHomePage: page.isHomePage ?? true,
                        height: page.height || 4800,
                        elements: (page.elements || []).map((el: any) => ({
                            ...el,
                            id: `${siteId}-${el.id}`,
                        })),
                    };
                });

                const saveRes = await fetch('/api/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        siteId,
                        pages: pagesForSave,
                        theme: siteData.theme,
                    }),
                });

                if (!saveRes.ok) throw new Error('Failed to save demo site');

                router.push(`/editor?siteId=${siteId}`);
                return;
            } catch (err) {
                console.error('[DEMO] Save failed:', err);
                alert('Demo site save failed. Please try again.');
                setIsBuilding(false);
                return;
            }
        }

        // ── Normal build flow (unchanged) ──
        const selectedMediaForAI = assets
            .filter(a => selectedAssets.includes(a.id) && a.type === 'image')
            .map(a => ({ url: a.src, label: a.label }));

        try {
            // Retry loop for 503s
            const maxRetries = 3;
            let attempt = 0;
            let success = false;
            let siteData = null;

            while (attempt < maxRetries && !success) {
                try {
                    const res = await fetch('/api/generate-site', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            businessName,
                            industry,
                            pitch,
                            vibe,
                            features,
                            selectedMedia: selectedMediaForAI,
                        }),
                    });

                    if (res.status === 503) {
                        console.warn(`[BUILD] Hit rate limit (503), retrying... (${attempt + 1}/${maxRetries})`);
                        attempt++;
                        if (attempt < maxRetries) {
                            // Wait 5s before retrying
                            await new Promise(resolve => setTimeout(resolve, 5000));
                            continue;
                        }
                    }

                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(errorData.error || 'Generation failed');
                    }

                    siteData = await res.json();
                    success = true;

                } catch (err) {
                    console.warn(`[BUILD] Attempt ${attempt + 1} failed:`, err);
                    if (attempt >= maxRetries - 1) throw err;
                    attempt++;
                    // Wait before retry
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            }

            if (!success || !siteData) {
                throw new Error("Service is busy. We tried 3 times but couldn't reach the AI. Please try again in a moment.");
            }

            // siteData is already parsed in the loop, no need to call res.json() again

            // Create a site ID
            const siteId = businessName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'mysite';

            // The API returns pages with elements embedded.
            // CRITICAL: Page IDs must be globally unique in the DB.
            // Gemini generates generic IDs like "home", so we prefix with siteId.
            const pagesForSave = siteData.pages.map((page: any, pageIdx: number) => {
                const uniquePageId = `${siteId}-${page.id || `page-${pageIdx}`}`;
                return {
                    id: uniquePageId,
                    name: page.name || 'Home',
                    slug: page.slug || '/',
                    isHomePage: page.isHomePage ?? true,
                    height: page.height || page.minHeight || 2000,
                    elements: (page.elements || []).map((el: any) => ({
                        ...el,
                        // Element IDs also need to be unique — prefix with siteId
                        id: el.id?.startsWith(siteId) ? el.id : `${siteId}-${el.id || Math.random().toString(36).slice(2, 8)}`,
                    })),
                };
            });

            // Save the generated site
            const saveRes = await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    siteId,
                    pages: pagesForSave,
                    theme: siteData.theme,
                }),
            });

            if (!saveRes.ok) {
                throw new Error('Failed to save site');
            }

            // Redirect to the editor with the new site
            router.push(`/editor?siteId=${siteId}`);

        } catch (err) {
            console.error('Build failed:', err);
            alert(`Site generation failed: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`);
            setIsBuilding(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Nav */}
            <nav className={styles.nav}>
                <a href="#" className={styles.brandWrapper}>
                    <FaLayerGroup className={styles.brandIcon} />
                    <span className={styles.brandLogo}>SiteApe</span>
                </a>
                <div className={styles.stepLabel}>STEP 2 OF 3: ASSET CURATION</div>
            </nav>

            {/* Header */}
            <div className={styles.headerSection}>
                <h1 className={styles.headerTitle}>Here's what we found for <em>{businessName}</em>.</h1>
                <p className={styles.headerSub}>
                    We've sourced images and generated content based on your "{industry}" business.
                    <br />Select the assets you want to include in your site.
                </p>
            </div>

            {/* Masonry Grid */}
            <div className={styles.masonryGrid}>
                {assets.map(asset => (
                    <div
                        key={asset.id}
                        className={`${styles.mediaCard} ${selectedAssets.includes(asset.id) ? styles.selected : ''}`}
                    >
                        <div
                            className={styles.checkOverlay}
                            onClick={(e) => { e.stopPropagation(); toggleAsset(asset.id); }}
                        >
                            <FaCheck size={12} />
                        </div>

                        {/* Content Rendering based on Type */}
                        {asset.type === 'image' && (
                            <img
                                src={asset.src}
                                className={styles.cardImage}
                                alt={asset.label}
                                onClick={() => handleCardClick(asset)}
                            />
                        )}

                        {asset.type === 'logo' && (
                            <div
                                style={{ background: asset.bg, padding: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                onClick={() => handleCardClick(asset)}
                            >
                                <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 24, fontWeight: 600 }}>{asset.content}</h3>
                            </div>
                        )}

                        {asset.type === 'text' && (
                            <div
                                style={{ padding: 24, background: asset.bg }}
                                onClick={() => handleCardClick(asset)}
                            >
                                {asset.label === 'Testimonials' ? (
                                    <>
                                        <div style={{ color: '#fbbf24', marginBottom: 8, display: 'flex', gap: 2 }}>
                                            {[1, 2, 3, 4, 5].map(i => <FaStar key={i} />)}
                                        </div>
                                        <p style={{ fontSize: 14, fontStyle: 'italic', marginBottom: 8 }}>
                                            {asset.content?.includes('" -')
                                                ? asset.content.split('" -')[0].replace('"', '') + '"'
                                                : asset.content}
                                        </p>
                                        {asset.content?.includes('- ') && (
                                            <p style={{ fontSize: 12, fontWeight: 600 }}>- {asset.content.split('- ').pop()}</p>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <h4 style={{ fontFamily: 'var(--font-playfair), serif', marginBottom: 8, fontSize: 18, fontWeight: 600 }}>
                                            {asset.content}
                                        </h4>
                                        <p style={{ fontSize: 12, color: '#4b5563' }}>{asset.desc}</p>
                                    </>
                                )}
                            </div>
                        )}

                        <div
                            className={styles.cardContent}
                            onClick={() => toggleAsset(asset.id)}
                        >
                            <div className={styles.cardHeader}>
                                <span className={`${styles.sourceBadge} ${asset.source.includes('AI') ? styles.badgeAi : asset.source.includes('Web') || asset.source.includes('Unsplash') ? styles.badgeWeb : styles.badgeSocial}`}>
                                    {asset.source.includes('AI') && <FaWandMagicSparkles />}
                                    {asset.source.includes('Web') && <FaGlobe />}
                                    {asset.source.includes('Unsplash') && <FaCamera />}
                                    {asset.source.includes('Curated') && <FaGlobe />}
                                    {' ' + asset.source}
                                </span>
                            </div>
                            <span className={styles.usageLabel}>Use for: {asset.label}</span>
                            <p className={styles.usageDesc}>{asset.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            <AssetDetailModal
                asset={viewingAsset}
                onClose={() => setViewingAsset(null)}
                onKeep={handleKeepAsset}
                onDiscard={() => {
                    if (viewingAsset && selectedAssets.includes(viewingAsset.id)) {
                        toggleAsset(viewingAsset.id);
                    }
                    setViewingAsset(null);
                }}
            />

            {/* Bottom Bar */}
            <div className={styles.bottomBar}>
                <div className={styles.selectionCount}>{selectedAssets.length} assets selected</div>
                <button
                    className={styles.btnBuild}
                    onClick={handleBuild}
                    disabled={isBuilding}
                    style={{ opacity: isBuilding ? 0.7 : 1 }}
                >
                    {isBuilding ? (
                        <><FaRotate className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Generating Site...</>
                    ) : (
                        <>Build Website <FaHammer /></>
                    )}
                </button>
            </div>

            {/* Building Overlay */}
            {isBuilding && (
                <div className={styles.loadingOverlay} style={{ position: 'fixed', zIndex: 9999 }}>
                    <div className={styles.loadingSpinner}></div>
                    <h2 className={styles.loadingText}>AI is building your website...</h2>
                    <p style={{ color: '#6b7280', marginTop: 8, fontSize: 14 }}>This usually takes 10-20 seconds</p>
                </div>
            )}
        </div>
    );
}

export default function MediaSelectionPage() {
    return (
        <Suspense fallback={
            <div className={styles.loadingOverlay}>
                <div className={styles.loadingSpinner}></div>
                <h2 className={styles.loadingText}>Loading...</h2>
            </div>
        }>
            <MediaSelectionContent />
        </Suspense>
    );
}
