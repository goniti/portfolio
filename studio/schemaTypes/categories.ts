import {
  NOTE_CATEGORIES,
  PROJECT_CATEGORIES,
  type NoteCategory,
  type ProjectCategory,
} from 'portfolio-content-model';

const PROJECT_CATEGORY_TITLES = {
  react: 'React',
  vue: 'Vue',
  mobile: 'Mobile',
  'full-stack': 'Full-Stack',
  'side-projects': 'Side Projects',
} satisfies Record<ProjectCategory, string>;

const NOTE_CATEGORY_TITLES = {
  ai: 'AI',
  'front-end': 'Front-End',
  architecture: 'Architecture',
  ux: 'UX',
} satisfies Record<NoteCategory, string>;

export const PROJECT_CATEGORY_OPTIONS = PROJECT_CATEGORIES.map((value) => ({
  title: PROJECT_CATEGORY_TITLES[value],
  value,
}));

export const NOTE_CATEGORY_OPTIONS = NOTE_CATEGORIES.map((value) => ({
  title: NOTE_CATEGORY_TITLES[value],
  value,
}));
