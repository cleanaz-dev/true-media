// @/lib/email/styles/index.ts

// ============================================================
// DESIGN TOKENS
// ============================================================

export const colors = {
  // Primary palette
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  // Accent
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  // Feedback
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
  },
  // Neutrals
  white: '#ffffff',
  black: '#000000',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '40px',
  '4xl': '48px',
  '5xl': '64px',
} as const;

export const typography = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  sizes: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    md: '15px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '28px',
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: '20px',
    normal: '24px',
    relaxed: '28px',
  },
  letterSpacing: {
    tight: '-0.4px',
    normal: '0',
    wide: '0.5px',
    wider: '1px',
    widest: '2px',
  },
} as const;

export const radii = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
} as const;

// ============================================================
// BASE / LAYOUT STYLES
// ============================================================

export const mainStyle: React.CSSProperties = {
  backgroundColor: colors.slate[100],
  fontFamily: typography.fontFamily,
  padding: `${spacing['3xl']} ${spacing.md}`,
  margin: 0,
};

export const containerStyle: React.CSSProperties = {
  backgroundColor: colors.white,
  margin: '0 auto',
  borderRadius: radii.lg,
  border: `1px solid ${colors.slate[200]}`,
  maxWidth: '560px',
  overflow: 'hidden',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
};

export const contentStyle: React.CSSProperties = {
  padding: `${spacing['2xl']} ${spacing['2xl']} ${spacing.xl} ${spacing['2xl']}`,
};

export const narrowContentStyle: React.CSSProperties = {
  padding: `${spacing['2xl']} ${spacing['3xl']}`,
};

// ============================================================
// HEADER / BRANDING
// ============================================================

export const headerContainerStyle: React.CSSProperties = {
  backgroundColor: colors.slate[950],
  padding: `${spacing.xl} ${spacing['2xl']}`,
  textAlign: 'center',
};

export const headerLogoStyle: React.CSSProperties = {
  fontSize: typography.sizes.sm,
  fontWeight: typography.weights.bold,
  letterSpacing: typography.letterSpacing.widest,
  color: colors.white,
  textTransform: 'uppercase',
  margin: 0,
};

export const headerSublineStyle: React.CSSProperties = {
  fontSize: typography.sizes.xs,
  fontWeight: typography.weights.medium,
  letterSpacing: typography.letterSpacing.wide,
  color: colors.slate[400],
  margin: `${spacing.xs} 0 0 0`,
  textTransform: 'uppercase',
};

export const companyBadgeStyle: React.CSSProperties = {
  fontSize: typography.sizes.xs,
  fontWeight: typography.weights.bold,
  letterSpacing: typography.letterSpacing.wider,
  color: colors.slate[500],
  textTransform: 'uppercase',
  margin: `0 0 ${spacing.sm} 0`,
};

// ============================================================
// TYPOGRAPHY
// ============================================================

export const headingStyle: React.CSSProperties = {
  fontSize: typography.sizes['3xl'],
  fontWeight: typography.weights.bold,
  color: colors.slate[900],
  marginTop: 0,
  marginBottom: spacing.lg,
  letterSpacing: typography.letterSpacing.tight,
  lineHeight: typography.lineHeights.relaxed,
};

export const headingLgStyle: React.CSSProperties = {
  ...headingStyle,
  fontSize: typography.sizes['4xl'],
  marginBottom: spacing.xl,
};

export const headingSmStyle: React.CSSProperties = {
  fontSize: typography.sizes.lg,
  fontWeight: typography.weights.bold,
  color: colors.slate[900],
  marginTop: spacing.xl,
  marginBottom: spacing.sm,
  letterSpacing: typography.letterSpacing.tight,
  lineHeight: typography.lineHeights.normal,
};

export const subheadingStyle: React.CSSProperties = {
  fontSize: typography.sizes.md,
  fontWeight: typography.weights.semibold,
  color: colors.slate[700],
  marginTop: 0,
  marginBottom: spacing.md,
  lineHeight: typography.lineHeights.normal,
};

export const textStyle: React.CSSProperties = {
  fontSize: typography.sizes.base,
  lineHeight: typography.lineHeights.relaxed,
  color: colors.slate[700],
  margin: `${spacing.md} 0`,
};

export const textMutedStyle: React.CSSProperties = {
  ...textStyle,
  color: colors.slate[500],
};

export const textSmallStyle: React.CSSProperties = {
  fontSize: typography.sizes.sm,
  lineHeight: typography.lineHeights.tight,
  color: colors.slate[600],
  margin: `${spacing.sm} 0`,
};

export const textXsStyle: React.CSSProperties = {
  fontSize: typography.sizes.xs,
  lineHeight: typography.lineHeights.tight,
  color: colors.slate[500],
  margin: `${spacing.xs} 0`,
};

// ============================================================
// HIGHLIGHT BOXES
// ============================================================

export const documentHighlightBox: React.CSSProperties = {
  backgroundColor: colors.slate[50],
  border: `1px solid ${colors.slate[200]}`,
  borderRadius: radii.md,
  padding: `${spacing.lg} ${spacing.xl}`,
  margin: `${spacing.xl} 0`,
};

export const documentTitleStyle: React.CSSProperties = {
  fontSize: typography.sizes.base,
  fontWeight: typography.weights.semibold,
  color: colors.slate[900],
  margin: 0,
  lineHeight: typography.lineHeights.normal,
};

export const infoBoxStyle: React.CSSProperties = {
  backgroundColor: colors.blue[50],
  border: `1px solid ${colors.blue[100]}`,
  borderRadius: radii.md,
  padding: `${spacing.lg} ${spacing.xl}`,
  margin: `${spacing.xl} 0`,
};

