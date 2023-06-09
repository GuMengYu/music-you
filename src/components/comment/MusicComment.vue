<script setup lang="ts">
import { mdiClose } from '@mdi/js'
import { useInfiniteScroll } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

import { getMusicComment } from '@/api/song'
import type { Comment } from '@/types'

const { t } = useI18n()
const hotComments = ref<Comment[]>([])
const comments = ref<Comment[]>([])
const emit = defineEmits(['update:show'])
const pagination = reactive({
  limit: 15,
  offset: 0,
  more: true,
})
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  id: {
    type: Number,
    default: 0,
  },
})
watch(
  () => props.show,
  () => {
    loadMore()
  }
)
loadMore()
const el = ref<HTMLElement | null>(null)

useInfiniteScroll(
  el,
  () => {
    loadMore()
  },
  {
    distance: 10,
  }
)

async function loadMore() {
  if (pagination.more && props.show && props.id) {
    const res = await getMusicComment(props.id, pagination.limit, pagination.offset)
    if (res.comments.length) {
      comments.value = [...comments.value, ...res.comments]
    }
    if (res.hotComments.length) {
      hotComments.value = res.hotComments
    }
    pagination.more = res.more
    if (pagination.more) {
      pagination.offset = pagination.offset + pagination.limit
    }
  }
}
function handleClose() {
  // reset
  hotComments.value = []
  comments.value = []
  pagination.offset = 0
  pagination.more = true
  emit('update:show', false)
}
</script>
<template>
  <v-dialog :model-value="show" max-width="720" persistent>
    <v-toolbar color="surface" class="rounded-t-lg px-4" height="80">
      <div class="d-flex justify-space-between align-center w-100 ml-4 no-drag-area">
        <span class="text-h6">{{ t('common.comment') }}</span>
        <v-btn icon variant="text" @click="handleClose"
          ><v-icon>{{ mdiClose }}</v-icon></v-btn
        >
      </div>
    </v-toolbar>
    <v-card ref="el" class="w-100 rounded-b-lg rounded-t-0 px-4 elevation-0" color="surface">
      <div class="mx-4">
        <div v-if="hotComments.length" class="d-flex align-center mb-2">
          <span class="text-subtitle-1 font-weight-medium mr-2">{{ t('common.hot_comment') }}</span>
        </div>
        <div class="d-flex gap-6 flex-column">
          <CommentItem v-for="comment in hotComments" :key="comment.commentId" :comment="comment"></CommentItem>
        </div>
        <div v-if="comments.length" class="d-flex align-center mt-4 mb-2">
          <span class="text-subtitle-1 font-weight-medium mr-2">{{ t('common.new_comment') }}</span>
        </div>
        <div class="d-flex flex-column">
          <CommentItem v-for="comment in comments" :key="comment.commentId" :comment="comment">
            <v-divider class="my-3" />
          </CommentItem>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
