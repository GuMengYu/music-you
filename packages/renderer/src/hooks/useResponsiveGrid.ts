import { ref, watchEffect } from 'vue'

import { DisplayBreakpoint, useSematicBreakPoint } from './useBreakpoint'

export enum GridType {
  A,
  B,
  C,
}

const GridTypeToGap = {
  [GridType.A]: {
    [DisplayBreakpoint.xxs]: { columnCount: 1, gap: '8px' },
    [DisplayBreakpoint.xs]: { columnCount: 2, gap: '8px' },
    [DisplayBreakpoint.sm]: { columnCount: 3, gap: '16px' },
    [DisplayBreakpoint.md]: { columnCount: 4, gap: '16px' },
    [DisplayBreakpoint.lg]: { columnCount: 5, gap: '16px' },
    [DisplayBreakpoint.xl]: { columnCount: 6, gap: '24px' },
    [DisplayBreakpoint.xll]: { columnCount: 7, gap: '24px' },
    [DisplayBreakpoint.desktop4K]: { columnCount: 8, gap: '24px' },
  },
  [GridType.B]: {
    [DisplayBreakpoint.xxs]: { columnCount: 1, gap: '8px' },
    [DisplayBreakpoint.xs]: { columnCount: 2, gap: '8px' },
    [DisplayBreakpoint.sm]: { columnCount: 2, gap: '16px' },
    [DisplayBreakpoint.md]: { columnCount: 2, gap: '16px' },
    [DisplayBreakpoint.lg]: { columnCount: 3, gap: '16px' },
    [DisplayBreakpoint.xl]: { columnCount: 4, gap: '24px' },
    [DisplayBreakpoint.xll]: { columnCount: 4, gap: '24px' },
    [DisplayBreakpoint.desktop4K]: { columnCount: 4, gap: '24px' },
  },
  [GridType.C]: {
    [DisplayBreakpoint.xxs]: { columnCount: 1, gap: '12px' },
    [DisplayBreakpoint.xs]: { columnCount: 1, gap: '12px' },
    [DisplayBreakpoint.sm]: { columnCount: 1, gap: '12px' },
    [DisplayBreakpoint.md]: { columnCount: 1, gap: '12px' },
    [DisplayBreakpoint.lg]: { columnCount: 2, gap: '24px' },
    [DisplayBreakpoint.xl]: { columnCount: 2, gap: '24px' },
    [DisplayBreakpoint.xll]: { columnCount: 2, gap: '24px' },
    [DisplayBreakpoint.desktop4K]: { columnCount: 2, gap: '24px' },
  },
}
export function useResponsiveGrid(type: GridType) {
  const { breakname } = useSematicBreakPoint()
  const count = ref<number>(1)
  const gap = ref<string>('12px')
  watchEffect(() => {
    const name = breakname.value
    const { columnCount, gap: gapValue } = GridTypeToGap[type][name]
    count.value = columnCount
    gap.value = gapValue
  })
  return {
    count,
    gap,
  }
}
