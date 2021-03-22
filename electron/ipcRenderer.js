const { ipcRenderer } = require('electron');
export const registerIpcRenderer = (store) => {
  ipcRenderer.on('open-settings', () => {
    store.commit('app/showSettings', true);
  });
  ipcRenderer.on('next', () => {
    const id = store.getters['music/nextTrackId'];
    store.dispatch('music/updateTrack', { id });
  });
  ipcRenderer.on('up', () => {
    const id = store.getters['music/prevTrackId'];
    store.dispatch('music/updateTrack', { id });
  });
  ipcRenderer.on('playOrPause', () => {
    const playing = store?.state.music.playing;
    store.commit('music/playing', !playing );
  });
  ipcRenderer.on('volumeUp', () => {
    const { volume } = store?.state.settings;
    const tem = volume + 0.1;
    if (tem < 1) {
      store.commit('settings/volume', tem );
    }
  });
  ipcRenderer.on('volumeDown', () => {
    const { volume } = store?.state.settings;
    const tem = volume - 0.1;
    if (tem >= 0) {
      store.commit('settings/volume', tem );
    }
  });
  ipcRenderer.on('like', () => {

  });
  return ipcRenderer;
}

export const subscribe = (channel, cb) => {
  ipcRenderer.on(channel, cb);
}
