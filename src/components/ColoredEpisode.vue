<script>
export default {
  props: {
    track: { type: Object, required: true },
  },
  computed: {
    meta() {
      return JSON.parse(this.track.meta);
    },
    styles() {
      if (this.meta && this.meta.secondary) {
        return {
          color: this.meta.secondary.hex,
          backgroundColor: this.meta.primary.hex,
        };
      }

      return {};
    },
  },
};
</script>

<template>
  <div class="colored-episode" :style="styles">
    {{ track.episode !== null ? track.episode : '###' }}
  </div>
</template>