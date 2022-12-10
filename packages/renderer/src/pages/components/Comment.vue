<script lang="ts" setup>
import { mdiArrowRight, mdiDotsVertical } from '@mdi/js'
import type { PropType } from 'vue'
import { useI18n } from 'vue-i18n'

import { getAlbumComment } from '@/api/album'
import { getMVComment } from '@/api/mv'
import { getPlayListComment } from '@/api/playlist'
import { getMusicComment } from '@/api/song'
import type { Comment } from '@/types'

import CommentItem from './CommentItem.vue'
const { t } = useI18n()

const pagination = reactive({
  limit: 20,
  offset: 0,
})
const state = reactive<{
  comments: Comment[]
  hotComments: Comment[]
}>({
  comments: [],
  hotComments: [],
})

const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
  type: {
    type: String as PropType<'album' | 'playlist' | 'music' | 'mv'>,
    default: 'album',
  },
})
watchEffect(async () => {
  if (props.id) {
    const service = {
      album: getAlbumComment,
      playlist: getPlayListComment,
      music: getMusicComment,
      mv: getMVComment,
    }[props.type]
    const res = await service(props.id, pagination.limit, pagination.offset)
    state.comments = res.comments
    state.hotComments = res.hotComments
  }
})
// coding here
</script>
<template>
  <div>
    <div class="d-flex align-center">
      <span class="font-weight-medium mr-2">{{ t('common.hot_comment') }}</span>
      <v-btn icon variant="text">
        <v-icon>{{ mdiArrowRight }}</v-icon>
      </v-btn>
    </div>
    <div class="d-flex gap-6 flex-column">
      <CommentItem v-for="comment in state.hotComments" :key="comment.commentId" :comment="comment"></CommentItem>
    </div>
    <v-divider class="my-6" />
    <div class="d-flex align-center">
      <span class="font-weight-medium mr-2">{{ t('common.new_comment') }}</span>
      <v-btn icon variant="text">
        <v-icon>{{ mdiArrowRight }}</v-icon>
      </v-btn>
    </div>
    <div class="d-flex gap-6 flex-column">
      <CommentItem v-for="comment in state.comments" :key="comment.commentId" :comment="comment"></CommentItem>
    </div>
  </div>
</template>
