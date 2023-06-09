<script lang="ts" setup>
import { mdiAlert, mdiBellAlert, mdiBellBadge } from '@mdi/js'

const tips = [
  {
    text: '通过ctrl + r / ⌘ + r 可以刷新重启应用，可以解决一部分问题。',
  },
  {
    text: '无版权歌曲从其他音乐平台获取音源并尝试播放，不保证准确性和可用性哟',
  },
]
const content = ref('')
onMounted(() => {
  const index = Math.round(Math.random() * (tips.length - 1))
  content.value = tips[index].text
})
// coding here
</script>
<template>
  <v-alert
    border="start"
    variant="tonal"
    closable
    close-label="小贴士"
    color="primary"
    class="text-caption"
    density="compact"
  >
    <h2 class="text-body-2 d-flex align-center gap-1">
      <v-icon size="x-small">{{ mdiBellBadge }}</v-icon
      >小贴士
    </h2>
    {{ content }}
  </v-alert>
</template>
