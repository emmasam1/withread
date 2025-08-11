// utils/theme.js
export const applyTheme = (theme) => {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  if (theme === 'Dark') {
    root.classList.add('dark');
  } else if (theme === 'Light') {
    root.classList.remove('dark');
  } else {
    // "System" preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  }
};
