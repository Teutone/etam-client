<script>
export default {
  props: {
    playlist: { type: Array, required: true },
    track: { type: Object, required: true },
    open: { type: Boolean, default: false },
  },
};
</script>

<template>
  <div class="list" :class="{ list_visible: open }">
    <div class="list__list">
      <a 
        v-for="(t, index) in playlist"
        role="button"
        href="#"
        @click.prevent="$emit('go-to', index)"
        :key="t.id"
        class="list__list-item"
        :class="{ 'list__list-item_active': t.id === track.id}"
      >
        <div class="list__episode">
          {{ t.episode }}
        </div>
        <div class="list__track-details">
          <div>{{ t.title }}</div>
          <div>{{ t.artist }} - {{ t.release }}</div>
        </div>
      </a>
    </div>
  </div>
</template>