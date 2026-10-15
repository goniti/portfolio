import { Button } from 'goniui';
import { tv, type VariantProps } from 'tailwind-variants';
import { useMessages } from '@/shared/lib/i18n';
import { useTheme } from '@/shared/lib/theme';
import { siteNavMessages } from './messages';

export const navControlVariants = tv({
  base: 'flex-none border border-border bg-chip text-foreground-soft hover:border-border-strong hover:text-foreground-strong',
  variants: {
    size: {
      md: 'size-9 rounded-full text-base',
      lg: 'size-11 rounded-xl text-base',
    },
  },
  defaultVariants: { size: 'md' },
});

export interface ThemeToggleProps {
  size?: VariantProps<typeof navControlVariants>['size'];
}

/** Switches between the dark and light themes. */
export function ThemeToggle({ size }: ThemeToggleProps) {
  const copy = useMessages(siteNavMessages);
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="unstyled"
      size="none"
      aria-label={theme === 'dark' ? copy.themeToLight : copy.themeToDark}
      onClick={toggleTheme}
      className={navControlVariants({ size })}
    >
      <span aria-hidden="true">{copy.themeGlyph[theme]}</span>
    </Button>
  );
}
