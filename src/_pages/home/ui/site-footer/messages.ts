import type { Localized } from '@/shared/lib/i18n';

// The status lines and the credits are content (Sanity `siteSettings`).
const en = {
  nextCredit: 'Show another credit',
};

export const siteFooterMessages: Localized<typeof en> = {
  en,
  fr: {
    nextCredit: 'Afficher un autre crédit',
  },
};
