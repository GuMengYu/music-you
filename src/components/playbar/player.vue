<script>
import { Howl, Howler } from 'howler';
import {sync} from 'vuex-pathify';
import {throttle} from '@util/fn'

export default {
  name: 'Player',
  data: () => ({
    progressThrottle: null,
    saveCurrentTimeThrottle: null,
    // track: {},
    pauseProgress: false,
    howler: null,
  }),
  computed: {
    volume: sync('settings/volume'),
    currentTime: sync('music/currentTime'),
  },
  watch: {
    'track'(val){
      this.initMediaSession();
      this.howler = this.initHowler(val.url);
      console.log('song changed');
    },
    volume(val) {
      this.howler.volume(val);
    },
  },
  mounted() {
    this.progressThrottle = throttle(this.runProgress, 1000);
    this.saveCurrentTimeThrottle = throttle(this.saveCurrentTime, 2000);
    this.initMediaSession();
    this.howler = this.initHowler(this.track.url);
  },
  methods: {
    initHowler(src) {
      console.log('test');
      const sound = new Howl({
        src: [src],
        html5: true,
        preload: 'metadata',
        format: ['mp3', 'flac'],
        onplay: () => {
          requestAnimationFrame(this.step);
        },
        // onend: function() {
        //   // Stop the wave animation.
        // },
        // onpause: function() {
        //   // Stop the wave animation.
        // },
        // onstop: function() {
        //   // Stop the wave animation.
        // },
        onseek: () => {
          // Start updating the progress of the track.
          requestAnimationFrame(this.step);
        },
      });
      sound.seek(this.currentTime);
      return sound;
    },
    init() {
      Howler.volume(this.volume);
    },
    pause() {
      this.howler?.pause();
    },
    play() {
      this.howler?.play();
    },
    runProgress() {
      this.currentTime = Math.ceil(this.howler.seek());
    },
    setSeek(val) {
      this.howler.seek(val);
    },
    step() {
      this.progressThrottle();
      this.saveCurrentTimeThrottle();
      if (this.howler.playing() && !this.pauseProgress) requestAnimationFrame(this.step);
    },
    stopTimer() {
      this.pauseProgress = true;
    },
    restoreTimer() {
      this.pauseProgress = true;
    },
    initMediaSession() {
      // https://developers.google.com/web/updates/2017/02/media-session
      if ('mediaSession' in navigator) {
        /* global MediaMetadata */
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.track.name,
          artist: this.track.ar?.[0]?.name,
          album: this.track.al?.name,
          artwork: [
            { src: this.albumPicUrl, sizes: '512x512', type: 'image/png' },
          ],
        });
        // [
        //   ['play', this.playPause],
        //   ['pause', this.playPause],
        //   ['previoustrack', this.playPrev],
        //   ['nexttrack', this.playNext],
        // ].map(([name, fn]) => navigator.mediaSession.setActionHandler(name, fn));
      }
    },
    saveCurrentTime() {
      localStorage.setItem('currentTime', this.currentTime);
    },
  },
}
</script>
