// Utilities
import { merge } from 'lodash-es'

import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

export const useUserStore = defineStore('user', () => {
  const state = reactive({
    api: 'link-only',
    pwaRefresh: false,
    theme: 'system',
    mixedTheme: true,
    direction: 'ltr',
    notifications: {
      read: [],
      last: {
        install: null,
        notification: null,
        promotion: null,
        jobs: null,
      },
    },
  })

  function load () {

    const stored = localStorage.getItem('vuetify@user')
    const data = stored ? JSON.parse(stored) : {}

    if (typeof data.api === 'boolean') {
      data.api = data.api ? 'inline' : 'link-only'
    }
    if (typeof data.rtl === 'boolean') {
      data.direction = data.rtl ? 'rtl' : 'ltr'
      delete data.rtl
    }
    if (Array.isArray(data.notifications)) {
      data.notifications = { read: data.notifications }
    }
    if (typeof data.theme === 'object') {
      data.mixedTheme = data.theme.mixed
      data.theme = data.theme.system ? 'system'
        : data.theme.dark ? 'dark'
        : 'light'
    }
    if (typeof data.last === 'object') {
      data.notifications.last = data.last
      delete data.last
    }

    Object.assign(state, merge(state, data))
  }

  function save () {
    localStorage.setItem('vuetify@user', JSON.stringify(state, null, 2))
  }

  load()

  return { ...toRefs(state), load, save }
})
