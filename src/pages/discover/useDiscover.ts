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
        title: t('main.podcasts'),
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
        title: t('main.discover.you_liked'),
        key: SHORTCUTS.FAV,
        icon: mdiHeart,
      },
      [SHORTCUTS.DAILY]: {
        title: t('main.discover.daily'),
        key: SHORTCUTS.DAILY,
        icon: mdiCalendarToday,
      },
      [SHORTCUTS.RADAR]: {
        title: t('main.discover.radar'),
        key: SHORTCUTS.RADAR,
        icon: mdiRadar,
      },
      [SHORTCUTS.FM]: {
        title: t('main.discover.fm'),
        key: SHORTCUTS.FM,
        icon: mdiRadio,
      },
      [SHORTCUTS.RECENT]: {
        title: t('common.recent'),
        key: SHORTCUTS.RECENT,
        icon: mdiHistory,
      },
      [SHORTCUTS.PIN]: {
        title: t('main.discover.pin'),
        key: SHORTCUTS.PIN,
        icon: mdiPlaylistMusic,
      },
    }
  })

  return {
    columns,
    cards,
  }
}
