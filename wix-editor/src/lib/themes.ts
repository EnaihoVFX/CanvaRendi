import { SiteTheme } from "@/types/editor";

export interface ThemeConfig {
    preview: string[];
    colors: SiteTheme['colors'];
    fontHeading: string;
    fontBody: string;
}

export const themeConfigs: Record<string, ThemeConfig> = {
    'Minimal': {
        preview: ['#ffffff', '#f3f4f6', '#111827'],
        colors: { background: '#ffffff', primary: '#111827', secondary: '#f3f4f6', accent: '#000000', text: '#111827' },
        fontHeading: 'Inter', fontBody: 'Inter'
    },
    'Bold': {
        preview: ['#111827', '#ffffff', '#ef4444'],
        colors: { background: '#111827', primary: '#ef4444', secondary: '#374151', accent: '#ffffff', text: '#ffffff' },
        fontHeading: 'Inter', fontBody: 'Inter'
    },
    'Elegant': {
        preview: ['#1c1917', '#dec79b', '#44403c'],
        colors: { background: '#1c1917', primary: '#dec79b', secondary: '#292524', accent: '#dec79b', text: '#fafaf9' },
        fontHeading: 'Playfair Display', fontBody: 'Inter'
    },
    'Playful': {
        preview: ['#fdf2f8', '#f9a8d4', '#3b82f6'],
        colors: { background: '#fff1f2', primary: '#db2777', secondary: '#fce7f3', accent: '#3b82f6', text: '#881337' },
        fontHeading: 'Inter', fontBody: 'Inter'
    },
    'Cozy': {
        preview: ['#fff7ed', '#fdba74', '#9a3412'],
        colors: { background: '#fff7ed', primary: '#9a3412', secondary: '#ffedd5', accent: '#fdba74', text: '#431407' },
        fontHeading: 'Inter', fontBody: 'Inter'
    },
    'Industrial': {
        preview: ['#374151', '#9ca3af', '#f3f4f6'],
        colors: { background: '#374151', primary: '#f3f4f6', secondary: '#4b5563', accent: '#9ca3af', text: '#f9fafb' },
        fontHeading: 'Inter', fontBody: 'Inter'
    },
    'Nature': {
        preview: ['#f0fdf4', '#16a34a', '#14532d'],
        colors: { background: '#f0fdf4', primary: '#15803d', secondary: '#dcfce7', accent: '#16a34a', text: '#14532d' },
        fontHeading: 'Inter', fontBody: 'Inter'
    },
};
