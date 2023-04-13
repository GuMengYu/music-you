<script setup lang="ts">
import { mdiClose } from '@mdi/js'
import { useInfiniteScroll } from '@vueuse/core'
import type { PropType } from 'vue'
import { useI18n } from 'vue-i18n'

import { getAlbumComment } from '@/api/album'
import { getMVComment } from '@/api/mv'
import { getPlayListComment } from '@/api/playlist'
import { getMusicComment } from '@/api/song'
import type { Comment } from '@/types'

const { t } = useI18n()
const moreComments = ref<Comment[]>([])

const emit = defineEmits(['update:show'])
const pagination = reactive({
  limit: 15,
  offset: 0,
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
  type: {
    type: String as PropType<'album' | 'playlist' | 'music' | 'mv'>,
    default: 'album',
  },
  comments: {
    type: Array as PropType<Comment[]>,
    default: () => [],
  },
})

const el = ref<HTMLElement | null>(null)
const commentList = computed(() => {
  return [...props.comments, ...moreComments.value]
})
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
  const service = {
    album: getAlbumComment,
    playlist: getPlayListComment,
    music: getMusicComment,
    mv: getMVComment,
  }[props.type]
  pagination.offset = pagination.offset + pagination.limit
  const res = await service(props.id, pagination.limit, pagination.offset)
  if (res.comments.length) {
    moreComments.value = [...moreComments.value, ...res.comments]
  }
}
function handleClose() {
  // clean
  moreComments.value = []
  pagination.offset = 0
  emit('update:show', false)
}
</script>
<template>
  <v-dialog :model-value="show" max-width="720" persistent>
    <v-toolbar color="surface" class="rounded-t-lg px-4" height="80">
      <div class="d-flex justify-space-between align-center w-100 ml-4">
        <span class="text-h6">{{ t('common.comment') }}</span>
        <v-btn class="no-drag-area" icon variant="text" @click="handleClose"
          ><v-icon>{{ mdiClose }}</v-icon></v-btn
        >
      </div>
    </v-toolbar>
    <v-card ref="el" class="w-100 rounded-b-lg rounded-t-0 px-4 elevation-0" color="surface">
      <div class="mx-4">
        <div class="d-flex flex-column">
          <CommentItem v-for="comment in commentList" :key="comment.commentId" :comment="comment">
            <v-divider class="my-3" />
          </CommentItem>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
