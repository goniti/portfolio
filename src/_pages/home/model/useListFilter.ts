import { useMemo, useState } from 'react';

/**
 * Selected filter of a list and the items it keeps. `applyFilter` must be a stable function
 * (declared at module level).
 */
export function useListFilter<Item, Filter>(
  items: readonly Item[],
  applyFilter: (items: readonly Item[], filter: Filter) => Item[],
  initialFilter: NoInfer<Filter>,
) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const visibleItems = useMemo(() => applyFilter(items, filter), [applyFilter, filter, items]);
  return { filter, setFilter, visibleItems };
}
