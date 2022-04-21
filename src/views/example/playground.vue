<template>
  <v-container class="pa-4">
    <div style="width: 200px;">
      <Cover :data="cover" />
    </div>
  </v-container>

</template>

<script lang="ts">
import Cover from "@components/app/cover/Cover.vue";
export default {
  components: {Cover},
  data: () => ({
    cover: {
      id: 12313,
      name: '封面名称',
      copywriter: '小编推荐',
      picUrl: 'https://images.unsplash.com/photo-1429514513361-8fa32282fd5f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3264&q=80',
    },
    icons: ['mdi-rewind', 'mdi-play', 'mdi-fast-forward'],
    items: [
      {
        title: 'New Releases',
        text: `It's New Release Friday`,
        subtext: 'Newly released songs. Updated daily.',
        img: 'https://images.unsplash.com/photo-1429514513361-8fa32282fd5f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3264&q=80',
      },
      {
        title: 'Rock',
        text: 'Greatest Rock Hits',
        subtext: 'Lose yourself in rock tunes.',
        img: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80',
      },
      {
        title: 'Mellow Moods',
        text: 'Ambient Bass',
        subtext: 'Chill beats to mellow you out.',
        img: 'https://images.unsplash.com/photo-1542320868-f4d80389e1c4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3750&q=80',
      },
    ],
    transparent: 'rgba(255, 255, 255, 0)',
  }),
}
</script>