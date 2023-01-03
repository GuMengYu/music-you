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

const state = reactive<{
  showMore: boolean
  comments: Comment[]
  hotComments: Comment[]
  hasMore: boolean
}>({
  showMore: false,
  comments: [],
  hotComments: [],
  hasMore: false,
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
    const res = await service(props.id)
    state.comments = res.comments
    state.hotComments = res.hotComments
    state.hasMore = res.more
  }
})
// coding here
</script>
<template>
  <div>
    <div v-if="state.hotComments.length" class="d-flex align-center">
      <span class="text-subtitle-1 font-weight-medium mr-2">{{ t('common.hot_comment') }}</span>
    </div>
    <div class="d-flex gap-6 flex-column">
      <CommentItem v-for="comment in state.hotComments" :key="comment.commentId" :comment="comment"></CommentItem>
    </div>
    <v-divider class="my-4" />
    <div v-if="state.comments.length" class="d-flex align-center">
      <span class="text-subtitle-1 font-weight-medium mr-2">{{ t('common.new_comment') }}</span>
      <v-btn icon variant="text" @click="state.showMore = true">
        <v-icon>{{ mdiArrowRight }}</v-icon>
      </v-btn>
    </div>
    <div class="d-flex gap-6 flex-column">
      <CommentItem v-for="comment in state.comments" :key="comment.commentId" :comment="comment"></CommentItem>
      <v-btn
        v-if="state.hasMore"
        color="primary"
        variant="text"
        width="120"
        class="mt-n4"
        @click="state.showMore = true"
        >{{ t('common.more_comment') }}</v-btn
      >
    </div>
    <CommentModal :id="id" v-model:show="state.showMore" :type="type" :comments="state.comments" />
  </div>
</template>
