'use client';

interface Props {
  icon: string;
  locked: boolean;
  size?: number;
}

export const ICON_CATALOG: { value: string; label: string; category: string }[] = [
  // --- Existing / Module-specific ---
  { value: 'calendar', label: 'Calendar', category: 'General' },
  { value: 'box', label: 'Box / Logistics', category: 'General' },
  { value: 'ghost', label: 'Ghost', category: 'General' },
  { value: 'broom', label: 'Broom / Cleaner', category: 'General' },
  { value: 'cart', label: 'Shopping Cart', category: 'General' },
  // --- Charts & Analytics ---
  { value: 'chart-bar', label: 'Bar Chart', category: 'Charts' },
  { value: 'chart-line', label: 'Line Chart', category: 'Charts' },
  { value: 'chart-pie', label: 'Pie Chart', category: 'Charts' },
  // --- People ---
  { value: 'users', label: 'Users / Group', category: 'People' },
  { value: 'user', label: 'Single User', category: 'People' },
  // --- Communication ---
  { value: 'mail', label: 'Email', category: 'Communication' },
  { value: 'phone', label: 'Phone', category: 'Communication' },
  { value: 'bell', label: 'Notification Bell', category: 'Communication' },
  { value: 'chat', label: 'Chat Bubble', category: 'Communication' },
  // --- Files & Data ---
  { value: 'document', label: 'Document', category: 'Files' },
  { value: 'folder', label: 'Folder', category: 'Files' },
  { value: 'clipboard', label: 'Clipboard / Tasks', category: 'Files' },
  { value: 'database', label: 'Database', category: 'Files' },
  { value: 'list', label: 'List / Rows', category: 'Files' },
  // --- Location & Travel ---
  { value: 'map-pin', label: 'Map Pin', category: 'Location' },
  { value: 'globe', label: 'Globe / Web', category: 'Location' },
  { value: 'truck', label: 'Truck / Delivery', category: 'Location' },
  { value: 'building', label: 'Building / Warehouse', category: 'Location' },
  // --- Actions & Tools ---
  { value: 'settings', label: 'Settings / Gear', category: 'Tools' },
  { value: 'wrench', label: 'Wrench / Tool', category: 'Tools' },
  { value: 'search', label: 'Search', category: 'Tools' },
  { value: 'upload', label: 'Upload', category: 'Tools' },
  { value: 'download', label: 'Download', category: 'Tools' },
  { value: 'refresh', label: 'Refresh / Sync', category: 'Tools' },
  { value: 'printer', label: 'Printer', category: 'Tools' },
  { value: 'calculator', label: 'Calculator', category: 'Tools' },
  { value: 'barcode', label: 'Barcode / Scan', category: 'Tools' },
  { value: 'camera', label: 'Camera / Photo', category: 'Tools' },
  { value: 'filter', label: 'Filter / Funnel', category: 'Tools' },
  // --- Status & Info ---
  { value: 'shield', label: 'Shield / Security', category: 'Status' },
  { value: 'key', label: 'Key / Access', category: 'Status' },
  { value: 'bolt', label: 'Lightning Bolt', category: 'Status' },
  { value: 'star', label: 'Star / Favourite', category: 'Status' },
  { value: 'check-circle', label: 'Check Circle', category: 'Status' },
  { value: 'alert', label: 'Alert / Warning', category: 'Status' },
  { value: 'clock', label: 'Clock / Time', category: 'Status' },
  // --- Other ---
  { value: 'tag', label: 'Tag / Label', category: 'Other' },
  { value: 'link', label: 'Link / Chain', category: 'Other' },
  { value: 'grid', label: 'Grid / Dashboard', category: 'Other' },
  { value: 'puzzle', label: 'Puzzle / Integration', category: 'Other' },
  { value: 'target', label: 'Target / Crosshair', category: 'Other' },
  { value: 'currency', label: 'Currency / Money', category: 'Other' },
  { value: 'heart', label: 'Heart', category: 'Other' },
  { value: 'flag', label: 'Flag', category: 'Other' },
  { value: 'layers', label: 'Layers / Stack', category: 'Other' },
  { value: 'zap', label: 'Zap / Energy', category: 'Other' },
];

