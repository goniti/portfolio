import type { Localized } from '@/shared/lib/i18n';
import type { SectionId } from '../../model/sections';

const en = {
  navLabel: 'Main',
  ownerName: 'Carlos G. Lo Vullo',
  avatarAlt: 'Carlos',
  homeLink: 'Back to top',
  sections: {
    home: 'Home',
    experience: 'Experience',
    skills: 'Skills',
    projects: 'Projects',
    watch: 'AI & Tech Watch',
    contact: 'Contact',
  } satisfies Record<SectionId, string>,
  languageLabel: 'Language',
  languages: { en: 'EN', fr: 'FR' },
  languageNames: { en: 'English', fr: 'Français' },
  themeToLight: 'Switch to light theme',
  themeToDark: 'Switch to dark theme',
  themeGlyph: { dark: '☀', light: '☾' },
  resume: 'Resume PDF',
  downloadGlyph: '↓',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  menuGlyph: { open: '×', closed: '≡' },
};

export const siteNavMessages: Localized<typeof en> = {
  en,
  fr: {
    ...en,
    navLabel: 'Principale',
    homeLink: 'Retour en haut',
    sections: {
      home: 'Accueil',
      experience: 'Expérience',
      skills: 'Compétences',
      projects: 'Projets',
      watch: 'Veille IA',
      contact: 'Contact',
    },
    languageLabel: 'Langue',
    themeToLight: 'Passer au thème clair',
    themeToDark: 'Passer au thème sombre',
    resume: 'CV PDF',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
  },
};
