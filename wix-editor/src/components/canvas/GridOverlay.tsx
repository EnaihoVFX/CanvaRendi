'use client';

import React from 'react';
import styles from './GridOverlay.module.css';

export default function GridOverlay() {
    return (
        <div className={styles.gridOverlay}>
            {/* Horizontal section lines */}
            <div className={styles.sectionLine} style={{ top: '0px' }} />
            <div className={styles.sectionLine} style={{ top: '600px' }} />

            {/* Center guide */}
            <div className={styles.centerGuide} />
        </div>
    );
}
