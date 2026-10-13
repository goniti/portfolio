import Image from 'next/image';
import { Link } from 'goniui';
import { tv, type VariantProps } from 'tailwind-variants';
import { withBasePath } from '@/shared/lib/base-path';

const avatarLinkVariants = tv({
  base: 'block flex-none rounded-full bg-linear-135 from-tint-indigo-strong to-tint-cyan p-0.5',
  variants: {
    size: {
      md: 'size-9.5 shadow-avatar',
      lg: 'size-10',
    },
  },
  defaultVariants: { size: 'md' },
});

export interface AvatarLinkProps extends VariantProps<typeof avatarLinkVariants> {
  href: string;
  /** Accessible name of the link. */
  label: string;
  onClick?: () => void;
}

/** Round portrait in a gradient ring, linking back to the top of the page. */
export function AvatarLink({ href, label, size, onClick }: AvatarLinkProps) {
  return (
    <Link
      href={href}
      kind="internal"
      variant="unstyled"
      aria-label={label}
      onClick={onClick}
      className={avatarLinkVariants({ size })}
    >
      <Image
        src={withBasePath('/carlos.png')}
        alt=""
        width={80}
        height={80}
        priority
        className="size-full rounded-full bg-surface-2 object-cover"
      />
    </Link>
  );
}
