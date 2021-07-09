const ACTIONS = {
  UPDATE_PLAYING_LIST: 'music/updatePlayingList',
  UPDATE_FM_LIST: 'music/updatePersonalFmList',
  UPDATE_TRACK: 'music/updateTrack',
  LIKE_TRACK: 'music/favSong',
  UPDATE_RECENT: 'music/pushRecent',
  SAVE_MUSIC: 'music/saveMusicState',
};

const MUTATIONS = {};
export default {
  ...ACTIONS,
  ...MUTATIONS,
};
