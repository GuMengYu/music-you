<script lang="ts" setup>
// coding here
import {
  mdiArrowRight,
  mdiBookmarkPlusOutline,
  mdiBookmarkRemoveOutline,
  mdiClose,
  mdiDelete,
  mdiDeleteAlert,
  mdiFilterVariant,
  mdiImage,
  mdiPlaylistMusicOutline,
  mdiPlayOutline,
  mdiRename,
} from '@mdi/js'
import { useIpcRenderer } from '@vueuse/electron'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useDisplay } from 'vuetify'

import { sub } from '@/api/music'
import { deletePlayList, updatePlaylist } from '@/api/playlist'
import PinBtn from '@/components/button/PinBtn.vue'
import { useDownload } from '@/hooks/useDownload'
import { usePlayer } from '@/player/player'
import dayjs from '@/plugins/dayjs'
import { usePlayQueueStore } from '@/store/playQueue'
import { useUserStore } from '@/store/user'
import type { Playlist } from '@/types'
import { formatDuring, formatNumber } from '@/util/fn'
import { mdiNetEase } from '@/util/icons'
import is from '@/util/is'
import { specialType } from '@/util/metadata'
const { smAndUp } = useDisplay()
const { t } = useI18n()
const toast = useToast()
const playQueueStore = usePlayQueueStore()
const player = usePlayer()
const subscribed = ref(false)
const isDelete = ref(false)
const showDeleteAlert = ref(false)
const showMoreDesc = ref(false)
const showEdit = ref(false)
const userStore = useUserStore()

const props = defineProps<{
  playlist: Playlist
}>()

const playLoading = ref(false)

const editForm = reactive({
  title: '',
  description: '',
  tags: [] as string[],
})

const tracksDt = computed(() => {
  return props.playlist?.tracks?.reduce((p, c: any) => p + c.dt, 0)
})

const createdBySelf = computed(() => {
  return userStore.account?.profile.userId === props.playlist.creator?.userId
})

// 特殊歌单“喜欢的音乐”
const isMyFavPlayList = computed(() => {
  return props.playlist.specialType === specialType.fav.type
})
const official = computed(() => {
  return !!props.playlist.officialPlaylistType
})

watchEffect(() => {
  subscribed.value = props.playlist.subscribed
})
async function play() {
  if (props.playlist) {
    playLoading.value = true
    playQueueStore.updatePlayQueue(props.playlist.id, 'playlist', props.playlist.name, props.playlist.tracks)
    player.next()
    setTimeout(() => {
      playLoading.value = false
    }, 1000)
  }
}

async function subscribe() {
  const { id } = props.playlist
  const { code, message } = await sub('playlist', id, subscribed.value ? 0 : 1)
  if (code === 200) {
    subscribed.value = !subscribed.value
    toast.success(t('message.sub_msg', subscribed.value ? 1 : 2))
  } else {
    toast.error(message)
  }
}
async function del() {
  const { code, message } = await deletePlayList(+props.playlist.id)
  if (code === 200) {
    toast.success(t('message.delete_list', 2))
    isDelete.value = true
    showDeleteAlert.value = false
  } else {
    toast.error(message)
  }
}

async function edit() {
  const { code } = await updatePlaylist(props.playlist.id, editForm.title, editForm.description, editForm.tags)
  if (code === 200) {
    showEdit.value = false
    // state.playlist.description = editForm.description
    // state.playlist.tags = editForm.tags
    // state.playlist.name = editForm.title
  }
  // fetch(+props.id, true)
}

function cancel() {
  reset()
  showEdit.value = false
}
const reset = () => {
  editForm.title = props.playlist.name
  editForm.description = props.playlist.description
  editForm.tags = props.playlist.tags ?? []
}
reset()

function goto() {
  const url = `https://music.163.com/#/playlist?id=${props.playlist.id}`
  if (is.electron()) {
    const ipcRenderer = useIpcRenderer()
    ipcRenderer.invoke('open-url', url)
  } else {
    window.open(url, '_blank')
  }
}

function formatDate(date: number | string, format = 'YYYY-MM-DD') {
  return dayjs(date).format(format)
}

