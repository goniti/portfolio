import * as SegmentedControl from 'goniui/segmented-control';
import { tv, type VariantProps } from 'tailwind-variants';

const filterBarVariants = tv({
  slots: {
    root: 'w-auto',
    option: 'min-h-9 flex-none px-3.5 py-0 font-medium transition duration-200',
  },
  variants: {
    look: {
      segment: {
        root: 'max-w-full rounded-xl border-border bg-chip p-1',
        option: 'rounded-lg text-sm',
      },
      pill: {
        root: 'flex-wrap gap-1.5 overflow-visible border-0 bg-transparent p-0',
        option: 'rounded-full border font-mono text-xs',
      },
    },
    active: { true: {}, false: {} },
  },
  compoundVariants: [
    {
      look: 'segment',
      active: true,
      class: { option: 'bg-tint-indigo/20 text-foreground-strong shadow-segment-active' },
    },
    {
      look: 'segment',
      active: false,
      class: { option: 'bg-transparent text-foreground-muted hover:text-foreground-strong' },
    },
    {
      look: 'pill',
      active: true,
      class: { option: 'border-surface-inverse bg-surface-inverse text-foreground-inverse' },
    },
    {
      look: 'pill',
      active: false,
      class: {
        option: 'border-border-strong bg-chip text-foreground-muted hover:text-foreground-strong',
      },
    },
  ],
});

type FilterBarLook = NonNullable<VariantProps<typeof filterBarVariants>['look']>;

export interface FilterBarProps<Filter extends string> {
  /** Accessible name of the group, e.g. "Filter projects". */
  label: string;
  options: readonly Filter[];
  labels: Readonly<Record<Filter, string>>;
  value: Filter;
  onChange: (filter: Filter) => void;
  look: FilterBarLook;
}

/** Category filter of a list: one toggle button per option, the selected one pressed. */
export function FilterBar<Filter extends string>({
  label,
  options,
  labels,
  value,
  onChange,
  look,
}: FilterBarProps<Filter>) {
  const styles = filterBarVariants({ look });

  return (
    <SegmentedControl.Root aria-label={label} className={styles.root()}>
      {options.map((option) => {
        const isActive = option === value;
        return (
          <SegmentedControl.Item
            key={option}
            active={isActive}
            aria-pressed={isActive}
            onClick={() => onChange(option)}
            className={styles.option({ active: isActive })}
          >
            {labels[option]}
          </SegmentedControl.Item>
        );
      })}
    </SegmentedControl.Root>
  );
}
