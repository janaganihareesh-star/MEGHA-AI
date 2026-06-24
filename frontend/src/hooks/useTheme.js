import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';

export default function useTheme() {
  // Safe fallback to 'dark' if theme store isn't fully initialized yet
  const mode = useSelector((state) => state.theme?.mode || 'dark');
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return {
    mode,
    isDark: mode === 'dark',
    toggleTheme: handleToggleTheme
  };
}