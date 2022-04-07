<template>
  <app-settings-group v-model="model" title="common.theme" :items="items" multiple />
  <v-divider class="my-3 mx-n3" />
  <app-settings-group v-model="model" title="common.theme_color" :items="colorItems" multiple />
</template>

<script>
  import { computed } from 'vue'
  import { useUserStore } from '@/store/user'
  import AppSettingsGroup from './Group.vue'
  import { mdiWhiteBalanceSunny, mdiWeatherNight, mdiDesktopTowerMonitor, mdiThemeLightDark } from '@mdi/js'

  export default {
    name: 'AppSettingsTheme',

    components: { AppSettingsGroup },

    setup () {
      const user = useUserStore()

      const items = computed(() => ([
        {
          text: 'common.light',
          icon: mdiWhiteBalanceSunny,
        },
        {
          text: 'common.dark',
          icon: mdiWeatherNight,
        },
        {
          text: 'common.auto',
          icon: mdiDesktopTowerMonitor,
        },
        {
          text: 'common.mixed',
          icon: mdiThemeLightDark,
        },
      ]))

      const colorItems = [{
          text: 'common.light',
          icon: mdiWhiteBalanceSunny,
        },
        {
          text: 'common.dark',
          icon: mdiWeatherNight,
        },
        {
          text: 'common.auto',
          icon: mdiDesktopTowerMonitor,
        },
        {
          text: 'common.mixed',
          icon: mdiThemeLightDark,
        },]
      const model = computed({
        get () {
          return [user.theme].concat(user.mixedTheme ? 'mixed' : [])
        },
        set (val) {
          {
            const idx = val.indexOf('mixed')
            user.mixedTheme = !!~idx
            if (~idx) {
              val.splice(idx, 1)
            }
          }
          {
            const idx = val.indexOf(user.theme)
            if (~idx) {
              val.splice(idx, 1)
            }
            if (val.length) {
              user.theme = val[0]
            }
          }
        },
      })

      return {
        items,
        user,
        model,
        colorItems,
      }
    },
  }
</script>
