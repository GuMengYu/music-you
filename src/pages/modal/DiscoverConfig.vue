<template>
  <v-dialog v-model="show" persistent>
    <v-card flat color="surface" width="50vw" max-width="720" rounded="xl" class="align-self-center pa-4 pt-6">
      <div class="d-flex justify-center">
        <v-icon color="secondary" size="large">
          {{ mdiPalette }}
        </v-icon>
      </div>

      <v-card-title class="text-center">调整首页</v-card-title>
      <v-card-item>
        卡片
        <v-row>
          <v-col :cols="3">
            <v-checkbox hide-details label="最近播放"> </v-checkbox>
          </v-col>
          <v-col :cols="3">
            <v-checkbox hide-details label="每日推荐"> </v-checkbox>
          </v-col>
          <v-col :cols="3">
            <v-checkbox hide-details label="私人雷达"> </v-checkbox>
          </v-col>
          <v-col :cols="3">
            <v-checkbox hide-details label="私人FM"> </v-checkbox>
          </v-col>
        </v-row>
        <span class="text-caption"> 选择两个歌单、专辑、播客放置 </span>
      </v-card-item>
      <v-card-item>
        栏目&顺序

        <v-list density="compact">
          <v-list-item v-for="item in ['专属定制', '雷达歌单', '推荐新音乐', '播客']" :key="item">
            <v-list-item-title>
              {{ item }}
            </v-list-item-title>
            <template #append>
              <v-btn icon size="x-small" variant="flat" style="cursor: move">
                <v-icon>{{ mdiDrag }}</v-icon>
              </v-btn>
              <v-btn icon size="x-small" variant="flat">
                <v-icon>{{ mdiClose }}</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card-item>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="plain" @click="show = false"> 取消 </v-btn>
        <v-btn variant="outlined" rounded="pill" color="primary" @click="saveConfig"> 保存 </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {
  mdiAccountEdit,
  mdiClose,
  mdiCog,
  mdiDelete,
  mdiDrag,
  mdiDragHorizontalVariant,
  mdiGithub,
  mdiLogin,
  mdiLogout,
  mdiPalette,
} from '@mdi/js'
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const show = computed<boolean>({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
function saveConfig() {}
</script>
