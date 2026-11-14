export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';

/**
 * Runs inline in <head> before first paint, so the saved (or system) theme is
 * applied without a flash. Keep in sync with resolveTheme() below.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})()`;

export function resolveTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme, persist = false) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
  }
}

// useSyncExternalStore plumbing: the <html> class list is the source of truth.
export function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

export const getIsDark = () => document.documentElement.classList.contains('dark');
export const getIsDarkOnServer = () => false;
