<template>
  <v-sheet>
    <v-tabs height="30">
      <v-tab to="/explore/playlistcenter">
        {{ $t('main.playlist_center') }}
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
