export const DARK_THEME = {
  bg: {
    primary:   '#0D0D1A',   // deepest night background
    secondary: '#13132B',   // card surface
    tertiary:  '#1A1A3E',   // elevated panel
    overlay:   'rgba(13,13,26,0.85)'
  },
  text: {
    primary:   '#EEF0FF',   // main readable text
    secondary: '#A0A8D0',   // muted text
    accent:    '#A78BFA',   // violet accent text
  },
  border: { default:'#2A2A5A', accent:'#7C3AED', subtle:'#1E1E4A' },
  accent: {
    violet:'#7C3AED', rose:'#F43F5E', cyan:'#06B6D4',
    amber:'#F59E0B',  emerald:'#10B981', indigo:'#4F46E5', fuchsia:'#D946EF'
  },
  shadow: { card:'0 4px 24px rgba(124,58,237,0.18)' }
};

export const LIGHT_THEME = {
  bg: {
    primary:   '#F0F2FF',   // soft lavender white
    secondary: '#FFFFFF',   // pure white card
    tertiary:  '#E8EBFF',   // soft blue panel
    overlay:   'rgba(240,242,255,0.85)'
  },
  text: {
    primary:   '#1E1B4B',   // deep indigo text (readable)
    secondary: '#4B5563',   // medium gray muted
    accent:    '#7C3AED',   // violet accent
  },
  border: { default:'#C5CAF0', accent:'#7C3AED', subtle:'#DDE0F5' },
  accent: {
    violet:'#7C3AED', rose:'#E11D48', cyan:'#0891B2',
    amber:'#D97706',  emerald:'#059669', indigo:'#4338CA', fuchsia:'#C026D3'
  },
  shadow: { card:'0 4px 24px rgba(124,58,237,0.10)' }
};