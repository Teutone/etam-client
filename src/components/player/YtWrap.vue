<script>
import { getIdFromURL } from 'vue-youtube-embed';
import { updateTrack, state } from '../../app';

export default {
  props: {
    track: { type: Object, required: true },
    autoplay: { type: Boolean, default: true },
    width: { type: Number, default: 438 },
    hidden: { type: Boolean, default: false },
  },
  data: () => ({
    timeCheckInterval: null,
    player: null,
    aspectRatio: 16 / 9,
  }),
  subscriptions: {
    user: state.user,
  },
  computed: {
    id() {
      return getIdFromURL(this.track.url);
    },
    height() {
      return this.width / this.aspectRatio;
    },
    youTubeId() {
      return getIdFromURL(this.track.url);
    },
  },
  methods: {
    unsetTimer() {
      clearInterval(this.timeCheckInterval);
    },
    onOvertime() {
      this.player.seekTo(this.player.getDuration());
    },
    ready(player) {
      this.player = player;
      this.$emit('ping', this.player.getCurrentTime());
      this.$emit('ready', player);
    },
    qued(ev) {
      this.$emit('qued', ev);
    },
    playing(ev) {
      this.unsetTimer();
      this.$emit('playing', ev);

      if (this.track.end === 0) {
        this.track.end = Math.floor(this.player.getDuration());

        if (this.user !== null) {
          updateTrack(this.track);
        }
      }

      if (this.track.end - this.player.getCurrentTime() <= 0) {
        this.onOvertime();
      } else {
        this.timeCheckInterval = setInterval(() => {
          const current = this.player.getCurrentTime();
          this.$emit('ping', current);
          if (this.track.end - current <= 0) {
            this.onOvertime();
          }
        }, 15);
      }
    },
    paused(ev) {
      this.$emit('paused', ev);
      this.unsetTimer();
    },
    buffering(ev) {
      this.$emit('buffering', ev);
      this.unsetTimer();
    },
    error(ev) {
      this.$emit('error', ev);
      this.unsetTimer();
    },
    ended(ev) {
      this.$emit('ended', ev);
      this.unsetTimer();
    },
  },
};
</script>

<template>
  <youtube
    class="yt-wrap"
    :class="{ 'yt-wrap_hidden': hidden }"
    @ready="ready"
    @qued="qued"
    @playing="playing"
    @paused="paused"
    @buffering="buffering"
    @error="error"
    @ended="ended"

    :player-vars="{ start: track.start, autoplay }"
    :video-id="youTubeId"
    :player-width="width"
    :player-height="height"
  ></youtube>
</template>
