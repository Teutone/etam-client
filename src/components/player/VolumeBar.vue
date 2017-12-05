<script>
import { debounce } from '../../utility';

export default {
  props: {
    muted: { type: Boolean, default: false },
    volume: { type: Number, default: 100 },
  },
  data: () => ({
    refStartX: null,
    active: false,
    deltaX: 100,
    returnDelay: null,
  }),
  computed: {
    style() {
      return {
        width: `${this.active ? this.deltaX : this.volume}%`,
      };
    },
  },
  methods: {
    setVolume: debounce(function setVolume() {
      this.$emit('volume', this.deltaX);
    }, 30),
    toggleMute() {
      this.$emit('mute', !this.muted);
    },
    mousemove: debounce(function mousemove(ev) {
      this.deltaX = ev.pageX - this.refStartX;

      this.deltaX = this.deltaX > 100 ? 100 : this.deltaX;
      this.deltaX = this.deltaX < 0 ? 0 : this.deltaX;

      this.setVolume();
    }, 10),
    start(ev) {
      clearTimeout(this.returnDelay);
      document.addEventListener('mousemove', this.mousemove);
      document.addEventListener('mouseup', this.leave);
      this.active = true;
      this.refStartX = this.$refs.volume.getBoundingClientRect().left;

      this.mousemove(ev);
    },
    leave() {
      document.removeEventListener('mousemove', this.mousemove);
      document.removeEventListener('mouseup', this.leave);
      this.$emit('volume', this.deltaX);

      this.returnDelay = setTimeout(() => {
        this.active = false;
      }, 300);
    },
  },
};
</script>

<template>
  <div class="volume-bar" :class="{ active: active }">
    <div class="volume-bar__wrap">
      <button
        type="button"
        title="Volume Mute [M]"
        class="volume-bar__mute-button icon-button"
        @click.prevent="toggleMute"
      >
        <span class="iconicstroke-volume" v-if="!muted"></span>
        <span class="iconicstroke-volume-mute" v-if="muted"></span>
      </button>
      <div @mousedown="start" class="volume-bar__volume-wrap">
        <div class="volume-bar__volume" ref="volume">
          <div :style="style"></div>
        </div>
      </div>
    </div>
  </div>
</template>
