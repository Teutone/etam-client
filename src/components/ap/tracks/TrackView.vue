<script>
import { getIdFromURL } from 'vue-youtube-embed';
import { deleteTrack, publishTrack, state } from '../../../app';
import { buildMeta } from '../../../utility';
import UserName from '../../UserName';
import YtWrap from '../../player/YtWrap';
import TrackForm from './TrackForm';

export default {
  props: {
    track: { type: Object, default: {} },
  },
  components: {
    UserName,
    YtWrap,
    TrackForm,
  },
  data: () => ({
    deleting: false,
    uTrack: null,
    preview: false,
    view: 'default',
    publishMessage: '',
  }),
  subscriptions: {
    config: state.config,
  },
  computed: {
    published() {
      return this.track.episode !== null;
    },
    episode() {
      return this.track.episode === null ? 'Unpublished' : `Ep. ${this.track.episode}`;
    },
    youTubeId() {
      return getIdFromURL(this.track.url);
    },
    link() {
      return `${location.origin}/#EP`;
    },
    defaultPublishMessage() {
      const track = {
        episode: '#EP',
        title: this.track.title,
        artist: this.track.artist,
        release: this.track.release,
      };

      return `${buildMeta(this.config.defaultSocialMessage, track)}<br /><br />${this.link}`;
    },
  },
  methods: {
    remove() {
      if (this.published) {
        return;
      }

      deleteTrack(this.track.id)
        .catch(err => console.error(err));
    },
    publish() {
      if (this.published) {
        return;
      }

      publishTrack(this.track.id, this.publishMessage)
        .catch(err => console.error(err));
    },
  },
  updated() {
    this.uTrack = JSON.parse(JSON.stringify(this.track));
  },
  mounted() {
    this.uTrack = JSON.parse(JSON.stringify(this.track));
  },
};
</script>

<template>
  <div class="track">
    <track-form class="track-form_inline" v-if="view === 'editing'" :track="track" @cancel="view = 'default'" @saved="view = 'default'"></track-form>
    <form name="publishTrackForm" class="track__publish" v-if="view === 'publish'" @submit.prevent="publish">
      <h1>Facebook publish message</h1>
      <textarea v-model="publishMessage" placeholder="Optional extra social message"></textarea>
      <p v-html="defaultPublishMessage"></p>
      <button type="submit">Publish</button>
      <button @click.prevent="view = 'default'" type="button">Cancel</button>
    </form>
    <div class="track__main" v-show="view === 'default'">
      <div class="track__details">
        <h1>{{ track.title }}</h1>
        <p>{{ track.artist }} - {{ track.release }}</p>
        <div class="center" v-if="preview">
          <yt-wrap
            :track="track"
            :player-vars="{ start: track.start, autoplay: true }"
            :video-id="youTubeId"
            :width="438"
          ></yt-wrap>
        </div>
      </div>
      <div class="track__footer">
        <div class="track__episode">
          {{ track.episode !== null ? track.episode + ' - ' : '' }}
          <user-name :id="track.uploader"></user-name>
          <span v-if="!track.uploader"> - <a href="#" @click.prevent="claim">I uploaded this</a></span>
        </div>
        <div class="track__actions" v-if="!deleting">
          <button @click.prevent="preview = true" v-if="!preview">Preview</button>
          <button @click.prevent="preview = false" v-if="preview">Close Preview</button>
          <button @click.prevent="view = 'publish'" v-if="!published">Publish</button>
          <button @click.prevent="editing = true">Edit</button>
          <button @click.prevent="deleting = true" v-if="!published">Delete</button>
        </div>
        <div class="track__actions" v-else>
          You sure?
          <button @click.prevent="remove">Delete</button>
          <button @click.prevent="deleting = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>