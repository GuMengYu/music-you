import { mdiCalendarToday, mdiHeart, mdiHistory, mdiPlaylistMusic, mdiRadar, mdiRadio } from '@mdi/js'
import { useI18n } from 'vue-i18n'

import { COLUMNS, SHORTCUTS } from '@/store/homeConfig'

export function useDefinedItems() {
  const { t } = useI18n()

  const columns = computed(() => {
    return {
      [COLUMNS.CUSTOM]: {
        title: t('main.for_you'),
        key: COLUMNS.CUSTOM,
      },
      [COLUMNS.PODCAST]: {
        title: '播客',
        key: COLUMNS.PODCAST,
      },
      [COLUMNS.RADAR]: {
        title: t('main.radar'),
        key: COLUMNS.RADAR,
      },
      [COLUMNS.NEW_MUSIC]: {
        title: t('main.discover.recommend_songs'),
        key: COLUMNS.NEW_MUSIC,
      },
    }
  })

  const cards = computed(() => {
    return {
      [SHORTCUTS.FAV]: {
        text: t('main.discover.you_liked'),
        value: SHORTCUTS.FAV,
        icon: mdiHeart,
      },
      [SHORTCUTS.DAILY]: {
        text: t('main.discover.daily'),
        value: SHORTCUTS.DAILY,
        icon: mdiCalendarToday,
      },
      [SHORTCUTS.RADAR]: {
        text: t('main.discover.radar'),
        value: SHORTCUTS.RADAR,
        icon: mdiRadar,
      },
      [SHORTCUTS.FM]: {
        text: t('main.discover.fm'),
        value: SHORTCUTS.FM,
        icon: mdiRadio,
      },
      [SHORTCUTS.RECENT]: {
        text: t('common.recent'),
        value: SHORTCUTS.RECENT,
        icon: mdiHistory,
      },
      [SHORTCUTS.PIN]: {
        text: t('main.discover.pin'),
        value: SHORTCUTS.PIN,
        icon: mdiPlaylistMusic,
      },
    }
  })

  return {
    columns,
    cards,
  }
}
