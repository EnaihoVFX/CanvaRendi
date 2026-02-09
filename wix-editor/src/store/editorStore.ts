import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { CanvasElement, Page, SiteTheme, PanelId } from '@/types/editor';

interface HistoryState {
    elements: Record<string, CanvasElement>;
    pages: Page[];
}

interface EditorStore {
    // Data
    pages: Page[];
    elements: Record<string, CanvasElement>;
    currentPageId: string;
    theme: SiteTheme;

    // UI State
    selectedElementId: string | null;
    hoveredElementId: string | null;
    activePanelId: PanelId | null;
    isPreviewMode: boolean;
    deviceMode: 'desktop' | 'tablet' | 'mobile';
    zoom: number;
    isDragging: boolean;

    // History
    history: HistoryState[];
    historyIndex: number;

    // Actions
    addElement: (element: Omit<CanvasElement, 'id' | 'zIndex'>) => string;
    updateElement: (id: string, updates: Partial<CanvasElement>) => void;
    deleteElement: (id: string) => void;
    duplicateElement: (id: string) => string | null;

    selectElement: (id: string | null) => void;
    setHoveredElement: (id: string | null) => void;
    setActivePanel: (panelId: PanelId | null) => void;
    togglePanel: (panelId: PanelId) => void;

    setCurrentPage: (pageId: string) => void;
    addPage: (name: string) => string;
    deletePage: (pageId: string) => void;
    renamePage: (pageId: string, name: string) => void;

    setPreviewMode: (isPreview: boolean) => void;
    setDeviceMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
    setZoom: (zoom: number) => void;
    setDragging: (isDragging: boolean) => void;

    updateTheme: (updates: Partial<SiteTheme>) => void;
    setThemeColor: (key: keyof SiteTheme['colors'], value: string) => void;
    setThemeFont: (key: keyof SiteTheme['fonts'], value: string) => void;

    // History Actions
    saveToHistory: () => void;
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;

    // Element ordering
    bringForward: (id: string) => void;
    sendBackward: (id: string) => void;
    bringToFront: (id: string) => void;
    sendToBack: (id: string) => void;

    // Page height management
    setPageHeight: (pageId: string, height: number) => void;
    expandPageHeightIfNeeded: (elementBottomY: number) => void;

    // Helpers
    getSelectedElement: () => CanvasElement | null;
    getCurrentPage: () => Page | null;
    getElementsForCurrentPage: () => CanvasElement[];
}

// Default theme
const defaultTheme: SiteTheme = {
    colors: {
        primary: '#116DFF',
        secondary: '#20303C',
        accent: '#FF6B6B',
        background: '#FFFFFF',
        text: '#20303C',
    },
    fonts: {
        heading: 'DM Sans',
        body: 'DM Sans',
    },
};

// Default page
const defaultPage: Page = {
    id: 'home',
    name: 'Home',
    slug: '/',
    sections: [
        {
            id: 'hero',
            name: 'Hero Section',
            height: 600,
            backgroundColor: '#FFFFFF',
            elements: [],
        },
    ],
    isHomePage: true,
    minHeight: 600,
    height: 1200,
};

