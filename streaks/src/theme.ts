export type ThemeName = 'volt' | 'magenta' | 'cyan';

export const THEMES: Record<ThemeName, { accent: string; accent2: string; pro: boolean }> = {
  volt: { accent: '#B6FF3B', accent2: '#2BFF88', pro: false },
  magenta: { accent: '#FF3DF2', accent2: '#7A5CFF', pro: true },
  cyan: { accent: '#2BE4FF', accent2: '#3B6CFF', pro: true },
};

export const colors = {
  bg: '#07070A',
  card: '#101016',
  border: '#1E1E28',
  text: '#F4F4F8',
  muted: '#7C7C8C',
  dim: '#2A2A36',
};

export const FONT = { black: '900' as const, bold: '700' as const };
