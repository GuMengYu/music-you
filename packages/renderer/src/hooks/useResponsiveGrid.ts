import { ref, watchEffect } from 'vue'
import { useDisplay } from 'vuetify'

enum DisplayBreakpoint {
  'XS' = 'xs',
  'SM' = 'sm',
  'MD' = 'md',
  'LG' = 'lg',
  'XL' = 'xl',
  'XXL' = 'xxl',
}
export enum GridType {
  A,
  B,
  C,
}
const GridTypeToGap = {
  [GridType.A]: {
    [DisplayBreakpoint.XS]: { columnCount: 1, gap: '10px' },
    [DisplayBreakpoint.SM]: { columnCount: 2, gap: '18px' },
    [DisplayBreakpoint.MD]: { columnCount: 3, gap: '24px' },
    [DisplayBreakpoint.LG]: { columnCount: 4, gap: '24px' },
    [DisplayBreakpoint.XL]: { columnCount: 5, gap: '24px' },
    [DisplayBreakpoint.XXL]: { columnCount: 8, gap: '24px' },
  },
  [GridType.B]: {
    [DisplayBreakpoint.XS]: { columnCount: 1, gap: '10px' },
    [DisplayBreakpoint.SM]: { columnCount: 2, gap: '18px' },
    [DisplayBreakpoint.MD]: { columnCount: 2, gap: '24px' },
    [DisplayBreakpoint.LG]: { columnCount: 2, gap: '24px' },
    [DisplayBreakpoint.XL]: { columnCount: 3, gap: '24px' },
    [DisplayBreakpoint.XXL]: { columnCount: 4, gap: '24px' },
  },
  [GridType.C]: {
    [DisplayBreakpoint.XS]: { columnCount: 1, gap: '12px' },
    [DisplayBreakpoint.SM]: { columnCount: 1, gap: '12px' },
    [DisplayBreakpoint.MD]: { columnCount: 1, gap: '12px' },
    [DisplayBreakpoint.LG]: { columnCount: 1, gap: '12px' },
    [DisplayBreakpoint.XL]: { columnCount: 2, gap: '24px' },
    [DisplayBreakpoint.XXL]: { columnCount: 2, gap: '24px' },
  },
}

export function useResponsiveGrid(type: GridType) {
  const display = useDisplay()
  const count = ref<number>(1)
  const gap = ref<string>('12px')
  watchEffect(() => {
    const name = display.name.value
    const { columnCount, gap: gapValue } = GridTypeToGap[type][name]
    count.value = columnCount
    gap.value = gapValue
  })
  return {
    count,
    gap,
  }
}