// Legacy slug → icon mapping for backward compat
const LEGACY_MAP: Record<string, string> = {
  callcycle: 'calendar',
  rvl: 'box',
  phantom: 'ghost',
  dispo: 'broom',
  'pnp-oos': 'cart',
};

function resolveIcon(icon: string): string {
  return LEGACY_MAP[icon] || icon;
}

function renderIcon(key: string, fill: string, size: number): React.ReactNode {
  const sw = 2; // strokeWidth
  const p: Record<string, string | number> = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };

  switch (key) {
    // ── Calendar ──
    case 'calendar':
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="18" rx="2" stroke={fill} strokeWidth={sw} />
          <path d="M3 10H21" stroke={fill} strokeWidth={sw} />
          <path d="M8 2V6" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M16 2V6" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <rect x="7" y="13" width="3" height="3" rx="0.5" fill={fill} />
          <rect x="14" y="13" width="3" height="3" rx="0.5" fill={fill} />
          <rect x="7" y="17" width="3" height="3" rx="0.5" fill={fill} />
        </svg>
      );

    // ── Box / Logistics ──
    case 'box':
      return (
        <svg {...p}>
          <path d="M21 8V21H3V8" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M1 3H23L21 8H3L1 3Z" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M12 12V18" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M9 15L12 12L15 15" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Ghost ──
    case 'ghost':
      return (
        <svg {...p}>
          <path d="M12 2C7.58 2 4 5.58 4 10V22L7 19L10 22L12 20L14 22L17 19L20 22V10C20 5.58 16.42 2 12 2Z" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
          <circle cx="9" cy="10" r="1.5" fill={fill} />
          <circle cx="15" cy="10" r="1.5" fill={fill} />
        </svg>
      );

    // ── Broom ──
    case 'broom':
      return (
        <svg {...p}>
          <path d="M12 2L12 10" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M7 10H17L19 22H5L7 10Z" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M9 14V18" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M12 14V18" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M15 14V18" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );

    // ── Shopping Cart ──
    case 'cart':
      return (
        <svg {...p}>
          <path d="M1 1H5L7.68 14.39C7.77 14.83 8.02 15.22 8.38 15.5C8.74 15.78 9.18 15.92 9.64 15.9H19.36C19.82 15.92 20.26 15.78 20.62 15.5C20.98 15.22 21.23 14.83 21.32 14.39L23 6H6" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="20" r="2" fill={fill} />
          <circle cx="20" cy="20" r="2" fill={fill} />
        </svg>
      );

    // ── Bar Chart ──
    case 'chart-bar':
      return (
        <svg {...p}>
          <rect x="3" y="12" width="4" height="9" rx="1" stroke={fill} strokeWidth={sw} />
          <rect x="10" y="6" width="4" height="15" rx="1" stroke={fill} strokeWidth={sw} />
          <rect x="17" y="3" width="4" height="18" rx="1" stroke={fill} strokeWidth={sw} />
        </svg>
      );

    // ── Line Chart ──
    case 'chart-line':
      return (
        <svg {...p}>
          <path d="M3 21L3 3" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M3 21H21" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M7 15L11 9L15 13L21 5" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="7" cy="15" r="1.5" fill={fill} />
          <circle cx="11" cy="9" r="1.5" fill={fill} />
          <circle cx="15" cy="13" r="1.5" fill={fill} />
          <circle cx="21" cy="5" r="1.5" fill={fill} />
        </svg>
      );

    // ── Pie Chart ──
    case 'chart-pie':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" stroke={fill} strokeWidth={sw} />
          <path d="M12 3V12L19.5 7.5" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Users / Group ──
    case 'users':
      return (
        <svg {...p}>
          <circle cx="9" cy="7" r="3" stroke={fill} strokeWidth={sw} />
          <path d="M3 21V19C3 16.79 4.79 15 7 15H11C13.21 15 15 16.79 15 19V21" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <circle cx="17" cy="8" r="2.5" stroke={fill} strokeWidth={sw} />
          <path d="M19 15C20.66 15.5 21 17 21 19V21" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );

    // ── Single User ──
    case 'user':
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="4" stroke={fill} strokeWidth={sw} />
          <path d="M4 21V19C4 16.79 5.79 15 8 15H16C18.21 15 20 16.79 20 19V21" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );

    // ── Email ──
    case 'mail':
      return (
        <svg {...p}>
          <rect x="2" y="4" width="20" height="16" rx="2" stroke={fill} strokeWidth={sw} />
          <path d="M2 7L12 13L22 7" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Phone ──
    case 'phone':
      return (
        <svg {...p}>
          <path d="M22 16.92V19.92C22 20.48 21.56 20.93 21 20.97C20.13 21.04 19.28 20.97 18.46 20.79C15.83 20.17 13.4 18.87 11.39 17.03C9.49 15.29 8 13.05 7.21 10.54C7.03 9.72 6.96 8.87 7.03 8.03C7.07 7.47 7.52 7.03 8.08 7.03H11.08C11.56 7.03 11.97 7.36 12.06 7.83C12.14 8.24 12.28 8.64 12.47 9.01C12.62 9.29 12.55 9.63 12.31 9.83L11.09 10.83C12.25 13.26 14.25 15.05 16.91 15.91L17.91 14.69C18.11 14.45 18.45 14.38 18.73 14.53C19.1 14.72 19.5 14.86 19.91 14.94C20.38 15.03 20.71 15.44 20.71 15.92L22 16.92Z" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Bell ──
    case 'bell':
      return (
        <svg {...p}>
          <path d="M18 8C18 4.69 15.31 2 12 2C8.69 2 6 4.69 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21C13.55 21.3 13.28 21.55 12.96 21.71C12.64 21.87 12.29 21.93 11.94 21.88C11.6 21.83 11.28 21.67 11.03 21.43C10.79 21.19 10.63 20.88 10.57 20.54" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );

    // ── Chat Bubble ──
    case 'chat':
      return (
        <svg {...p}>
          <path d="M21 11.5C21 16.19 16.97 20 12 20C10.82 20 9.69 19.79 8.65 19.42L3 21L4.58 15.35C3.58 13.87 3 12.08 3 10.18C3 5.81 7.03 2 12 2C16.97 2 21 5.81 21 10.18V11.5Z" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 10H8.01" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M12 10H12.01" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M16 10H16.01" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );

    // ── Document ──
    case 'document':
      return (
        <svg {...p}>
          <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M14 2V8H20" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M8 13H16" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M8 17H13" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );

    // ── Folder ──
    case 'folder':
      return (
        <svg {...p}>
          <path d="M2 6C2 4.9 2.9 4 4 4H9L11 6H20C21.1 6 22 6.9 22 8V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6Z" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );

    // ── Clipboard ──
    case 'clipboard':
      return (
        <svg {...p}>
          <path d="M16 4H18C19.1 4 20 4.9 20 6V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V6C4 4.9 4.9 4 6 4H8" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
          <rect x="8" y="2" width="8" height="4" rx="1" stroke={fill} strokeWidth={sw} />
          <path d="M8 12L10 14L16 10" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Database ──
    case 'database':
      return (
        <svg {...p}>
          <ellipse cx="12" cy="5" rx="8" ry="3" stroke={fill} strokeWidth={sw} />
          <path d="M4 5V12C4 13.66 7.58 15 12 15C16.42 15 20 13.66 20 12V5" stroke={fill} strokeWidth={sw} />
          <path d="M4 12V19C4 20.66 7.58 22 12 22C16.42 22 20 20.66 20 19V12" stroke={fill} strokeWidth={sw} />
        </svg>
      );

    // ── List ──
    case 'list':
      return (
        <svg {...p}>
          <path d="M8 6H21" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M8 12H21" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M8 18H21" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <circle cx="4" cy="6" r="1" fill={fill} />
          <circle cx="4" cy="12" r="1" fill={fill} />
          <circle cx="4" cy="18" r="1" fill={fill} />
        </svg>
      );

    // ── Map Pin ──
    case 'map-pin':
      return (
        <svg {...p}>
          <path d="M12 22S20 16 20 10C20 5.58 16.42 2 12 2C7.58 2 4 5.58 4 10C4 16 12 22 12 22Z" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
          <circle cx="12" cy="10" r="3" stroke={fill} strokeWidth={sw} />
        </svg>
      );

    // ── Globe ──
    case 'globe':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" stroke={fill} strokeWidth={sw} />
          <path d="M2 12H22" stroke={fill} strokeWidth={sw} />
          <path d="M12 2C14.5 4.73 15.96 8.26 16 12C15.96 15.74 14.5 19.27 12 22C9.5 19.27 8.04 15.74 8 12C8.04 8.26 9.5 4.73 12 2Z" stroke={fill} strokeWidth={sw} />
        </svg>
      );

    // ── Truck ──
    case 'truck':
      return (
        <svg {...p}>
          <rect x="1" y="3" width="15" height="13" rx="1" stroke={fill} strokeWidth={sw} />
          <path d="M16 8H20L23 11V16H16V8Z" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
          <circle cx="5.5" cy="18.5" r="2.5" stroke={fill} strokeWidth={sw} />
          <circle cx="18.5" cy="18.5" r="2.5" stroke={fill} strokeWidth={sw} />
        </svg>
      );

    // ── Building ──
    case 'building':
      return (
        <svg {...p}>
          <rect x="4" y="2" width="16" height="20" rx="1" stroke={fill} strokeWidth={sw} />
          <rect x="8" y="6" width="3" height="3" rx="0.5" fill={fill} />
          <rect x="13" y="6" width="3" height="3" rx="0.5" fill={fill} />
          <rect x="8" y="11" width="3" height="3" rx="0.5" fill={fill} />
          <rect x="13" y="11" width="3" height="3" rx="0.5" fill={fill} />
          <rect x="10" y="17" width="4" height="5" stroke={fill} strokeWidth={sw} />
        </svg>
      );

    // ── Settings / Gear ──
    case 'settings':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="3" stroke={fill} strokeWidth={sw} />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke={fill} strokeWidth={sw} />
        </svg>
      );

    // ── Wrench ──
    case 'wrench':
      return (
        <svg {...p}>
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94L6.73 20.2a2 2 0 01-2.83 0l-.1-.1a2 2 0 010-2.83l6.73-6.73A6 6 0 0114.7 6.3z" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );

    // ── Search ──
    case 'search':
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="7" stroke={fill} strokeWidth={sw} />
          <path d="M21 21L16.65 16.65" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );

    // ── Upload ──
    case 'upload':
      return (
        <svg {...p}>
          <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 17V3" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M7 8L12 3L17 8" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Download ──
    case 'download':
      return (
        <svg {...p}>
          <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 3V17" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M7 12L12 17L17 12" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Refresh ──
    case 'refresh':
      return (
        <svg {...p}>
          <path d="M1 4V10H7" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M23 20V14H17" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14L18.36 18.36A9 9 0 013.51 15" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Printer ──
    case 'printer':
      return (
        <svg {...p}>
          <path d="M6 9V2H18V9" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M6 18H4C2.9 18 2 17.1 2 16V11C2 9.9 2.9 9 4 9H20C21.1 9 22 9.9 22 11V16C22 17.1 21.1 18 20 18H18" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
          <rect x="6" y="14" width="12" height="8" stroke={fill} strokeWidth={sw} />
        </svg>
      );

    // ── Calculator ──
    case 'calculator':
      return (
        <svg {...p}>
          <rect x="4" y="2" width="16" height="20" rx="2" stroke={fill} strokeWidth={sw} />
          <rect x="7" y="5" width="10" height="5" rx="1" fill={fill} opacity="0.3" stroke={fill} strokeWidth={sw} />
          <circle cx="8" cy="14" r="1" fill={fill} />
          <circle cx="12" cy="14" r="1" fill={fill} />
          <circle cx="16" cy="14" r="1" fill={fill} />
          <circle cx="8" cy="18" r="1" fill={fill} />
          <circle cx="12" cy="18" r="1" fill={fill} />
          <circle cx="16" cy="18" r="1" fill={fill} />
        </svg>
      );

    // ── Barcode ──
    case 'barcode':
      return (
        <svg {...p}>
          <rect x="3" y="4" width="2" height="16" fill={fill} />
          <rect x="7" y="4" width="1" height="16" fill={fill} />
          <rect x="10" y="4" width="3" height="16" fill={fill} />
          <rect x="15" y="4" width="1" height="16" fill={fill} />
          <rect x="18" y="4" width="2" height="16" fill={fill} />
          <rect x="22" y="4" width="1" height="16" fill={fill} />
        </svg>
      );

    // ── Camera ──
    case 'camera':
      return (
        <svg {...p}>
          <path d="M23 19C23 20.1 22.1 21 21 21H3C1.9 21 1 20.1 1 19V8C1 6.9 1.9 6 3 6H7L9 3H15L17 6H21C22.1 6 23 6.9 23 8V19Z" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
          <circle cx="12" cy="13" r="4" stroke={fill} strokeWidth={sw} />
        </svg>
      );

    // ── Filter / Funnel ──
    case 'filter':
      return (
        <svg {...p}>
          <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Shield ──
    case 'shield':
      return (
        <svg {...p}>
          <path d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M9 12L11 14L15 10" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Key ──
    case 'key':
      return (
        <svg {...p}>
          <circle cx="8" cy="15" r="5" stroke={fill} strokeWidth={sw} />
          <path d="M12.5 10.5L21 2" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M18 5L21 8" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );

    // ── Lightning Bolt ──
    case 'bolt':
      return (
        <svg {...p}>
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Star ──
    case 'star':
      return (
        <svg {...p}>
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Check Circle ──
    case 'check-circle':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" stroke={fill} strokeWidth={sw} />
          <path d="M8 12L11 15L16 9" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Alert / Warning ──
    case 'alert':
      return (
        <svg {...p}>
          <path d="M10.29 3.86L1.82 18C1.46 18.63 1.93 19.5 2.68 19.5H21.32C22.07 19.5 22.54 18.63 22.18 18L13.71 3.86C13.33 3.19 12.67 3.19 12.29 3.56L10.29 3.86Z" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M12 9V13" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <circle cx="12" cy="17" r="1" fill={fill} />
        </svg>
      );

    // ── Clock ──
    case 'clock':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" stroke={fill} strokeWidth={sw} />
          <path d="M12 6V12L16 14" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Tag / Label ──
    case 'tag':
      return (
        <svg {...p}>
          <path d="M20.59 13.41L13.42 20.58C13.04 20.96 12.53 21.17 12 21.17C11.47 21.17 10.96 20.96 10.58 20.58L2 12V2H12L20.59 10.59C21.37 11.37 21.37 12.63 20.59 13.41Z" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="7" cy="7" r="1.5" fill={fill} />
        </svg>
      );

    // ── Link ──
    case 'link':
      return (
        <svg {...p}>
          <path d="M10 13C10.87 14.07 12.13 14.86 13.54 14.99C14.95 15.12 16.36 14.58 17.42 13.52L20.42 10.52C22.28 8.56 22.24 5.46 20.32 3.54C18.4 1.62 15.3 1.58 13.34 3.44L11.68 5.05" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M14 11C13.13 9.93 11.87 9.14 10.46 9.01C9.05 8.88 7.64 9.42 6.58 10.48L3.58 13.48C1.72 15.44 1.76 18.54 3.68 20.46C5.6 22.38 8.7 22.42 10.66 20.56L12.28 18.95" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );

    // ── Grid / Dashboard ──
    case 'grid':
      return (
        <svg {...p}>
          <rect x="3" y="3" width="7" height="7" rx="1" stroke={fill} strokeWidth={sw} />
          <rect x="14" y="3" width="7" height="7" rx="1" stroke={fill} strokeWidth={sw} />
          <rect x="3" y="14" width="7" height="7" rx="1" stroke={fill} strokeWidth={sw} />
          <rect x="14" y="14" width="7" height="7" rx="1" stroke={fill} strokeWidth={sw} />
        </svg>
      );

    // ── Puzzle / Integration ──
    case 'puzzle':
      return (
        <svg {...p}>
          <path d="M19.439 12.94c1.162 0 2.09-.93 2.09-2.06s-.928-2.06-2.09-2.06H18V6.88c0-1.13-.928-2.06-2.09-2.06s-2.09.93-2.09 2.06v.06H11.88c0-1.13-.928-2.06-2.09-2.06S7.7 5.81 7.7 6.94H5.76c-1.162 0-2.09.93-2.09 2.06v1.94h.06c1.162 0 2.09.93 2.09 2.06s-.928 2.06-2.09 2.06H3.67v1.94c0 1.13.928 2.06 2.09 2.06h1.94v-.06c0-1.13.928-2.06 2.09-2.06s2.09.93 2.09 2.06v.06h1.94c0-1.13.928-2.06 2.09-2.06s2.09.93 2.09 2.06H20.09c1.162 0 2.09-.93 2.09-2.06V12.94H19.439z" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );

    // ── Target / Crosshair ──
    case 'target':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" stroke={fill} strokeWidth={sw} />
          <circle cx="12" cy="12" r="6" stroke={fill} strokeWidth={sw} />
          <circle cx="12" cy="12" r="2" fill={fill} />
          <path d="M12 2V6" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M12 18V22" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M2 12H6" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M18 12H22" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );

    // ── Currency / Money ──
    case 'currency':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" stroke={fill} strokeWidth={sw} />
          <path d="M12 6V18" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M15 9.5C15 8.12 13.66 7 12 7C10.34 7 9 8.12 9 9.5C9 10.88 10.34 12 12 12C13.66 12 15 13.12 15 14.5C15 15.88 13.66 17 12 17C10.34 17 9 15.88 9 14.5" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );

    // ── Heart ──
    case 'heart':
      return (
        <svg {...p}>
          <path d="M20.84 4.61C20.33 4.1 19.72 3.71 19.05 3.44C18.38 3.17 17.67 3.04 16.95 3.04C16.23 3.04 15.52 3.17 14.85 3.44C14.18 3.71 13.57 4.1 13.06 4.61L12 5.67L10.94 4.61C9.9 3.57 8.51 2.99 7.05 2.99C5.59 2.99 4.2 3.57 3.16 4.61C2.12 5.65 1.54 7.04 1.54 8.5C1.54 9.96 2.12 11.35 3.16 12.39L12 21.23L20.84 12.39C21.35 11.88 21.74 11.27 22.01 10.6C22.28 9.93 22.41 9.22 22.41 8.5C22.41 7.78 22.28 7.07 22.01 6.4C21.74 5.73 21.35 5.12 20.84 4.61Z" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Flag ──
    case 'flag':
      return (
        <svg {...p}>
          <path d="M4 15S5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V3S19 4 16 4C13 4 11 2 8 2C5 2 4 3 4 3V22" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Layers / Stack ──
    case 'layers':
      return (
        <svg {...p}>
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={fill} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M2 17L12 22L22 17" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12L12 17L22 12" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Zap / Energy ──
    case 'zap':
      return (
        <svg {...p}>
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill={fill} opacity="0.15" stroke={fill} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Default (generic +) ──
    default:
      return (
        <svg {...p}>
          <rect x="3" y="3" width="18" height="18" rx="3" stroke={fill} strokeWidth={sw} />
          <path d="M8 12H16" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
          <path d="M12 8V16" stroke={fill} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
  }
}

export default function ModuleIcon({ icon, locked, size = 40 }: Props) {
  const fill = locked ? '#9ca3af' : '#7CC042';
  const resolved = resolveIcon(icon);

  return (
    <div className="flex-shrink-0">
      {renderIcon(resolved, fill, size)}
    </div>
  );
}
