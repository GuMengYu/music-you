<template>
  <v-dialog
    v-model="showSettings"
    persistent
    max-width="490"
  >
    <v-card>
      <v-card-title class="headline">
        Settings
        <v-spacer />
        <v-btn icon @click="showSettings = false">
          <v-icon>{{ icon.mdiClose }}</v-icon>
        </v-btn>
      </v-card-title>
      <div class="container">
        <div class="user">
          <div class="left">
            <v-img class="avatar" />
            <div class="info">
              <div class="nickname">Test name</div>
              <div class="extra-info">
                <span class="text">很好</span>
              </div>
            </div>
            <div class="right">
              <v-btn text>logo out</v-btn>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title"> Language </div>
            </div>
            <div class="right">
              <select v-model="settings.lang">
                <option value="en">🇬🇧 English</option>
                <option value="zh-CN">🇨🇳 简体中文</option>
              </select>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title"> {{ $t("settings.musicQuality.text") }} </div>
            </div>
            <div class="right">
              <select v-model="settings.musicQuality">
                <option value="128000">
                  {{ $t("settings.musicQuality.low") }} - 128Kbps
                </option>
                <option value="192000">
                  {{ $t("settings.musicQuality.medium") }} - 192Kbps
                </option>
                <option value="320000">
                  {{ $t("settings.musicQuality.high") }} - 320Kbps
                </option>
                <option value="999000">
                  {{ $t("settings.musicQuality.lossless") }} - FLAC
                </option>
              </select>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title">
                {{ $t("settings.automaticallyCacheSongs") }}
              </div>
            </div>
            <div class="right">
              <div class="toggle">
                <input
                  type="checkbox"
                  name="automatically-cache-songs"
                  id="automatically-cache-songs"
                  v-model="settings.automaticallyCacheSongs"
                />
                <label for="automatically-cache-songs"></label>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title">
                {{
                  $t("settings.cacheCount", {
                    song: 2,
                    size: 123,
                  })
                }}</div
              >
            </div>
            <div class="right">
              <button @click="clearCache('tracks')">
                {{ $t("settings.clearSongsCache") }}
              </button>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title">显示歌词翻译</div>
            </div>
            <div class="right">
              <div class="toggle">
                <input
                  type="checkbox"
                  name="show-lyrics-translation"
                  id="show-lyrics-translation"
                  v-model="settings.showLyricsTranslation"
                />
                <label for="show-lyrics-translation"></label>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title"> {{ $t("settings.showGitHubIcon") }} </div>
            </div>
            <div class="right">
              <div class="toggle">
                <input
                  type="checkbox"
                  name="show-github-icon"
                  id="show-github-icon"
                  v-model="showGithubIcon"
                />
                <label for="show-github-icon"></label>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title">
                {{ $t("settings.showUnavailableSongInGreyStyle") }}</div
              >
            </div>
            <div class="right">
              <div class="toggle">
                <input
                  type="checkbox"
                  name="show-unavailable-song-grey"
                  id="show-unavailable-song-grey"
                  v-model="settings.showUnavailableSongInGreyStyle"
                />
                <label for="show-unavailable-song-grey"></label>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title">
                {{ $t("settings.showPlaylistsByAppleMusic") }}</div
              >
            </div>
            <div class="right">
              <div class="toggle">
                <input
                  type="checkbox"
                  name="show-playlists-by-apple-music"
                  id="show-playlists-by-apple-music"
                  v-model="settings.showPlaylistsByAppleMusic"
                />
                <label for="show-playlists-by-apple-music"></label>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title" style="transform: scaleX(-1)">🐈️ 🏳️‍🌈</div>
            </div>
            <div class="right">
              <div class="toggle">
                <input
                  type="checkbox"
                  name="nyancat-style"
                  id="nyancat-style"
                  v-model="nyancatStyle"
                />
                <label for="nyancat-style"></label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="green darken-1"
          text
          @click="showSettings = false"
        >
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { sync } from 'vuex-pathify'
import {mdiClose} from '@mdi/js';
export default {
  name: 'Setting',
  data: () => ({
    dialog: '',
    icon: { mdiClose },
  }),
  computed: {
    showSettings: sync('app/showSettings'),
    settings: sync('app/settings'),
  },
  methods: {
    clearCache() {},
  },
}
</script>

<style scoped>

</style>
