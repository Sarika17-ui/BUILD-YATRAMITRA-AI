// useLanguage.js – thin wrapper around AppContext for easy imports
import { useApp } from '../context/AppContext';

export const useLanguage = () => {
  const { language, toggleLanguage, t } = useApp();
  return { language, toggleLanguage, t };
};