function saveCover() {
  const url = props.playlist.picUrl ?? props.playlist.coverImgUrl
  useDownload(url)
}
</script>
<template>
  <div class="d-flex flex-column gap-6">
    <div class="drag-area d-flex justify-space-between mx-n4 mt-n4" :class="smAndUp ? '' : 'flex-column'">
      <v-img
        :src="playlist['coverImgUrl']"
        cover
        :aspect-ratio="28 / 9"
        :gradient="`90deg, rgba(var(--v-theme-surface), 0.7) 0%, rgb(0 0 0 / 0%) 20%, rgb(0 0 0 / 0%) 80%, rgba(var(--v-theme-surface), 0.7) 100%`"
      >
        <div
          class="d-flex flex-column h-100"
          :class="smAndUp ? 'order-1' : 'order-2'"
          :style="{
            background: 'linear-gradient(360deg, rgba(var(--v-theme-surface), 1) 0%,rgba(0,0,0,0) 100%)',
          }"
        >
          <back-btn class="align-self-start mb-auto mx-4 mt-4" variant="tonal" color="primary" />
          <div class="no-drag-area">
            <div class="d-flex flex-column gap-2 mx-6 mb-2">
              <span
                class="text-h4 text-lg-h3 text-xl-h3 text-xxl-h2 font-weight-medium line-clamp-2 select-text"
                :class="{
                  'pr-6': smAndUp,
                  'text-center': !smAndUp,
                }"
                >{{ playlist.name }}</span
              >
              <div class="d-flex flex-column">
                <span class="text-body-1 font-weight-medium text-primary">
                  {{ playlist['creator']?.nickname }}
                </span>
                <span class="text-caption text-disabled">
                  {{ formatDate(playlist['createTime'], 'LL') }}
                </span>
              </div>
              <div class="d-flex py-2" :class="{ 'justify-center': !smAndUp }">
                <div class="d-flex flex-column align-center pr-4" :style="{ minWidth: '96px' }">
                  <span class="text-body-1 font-weight-medium">{{ playlist['trackCount'] }}</span>
                  <span class="text-disabled text-caption"> 首 </span>
                </div>
                <v-divider class="my-2" vertical />
                <div class="d-flex flex-column align-center px-4" :style="{ minWidth: '96px' }">
                  <span class="text-body-1 font-weight-medium">
                    <v-icon size="small">{{ mdiPlaylistMusicOutline }} </v-icon>
                  </span>
                  <span class="text-disabled text-caption">歌单</span>
                </div>
                <v-divider class="my-2" vertical />

                <div class="d-flex flex-column align-center px-4" :style="{ minWidth: '96px' }">
                  <span class="text-body-1 font-weight-medium">{{ formatDuring(tracksDt) }}</span>
                  <span class="text-disabled text-caption">时长</span>
                </div>
                <v-divider class="my-2" vertical />

                <div class="d-flex flex-column align-center pl-4" :style="{ minWidth: '96px' }">
                  <span class="text-body-1 font-weight-medium">{{ formatNumber(playlist['playCount']) }}</span>
                  <span class="text-disabled text-caption">次</span>
                </div>
              </div>
              <div class="d-flex align-center">
                <v-btn
                  size="large"
                  class="mr-4 px-10 rounded-pill"
                  variant="tonal"
                  color="primary"
                  :loading="playLoading as boolean"
                  @click="play"
                >
                  <v-icon size="large">{{ mdiPlayOutline }}</v-icon>
                </v-btn>
                <template v-if="createdBySelf && !isMyFavPlayList">
                  <v-btn icon class="mr-4" color="secondary" variant="tonal" @click="showEdit = true">
                    <v-icon color="secondary">
                      {{ mdiRename }}
                    </v-icon>
                  </v-btn>
                  <v-dialog v-model="showDeleteAlert" persistent>
                    <template #activator="{ props: dialogProps }">
                      <v-btn
                        class="mr-4"
                        icon
                        color="error"
                        v-bind="dialogProps"
                        variant="tonal"
                        :disabled="isDelete as boolean"
                      >
                        <v-icon>{{ mdiDelete }}</v-icon>
                      </v-btn>
                    </template>
                    <v-card class="pt-4 align-self-center" rounded="xl" color="surface" width="90vw" max-width="350">
                      <div class="d-flex justify-center">
                        <v-icon color="secondary">
                          {{ mdiDeleteAlert }}
                        </v-icon>
                      </div>
                      <v-card-title class="text-center">{{ t('message.delete_list', 1) }}</v-card-title>
                      <v-card-subtitle class="text-center">{{ t('message.delete_list_alert') }}</v-card-subtitle>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" variant="plain" @click="showDeleteAlert = false">
                          {{ t('common.disagree') }}
                        </v-btn>
                        <v-btn color="primary" variant="plain" @click="del"> {{ t('common.agree') }} </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </template>
                <v-btn
                  v-else-if="!isMyFavPlayList"
                  class="mr-4"
                  icon
                  variant="tonal"
                  color="secondary"
                  @click="subscribe"
                >
                  <v-icon>
                    {{ subscribed ? mdiBookmarkRemoveOutline : mdiBookmarkPlusOutline }}
                  </v-icon>
                  <v-tooltip activator="parent" location="top">
                    {{ t('common.collection', subscribed ? 2 : 1) }}
                  </v-tooltip>
                </v-btn>
                <v-btn class="mr-4" icon variant="tonal" color="tertiary" @click="goto">
                  <v-icon>
                    {{ mdiNetEase }}
                  </v-icon>
                </v-btn>
                <pin-btn :data="playlist" type="playlist" />
              </div>
            </div>
          </div>
        </div>
      </v-img>
      <!--      <Cover-->
      <!--        :class="smAndUp ? 'order-2' : 'order-1 align-self-center'"-->
      <!--        :data="playlist"-->
      <!--        no-info-->
      <!--        shadow-->
      <!--        type="playlist"-->
      <!--        :max-width="225"-->
      <!--        :min-width="225"-->
      <!--        :max-height="225"-->
      <!--        :min-height="225"-->
      <!--      >-->
      <!--        <template #action>-->
      <!--          <v-btn icon variant="flat" color="primary" @click="saveCover">-->
      <!--            <v-icon color="onPrimary">{{ mdiImage }} </v-icon>-->
      <!--            <v-tooltip activator="parent" location="top"> 保存封面 </v-tooltip>-->
      <!--          </v-btn>-->
      <!--        </template>-->
      <!--      </Cover>-->
    </div>
    <div v-if="playlist['description']" class="d-flex flex-column mx-2">
      <div class="d-flex align-center">
        <span class="font-weight-medium mr-2 text-h6">{{ t('main.playlist.about') }}</span>
        <v-btn icon variant="text" @click="showMoreDesc = true">
          <v-icon>{{ mdiArrowRight }}</v-icon>
        </v-btn>
      </div>
      <p class="text-caption line-clamp-5 select-text">
        {{ playlist['description'] }}
      </p>
    </div>
    <div class="d-flex flex-column mx-2">
      <div class="d-flex align-center">
        <span class="font-weight-medium mr-2 text-h6">{{ t('main.playlist.inner') }}</span>
        <v-btn icon variant="text">
          <v-icon>{{ mdiFilterVariant }}</v-icon>
        </v-btn>
      </div>
    </div>
    <v-dialog v-model="showEdit" :scrollable="true">
      <v-card width="90vw" max-width="450" min-height="300" rounded="xl" class="py-2 align-self-center">
        <v-card-title> {{ t('main.playlist.edit') }} </v-card-title>
        <v-card-text>
          <v-text-field v-model="editForm.title" variant="outlined" :label="t('main.playlist.name')"> </v-text-field>
          <v-textarea v-model="editForm.description" hide-details variant="outlined" :label="t('main.playlist.desc')">
          </v-textarea>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="primary" variant="plain" plain @click="cancel"> {{ t('common.cancel') }} </v-btn>
          <v-btn color="primary" variant="plain" plain @click="edit"> {{ t('common.confirm') }} </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showMoreDesc" :scrollable="true">
      <v-card color="surfaceVariant" width="90vw" max-width="450" rounded="xl" class="pb-4 align-self-center">
        <v-card-title>
          <div class="d-flex justify-space-between align-center">
            {{ t('main.playlist.desc') }}
            <v-btn icon variant="text" @click="showMoreDesc = false"
              ><v-icon>{{ mdiClose }}</v-icon></v-btn
            >
          </div>
        </v-card-title>
        <v-card-text>
          {{ playlist['description'] }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
