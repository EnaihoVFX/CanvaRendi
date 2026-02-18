// ===== Element Types =====
export type ElementType =
  // Text elements
  | 'text'
  | 'heading'
  | 'paragraph'
  // Media elements  
  | 'image'
  | 'video'
  | 'gallery'
  | 'slideshow'
  // Interactive elements
  | 'button'
  | 'link'
  | 'icon'
  | 'social-icons'
  // Structure elements
  | 'section'
  | 'box'
  | 'container'
  | 'strip'
  | 'columns'
  | 'grid'
  // Navigation
  | 'menu'
  | 'navbar'
  | 'footer'
  // Forms
  | 'form'
  | 'input'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'dropdown'
  | 'submit-button'
  // Decorative
  | 'shape'
  | 'line'
  | 'divider'
  | 'spacer'
  // Lists & Content
  | 'list'
  | 'accordion'
  | 'tabs'
  | 'table'
  // Embeds
  | 'map'
  | 'html'
  | 'embed'
  // E-commerce
  | 'product-card'
  | 'price'
  | 'cart-button'
  // Blog
  | 'blog-card'
  | 'quote'
  // Contact
  | 'contact-form'
  | 'subscribe-form'
  // Advanced
  | 'testimonial'
  | 'team-member'
  | 'progress-bar'
  | 'countdown'
  | 'alert'
  | 'badge';

// ===== Element Position & Size =====
export interface ElementBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

// ===== Text Element Props =====
export interface TextElementProps {
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  letterSpacing?: number;
}

// ===== Image Element Props =====
export interface ImageElementProps {
  src: string;
  alt: string;
  objectFit: 'cover' | 'contain' | 'fill' | 'none';
  borderRadius?: number;
}

// ===== Button Element Props =====
export interface ButtonElementProps {
  label: string;
  link?: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  fontSize: number;
  fontWeight: number;
}

// ===== Section Element Props =====
export interface SectionElementProps {
  backgroundColor: string;
  backgroundImage?: string;
  paddingTop: number;
  paddingBottom: number;
  minHeight: number;
}

// ===== Box Element Props =====
export interface BoxElementProps {
  backgroundColor: string;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  shadow: 'none' | 'sm' | 'md' | 'lg';
}

// ===== Shape Element Props =====
export interface ShapeElementProps {
  shapeType: 'rectangle' | 'circle' | 'triangle' | 'star' | 'polygon';
  fill: string;
  stroke: string;
  strokeWidth: number;
}

// ===== Video Element Props =====
export interface VideoElementProps {
  src: string;
  poster?: string;
  autoPlay: boolean;
  loop: boolean;
  muted: boolean;
  controls: boolean;
}

// ===== Form Element Props =====
export interface FormElementProps {
  fields: Array<{
    type: 'text' | 'email' | 'phone' | 'message' | 'checkbox';
    label: string;
    required: boolean;
  }>;
  submitLabel: string;
  submitColor: string;
}

// ===== Social Icons Props =====
export interface SocialIconsProps {
  icons: Array<{
    platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok';
    url: string;
  }>;
  size: number;
  color: string;
  style: 'filled' | 'outline' | 'minimal';
}

// ===== Menu/Navbar Props =====
export interface MenuElementProps {
  items: Array<{
    label: string;
    pageId?: string;
    url?: string;
  }>;
  style: 'horizontal' | 'vertical';
  backgroundColor: string;
  textColor: string;
}

// ===== Union Type for Element Props =====
export type ElementProps =
  | { type: 'text'; props: TextElementProps }
  | { type: 'heading'; props: TextElementProps }
  | { type: 'image'; props: ImageElementProps }
  | { type: 'button'; props: ButtonElementProps }
  | { type: 'section'; props: SectionElementProps }
  | { type: 'box'; props: BoxElementProps }
  | { type: 'shape'; props: ShapeElementProps }
  | { type: 'testimonial'; props: TestimonialElementProps }
  | { type: 'team-member'; props: TeamMemberElementProps }
  | { type: 'progress-bar'; props: ProgressBarElementProps }
  | { type: 'countdown'; props: CountdownElementProps }
  | { type: 'alert'; props: AlertElementProps }
  | { type: 'badge'; props: BadgeElementProps };

// ===== Testimonial Props =====
export interface TestimonialElementProps {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
}

// ===== Team Member Props =====
export interface TeamMemberElementProps {
  name: string;
  role: string;
  image?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

// ===== Progress Bar Props =====
export interface ProgressBarElementProps {
  value: number;
  max: number;
  showLabel: boolean;
  color: string;
  height: number;
}

// ===== Countdown Props =====
export interface CountdownElementProps {
  targetDate: string; // ISO string
  style: 'simple' | 'blocks' | 'circles';
}

// ===== Alert Props =====
export interface AlertElementProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  closable: boolean;
}

// ===== Badge Props =====
export interface BadgeElementProps {
  label: string;
  color: string; // background color
  textColor: string;
  radius: number;
}


// ===== Animation Properties =====
export interface ElementAnimation {
  type: 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale-up' | 'rotate-in' | 'bounce-in' | 'none';
  duration: number; // in seconds
  delay: number; // in seconds
  ease: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

// ===== Canvas Element =====
export interface CanvasElement {
  id: string;
  type: ElementType;
  bounds: ElementBounds;
  props: Record<string, unknown>;
  locked: boolean;
  hidden: boolean;
  parentId?: string;
  zIndex: number;
  pageId: string; // Associates element with a specific page
  animation?: ElementAnimation;
}

// ===== Section =====
export interface Section {
  id: string;
  name: string;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
  elements: string[]; // Element IDs
}

// ===== Page =====
export interface Page {
  id: string;
  name: string;
  slug: string;
  sections: Section[];
  isHomePage: boolean;
  minHeight: number; // Minimum page height
  height: number; // Current page height (user-adjustable)
  elements?: CanvasElement[]; // Elements belonging to this page
}

// ===== Site Theme =====
export interface SiteTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

// ===== Editor State =====
export interface EditorState {
  // Data
  pages: Page[];
  elements: Record<string, CanvasElement>;
  currentPageId: string;
  theme: SiteTheme;

  // UI State
  selectedElementId: string | null;
  hoveredElementId: string | null;
  activePanelId: string | null;
  isPreviewMode: boolean;
  zoom: number;

  // History
  historyStack: EditorState[];
  historyIndex: number;

  // Actions
  addElement: (element: Omit<CanvasElement, 'id' | 'zIndex'>) => string;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  setActivePanel: (panelId: string | null) => void;
  setCurrentPage: (pageId: string) => void;
  undo: () => void;
  redo: () => void;
}

// ===== Panel Types =====
export type PanelId =
  | 'add'
  | 'pages'
  | 'design'
  | 'apps'
  | 'media'
  | 'cms';

// ===== Drag Item =====
export interface DragItem {
  type: ElementType;
  defaultProps: Record<string, unknown>;
  defaultBounds: Partial<ElementBounds>;
}

// ===== Toolbar Action =====
export interface ToolbarAction {
  id: string;
  icon: string;
  label: string;
  onClick: () => void;
}
// ===== Site Types =====
export interface SiteData {
  siteId: string;
  name?: string;
  lastSaved: string;
  lastPublished?: string;
  pages: Page[];
  elements: Record<string, CanvasElement>;
  theme: SiteTheme;
}

export interface PublishedSite {
  siteId: string;
  publishedAt: string;
  pages: Page[];
  elements: Record<string, CanvasElement>;
  theme: SiteTheme;
}
