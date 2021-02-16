<template>
  <v-sheet>
    <v-tabs height="30">
      <v-tab to="/explore/songlist">
        {{ $t('main.song_list') }}
      </v-tab>
      <v-tab to="/explore/leaderboard">
        {{ $t('main.leader_board') }}
      </v-tab>
      <v-tab to="/explore/singer">
        {{ $t('main.singer') }}
      </v-tab>
    </v-tabs>
    <keep-alive>
      <router-view />
    </keep-alive>
  </v-sheet>
</template>