export const useEditorStore = create<EditorStore>()(
    persist(
        (set, get) => ({
            // Initial State
            pages: [defaultPage],
            elements: {},
            currentPageId: 'home',
            theme: defaultTheme,
            selectedElementId: null,
            hoveredElementId: null,
            activePanelId: null,
            isPreviewMode: false,
            deviceMode: 'desktop',
            zoom: 100,
            isDragging: false,
            history: [],
            historyIndex: -1,

            // History Actions
            saveToHistory: () => {
                const { elements, pages, history, historyIndex } = get();
                const newHistory = history.slice(0, historyIndex + 1);
                newHistory.push({ elements: { ...elements }, pages: [...pages] });

                // Keep only last 50 states
                if (newHistory.length > 50) {
                    newHistory.shift();
                }

                set({
                    history: newHistory,
                    historyIndex: newHistory.length - 1,
                });
            },

            undo: () => {
                const { historyIndex, history } = get();
                if (historyIndex > 0) {
                    const prevState = history[historyIndex - 1];
                    set({
                        elements: prevState.elements,
                        pages: prevState.pages,
                        historyIndex: historyIndex - 1,
                        selectedElementId: null,
                    });
                }
            },

            redo: () => {
                const { historyIndex, history } = get();
                if (historyIndex < history.length - 1) {
                    const nextState = history[historyIndex + 1];
                    set({
                        elements: nextState.elements,
                        pages: nextState.pages,
                        historyIndex: historyIndex + 1,
                        selectedElementId: null,
                    });
                }
            },

            canUndo: () => get().historyIndex > 0,
            canRedo: () => get().historyIndex < get().history.length - 1,

            // Element Actions
            addElement: (element) => {
                const id = uuidv4();
                const { currentPageId } = get();
                const maxZIndex = Math.max(
                    0,
                    ...Object.values(get().elements).map((el) => el.zIndex)
                );

                const newElement: CanvasElement = {
                    ...element,
                    id,
                    zIndex: maxZIndex + 1,
                    pageId: currentPageId, // Associate element with current page
                };

                set((state) => ({
                    elements: {
                        ...state.elements,
                        [id]: newElement,
                    },
                    selectedElementId: id,
                }));

                get().saveToHistory();
                return id;
            },

            updateElement: (id, updates) => {
                set((state) => {
                    const element = state.elements[id];
                    if (!element) return state;

                    return {
                        elements: {
                            ...state.elements,
                            [id]: { ...element, ...updates },
                        },
                    };
                });
            },

            deleteElement: (id) => {
                get().saveToHistory();
                set((state) => {
                    const { [id]: deleted, ...rest } = state.elements;
                    return {
                        elements: rest,
                        selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
                    };
                });
            },

            duplicateElement: (id) => {
                const element = get().elements[id];
                if (!element) return null;

                const newId = uuidv4();
                const offset = 20;

                const duplicated: CanvasElement = {
                    ...element,
                    id: newId,
                    bounds: {
                        ...element.bounds,
                        x: element.bounds.x + offset,
                        y: element.bounds.y + offset,
                    },
                    zIndex: Math.max(0, ...Object.values(get().elements).map((el) => el.zIndex)) + 1,
                };

                set((state) => ({
                    elements: {
                        ...state.elements,
                        [newId]: duplicated,
                    },
                    selectedElementId: newId,
                }));

                get().saveToHistory();
                return newId;
            },

            // Z-Index ordering
            bringForward: (id) => {
                const elements = get().elements;
                const element = elements[id];
                if (!element) return;

                const sortedElements = Object.values(elements).sort((a, b) => a.zIndex - b.zIndex);
                const currentIndex = sortedElements.findIndex(el => el.id === id);

                if (currentIndex < sortedElements.length - 1) {
                    const nextElement = sortedElements[currentIndex + 1];
                    set((state) => ({
                        elements: {
                            ...state.elements,
                            [id]: { ...element, zIndex: nextElement.zIndex },
                            [nextElement.id]: { ...nextElement, zIndex: element.zIndex },
                        },
                    }));
                }
            },

            sendBackward: (id) => {
                const elements = get().elements;
                const element = elements[id];
                if (!element) return;

                const sortedElements = Object.values(elements).sort((a, b) => a.zIndex - b.zIndex);
                const currentIndex = sortedElements.findIndex(el => el.id === id);

                if (currentIndex > 0) {
                    const prevElement = sortedElements[currentIndex - 1];
                    set((state) => ({
                        elements: {
                            ...state.elements,
                            [id]: { ...element, zIndex: prevElement.zIndex },
                            [prevElement.id]: { ...prevElement, zIndex: element.zIndex },
                        },
                    }));
                }
            },

            bringToFront: (id) => {
                const maxZIndex = Math.max(...Object.values(get().elements).map(el => el.zIndex));
                set((state) => ({
                    elements: {
                        ...state.elements,
                        [id]: { ...state.elements[id], zIndex: maxZIndex + 1 },
                    },
                }));
            },

            sendToBack: (id) => {
                const minZIndex = Math.min(...Object.values(get().elements).map(el => el.zIndex));
                set((state) => ({
                    elements: {
                        ...state.elements,
                        [id]: { ...state.elements[id], zIndex: minZIndex - 1 },
                    },
                }));
            },

            // Selection Actions
            selectElement: (id) => {
                set({ selectedElementId: id });
            },

            setHoveredElement: (id) => {
                set({ hoveredElementId: id });
            },

            // Panel Actions
            setActivePanel: (panelId) => {
                set({ activePanelId: panelId });
            },

            togglePanel: (panelId) => {
                set((state) => ({
                    activePanelId: state.activePanelId === panelId ? null : panelId,
                }));
            },

            // Page Actions
            setCurrentPage: (pageId) => {
                set({ currentPageId: pageId, selectedElementId: null });
            },

            addPage: (name) => {
                const id = uuidv4();
                const slug = `/${name.toLowerCase().replace(/\s+/g, '-')}`;

                const newPage: Page = {
                    id,
                    name,
                    slug,
                    sections: [
                        {
                            id: uuidv4(),
                            name: 'Main Section',
                            height: 600,
                            backgroundColor: '#FFFFFF',
                            elements: [],
                        },
                    ],
                    isHomePage: false,
                    minHeight: 600,
                    height: 1200,
                };

                set((state) => ({
                    pages: [...state.pages, newPage],
                    currentPageId: id,
                }));

                get().saveToHistory();
                return id;
            },

            deletePage: (pageId) => {
                set((state) => {
                    const pages = state.pages.filter((p) => p.id !== pageId);
                    if (pages.length === 0) return state;

                    return {
                        pages,
                        currentPageId: state.currentPageId === pageId ? pages[0].id : state.currentPageId,
                    };
                });
                get().saveToHistory();
            },

            renamePage: (pageId, name) => {
                set((state) => ({
                    pages: state.pages.map((p) =>
                        p.id === pageId ? { ...p, name, slug: `/${name.toLowerCase().replace(/\s+/g, '-')}` } : p
                    ),
                }));
            },

            // View Actions
            setPreviewMode: (isPreview) => {
                set({ isPreviewMode: isPreview, selectedElementId: null, activePanelId: null });
            },

            setDeviceMode: (mode) => {
                set({ deviceMode: mode });
            },

            setZoom: (zoom) => {
                set({ zoom: Math.min(200, Math.max(25, zoom)) });
            },

            setDragging: (isDragging) => {
                set({ isDragging });
            },

            // Theme Actions
            updateTheme: (updates) => {
                set((state) => ({
                    theme: { ...state.theme, ...updates },
                }));
            },

            setThemeColor: (key, value) => {
                set((state) => ({
                    theme: {
                        ...state.theme,
                        colors: { ...state.theme.colors, [key]: value },
                    },
                }));
            },

            setThemeFont: (key, value) => {
                set((state) => ({
                    theme: {
                        ...state.theme,
                        fonts: { ...state.theme.fonts, [key]: value },
                    },
                }));
            },

            // Helpers
            getSelectedElement: () => {
                const { selectedElementId, elements } = get();
                return selectedElementId ? elements[selectedElementId] : null;
            },

            getCurrentPage: () => {
                const { currentPageId, pages } = get();
                return pages.find((p) => p.id === currentPageId) || null;
            },

            getElementsForCurrentPage: () => {
                const { currentPageId, elements } = get();
                return Object.values(elements).filter(el => el.pageId === currentPageId);
            },

            // Page height management
            setPageHeight: (pageId, height) => {
                // Ensure all values are numbers (localStorage may store as strings)
                const numHeight = typeof height === 'string' ? parseInt(height, 10) : height;
                set((state) => ({
                    pages: state.pages.map((p) => {
                        if (p.id !== pageId) return p;
                        const numMinHeight = typeof p.minHeight === 'string' ? parseInt(p.minHeight, 10) : (p.minHeight || 600);
                        return {
                            ...p,
                            height: Math.max(numMinHeight, numHeight || 600),
                            minHeight: numMinHeight,
                        };
                    }),
                }));
            },

            expandPageHeightIfNeeded: (elementBottomY) => {
                const currentPage = get().getCurrentPage();
                if (currentPage && elementBottomY > currentPage.height - 100) {
                    const newHeight = elementBottomY + 200;
                    get().setPageHeight(currentPage.id, newHeight);
                }
            },
        }),
        {
            name: 'wix-editor-storage',
            partialize: (state) => ({
                elements: state.elements,
                pages: state.pages,
                theme: state.theme,
                currentPageId: state.currentPageId,
            }),
            // Migrate legacy pages and ensure height values are proper numbers
            onRehydrateStorage: () => (state) => {
                if (state && state.pages) {
                    // Always ensure all pages have proper numeric height values
                    state.pages = state.pages.map(p => ({
                        ...p,
                        minHeight: typeof p.minHeight === 'string' ? parseInt(p.minHeight, 10) : (p.minHeight || 600),
                        height: typeof p.height === 'string' ? parseInt(p.height, 10) : (p.height || 1200),
                    }));
                }
            },
        }
    )
);
