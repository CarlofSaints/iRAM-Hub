'use client';

interface Props {
  slug: string;
  locked: boolean;
}

export default function ModuleIcon({ slug, locked }: Props) {
  const fill = locked ? '#9ca3af' : '#7CC042';
  const size = 40;

  const icons: Record<string, React.ReactNode> = {
    callcycle: (
      /* Calendar icon */
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke={fill} strokeWidth="2" />
        <path d="M3 10H21" stroke={fill} strokeWidth="2" />
        <path d="M8 2V6" stroke={fill} strokeWidth="2" strokeLinecap="round" />
        <path d="M16 2V6" stroke={fill} strokeWidth="2" strokeLinecap="round" />
        <rect x="7" y="13" width="3" height="3" rx="0.5" fill={fill} />
        <rect x="14" y="13" width="3" height="3" rx="0.5" fill={fill} />
        <rect x="7" y="17" width="3" height="3" rx="0.5" fill={fill} />
      </svg>
    ),
    rvl: (
      /* Box/package with arrow (reverse logistics) */
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 8V21H3V8" stroke={fill} strokeWidth="2" strokeLinejoin="round" />
        <path d="M1 3H23L21 8H3L1 3Z" stroke={fill} strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 12V18" stroke={fill} strokeWidth="2" strokeLinecap="round" />
        <path d="M9 15L12 12L15 15" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    phantom: (
      /* Ghost icon */
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C7.58 2 4 5.58 4 10V22L7 19L10 22L12 20L14 22L17 19L20 22V10C20 5.58 16.42 2 12 2Z" stroke={fill} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="9" cy="10" r="1.5" fill={fill} />
        <circle cx="15" cy="10" r="1.5" fill={fill} />
      </svg>
    ),
    dispo: (
      /* Broom / cleaning icon */
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L12 10" stroke={fill} strokeWidth="2" strokeLinecap="round" />
        <path d="M7 10H17L19 22H5L7 10Z" stroke={fill} strokeWidth="2" strokeLinejoin="round" />
        <path d="M9 14V18" stroke={fill} strokeWidth="2" strokeLinecap="round" />
        <path d="M12 14V18" stroke={fill} strokeWidth="2" strokeLinecap="round" />
        <path d="M15 14V18" stroke={fill} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    'pnp-oos': (
      /* Shopping cart icon */
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1H5L7.68 14.39C7.77 14.83 8.02 15.22 8.38 15.5C8.74 15.78 9.18 15.92 9.64 15.9H19.36C19.82 15.92 20.26 15.78 20.62 15.5C20.98 15.22 21.23 14.83 21.32 14.39L23 6H6" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="20" r="2" fill={fill} />
        <circle cx="20" cy="20" r="2" fill={fill} />
      </svg>
    ),
  };

  return (
    <div className="flex-shrink-0">
      {icons[slug] ?? (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke={fill} strokeWidth="2" />
          <path d="M8 12H16" stroke={fill} strokeWidth="2" strokeLinecap="round" />
          <path d="M12 8V16" stroke={fill} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}
