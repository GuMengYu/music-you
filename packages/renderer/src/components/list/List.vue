<template>
  <v-list v-model:active="active" v-model:opened="opened" density="compact" :nav="nav" :items="computedItems" />
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

function generateItems(item, path, locale, t) {
  if (item.items) {
    return item.items.map((child) => {
      return {
        title: t(child.title),
        $children: generateItems(child, path, locale, t),
      }
    })
  }

  return undefined
}

export default defineComponent({
  name: 'AppList',

  props: {
    items: {
      type: Array,
      default: () => [],
    },
    nav: Boolean,
  },

  setup(props) {
    const { t, te, locale } = useI18n()
    const active = ref([])
    const opened = ref([])

    const computedItems = computed(() =>
      props.items?.map((item) => {
        if (item.heading) return { $type: 'subheader', text: item.heading }
        if (item.divider) return { $type: 'divider' }

        return {
          title: item.title && te(item.title) ? t(item.title) : item.title,
          prependIcon: opened.value.includes(item.title) ? item.activeIcon : item.inactiveIcon,
          value: item.title,
          $children: generateItems(item, item.title, locale.value, t),
        }
      })
    )

    return {
      computedItems,
      active,
      opened,
    }
  },
})
</script>