export const successBoxStyle: React.CSSProperties = {
  backgroundColor: colors.green[50],
  border: `1px solid ${colors.green[100]}`,
  borderRadius: radii.md,
  padding: `${spacing.lg} ${spacing.xl}`,
  margin: `${spacing.xl} 0`,
};

export const warningBoxStyle: React.CSSProperties = {
  backgroundColor: colors.amber[50],
  border: `1px solid ${colors.amber[100]}`,
  borderRadius: radii.md,
  padding: `${spacing.lg} ${spacing.xl}`,
  margin: `${spacing.xl} 0`,
};

export const errorBoxStyle: React.CSSProperties = {
  backgroundColor: colors.red[50],
  border: `1px solid ${colors.red[100]}`,
  borderRadius: radii.md,
  padding: `${spacing.lg} ${spacing.xl}`,
  margin: `${spacing.xl} 0`,
};

// ============================================================
// TIPS / CALLOUTS
// ============================================================

export const tipBoxStyle: React.CSSProperties = {
  backgroundColor: colors.slate[50],
  border: `1px solid ${colors.slate[200]}`,
  borderLeft: `3px solid ${colors.slate[400]}`,
  borderRadius: radii.sm,
  padding: `${spacing.md} ${spacing.lg}`,
  margin: `${spacing.xl} 0`,
};

export const tipTextStyle: React.CSSProperties = {
  fontSize: typography.sizes.sm,
  lineHeight: typography.lineHeights.normal,
  color: colors.slate[600],
  margin: 0,
};

// ============================================================
// BUTTONS
// ============================================================

export const buttonContainerStyle: React.CSSProperties = {
  textAlign: 'center',
  margin: `${spacing['2xl']} 0 ${spacing.xl} 0`,
};

export const buttonStyle: React.CSSProperties = {
  backgroundColor: colors.slate[900],
  color: colors.white,
  padding: `${spacing.md} ${spacing['2xl']}`,
  borderRadius: radii.md,
  fontWeight: typography.weights.semibold,
  fontSize: typography.sizes.md,
  textDecoration: 'none',
  display: 'inline-block',
  border: 'none',
  cursor: 'pointer',
  lineHeight: typography.lineHeights.tight,
};

export const buttonPrimaryStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: colors.blue[600],
};

export const buttonOutlineStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: colors.white,
  color: colors.slate[700],
  border: `1px solid ${colors.slate[300]}`,
};

// ============================================================
// LINKS
// ============================================================

export const linkStyle: React.CSSProperties = {
  color: colors.blue[600],
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
  wordBreak: 'break-all',
};

export const linkMutedStyle: React.CSSProperties = {
  color: colors.slate[500],
  textDecoration: 'none',
  wordBreak: 'break-all',
};

// ============================================================
// DIVIDERS
// ============================================================

export const dividerStyle: React.CSSProperties = {
  borderTop: `1px solid ${colors.slate[200]}`,
  margin: `${spacing['2xl']} 0 ${spacing.lg} 0`,
  borderBottom: 'none',
  borderLeft: 'none',
  borderRight: 'none',
};

export const dividerLightStyle: React.CSSProperties = {
  borderTop: `1px solid ${colors.slate[100]}`,
  margin: `${spacing.xl} 0`,
  borderBottom: 'none',
  borderLeft: 'none',
  borderRight: 'none',
};

// ============================================================
// FOOTER
// ============================================================

export const footerContainerStyle: React.CSSProperties = {
  backgroundColor: colors.slate[50],
  borderTop: `1px solid ${colors.slate[200]}`,
  padding: `${spacing.xl} ${spacing['2xl']}`,
  textAlign: 'center',
};

export const footerLegalStyle: React.CSSProperties = {
  fontSize: typography.sizes.xs,
  lineHeight: typography.lineHeights.tight,
  color: colors.slate[400],
  margin: 0,
};

export const footerLinkStyle: React.CSSProperties = {
  fontSize: typography.sizes.xs,
  color: colors.slate[500],
  textDecoration: 'none',
  margin: `0 ${spacing.sm}`,
};

export const subLinkTextStyle: React.CSSProperties = {
  fontSize: typography.sizes.sm,
  lineHeight: typography.lineHeights.normal,
  color: colors.slate[500],
  margin: 0,
};

// ============================================================
// LISTS
// ============================================================

export const listStyle: React.CSSProperties = {
  paddingLeft: spacing.xl,
  margin: `${spacing.md} 0`,
};

export const listItemStyle: React.CSSProperties = {
  fontSize: typography.sizes.base,
  lineHeight: typography.lineHeights.relaxed,
  color: colors.slate[700],
  margin: `${spacing.xs} 0`,
};

// ============================================================
// META / UTILITY
// ============================================================

export const metaRowStyle: React.CSSProperties = {
  display: 'table',
  width: '100%',
  margin: `${spacing.sm} 0`,
};

export const metaLabelStyle: React.CSSProperties = {
  fontSize: typography.sizes.sm,
  fontWeight: typography.weights.medium,
  color: colors.slate[500],
  display: 'table-cell',
  width: '120px',
  paddingRight: spacing.md,
};

export const metaValueStyle: React.CSSProperties = {
  fontSize: typography.sizes.sm,
  fontWeight: typography.weights.semibold,
  color: colors.slate[800],
  display: 'table-cell',
};

export const spacerStyle = (height: string): React.CSSProperties => ({
  height,
  lineHeight: height,
  fontSize: '0px',
});