import { computed } from 'vue'
import { useSettingStore } from "@/store/setting"
import { usePreferredDark } from '@vueuse/core'
export function useTheme() {
    const isDark = usePreferredDark()
    const settingStore = useSettingStore();

    const theme = computed(() => {
        let suffix = ''
        false ? false : 
        settingStore.appearance === 'system' ? suffix = isDark.value ? 'Dark' : 'Light' : 
        settingStore.appearance === 'light' ? suffix = 'Light' : 
        settingStore.appearance === 'dark' ? suffix = 'Dark' : false
        return `${settingStore.wallpaperColor}${suffix}`
    });
    return theme
}