<script>
import { getIdFromURL, getTimeFromURL } from 'vue-youtube-embed';
import { addTrack, updateTrack } from '../../../app';
import { stringToSeconds, secondsToString } from '../../../utility';
import UserName from '../../UserName';

export default {
  props: {
    track: {
      type: Object,
      default: () => ({
        title: '',
        artist: '',
        release: '',
        url: '',
        start: 0,
        end: 0,
        meta: '{}',
      }),
    },
  },
  components: {
    UserName,
  },
  data: () => ({
    uTrack: {
      title: '',
      artist: '',
      release: '',
      url: '',
      start: '',
      end: '',
    },
    maxTime: 0,
    error: '',
    showYouTube: false,
    youTubeLoaded: false,
    youtubePlayer: null,
  }),
  computed: {
    url() {
      return this.uTrack.url;
    },
    maxTimeString() {
      return secondsToString(this.maxTime);
    },
    startSeconds() {
      return stringToSeconds(this.uTrack.start);
    },
    youTubeId() {
      return getIdFromURL(this.uTrack.url);
    },
    startStyle() {
      const percent = ((stringToSeconds(this.uTrack.start) / this.maxTime) * 100);
      return {
        left: `${percent}%`,
        marginLeft: '12px',
      };
    },
    endStyle() {
      const cutTime = this.maxTime - stringToSeconds(this.uTrack.end);
      const percent = ((cutTime / this.maxTime) * 100);
      return {
        right: `${percent}%`,
        marginRight: '12px',
      };
    },
    episode() {
      return typeof (this.track.episode) !== 'number' ? 'Unpublished' : `Ep. ${this.track.episode}`;
    },
  },
  watch: {
    url() {
      if (this.youTubeId) {
        this.showYouTube = true;
      }
    },
    track() {
      this.onTrackUpdate();
    },
  },
  methods: {
    onTimeScroll(delimiter, event) {
      const current = stringToSeconds(this.uTrack[delimiter]);
      if (event.deltaY > 0 && current > 0) {
        // Go back one second
        this.uTrack[delimiter] = secondsToString(current - 1);
      } else if (event.deltaY < 0 && current < this.maxTime) {
        // Go forward one second
        this.uTrack[delimiter] = secondsToString(current + 1);
      }
    },
    onYouTubeReady(player) {
      this.youtubePlayer = player;
      player.setLoop(true);
      this.youTubeLoaded = true;
      this.onYouTubeCued();
    },
    onYouTubeCued() {
      this.maxTime = this.youtubePlayer.getDuration();
      if (!this.track.id) {
        this.uTrack.start = secondsToString(getTimeFromURL(this.uTrack.url));
        this.uTrack.end = secondsToString(this.maxTime);
      } else {
        this.youtubePlayer.seekTo(this.track.start);
      }
    },
    submit() {
      if (!this.youTubeLoaded) {
        return;
      }

      const track = {
        id: this.track.id ? this.track.id : null,
        title: this.uTrack.title,
        artist: this.uTrack.artist,
        release: this.uTrack.release,
        url: this.url,
        start: stringToSeconds(this.uTrack.start),
        end: stringToSeconds(this.uTrack.end),
        meta: '{}',
      };

      if (this.track.id) {
        updateTrack(track)
          .then(() => this.$emit('saved', track))
          .catch((err) => {
            this.error = err.toString();
          });
      } else {
        addTrack(track)
          .then(() => this.$emit('saved', track))
          .catch((err) => {
            this.error = err.toString();
          });
      }
    },
    onTrackUpdate() {
      this.uTrack.title = `${this.track.title}`;
      this.uTrack.artist = `${this.track.artist}`;
      this.uTrack.release = `${this.track.release}`;
      this.uTrack.url = `${this.track.url}`;
      this.uTrack.start = secondsToString(this.track.start);
      this.uTrack.end = secondsToString(this.track.end);
    },
    setStart(ev) {
      this.uTrack.start = ev.target.value;
    },
    setEnd(ev) {
      this.uTrack.end = ev.target.value;
    },
  },
  mounted() {
    this.onTrackUpdate();
  },
};
</script>

<template>
  <form name="trackForm" class="track-form" @submit.prevent="submit">
    <div class="track-form__fields">
      <input v-model="uTrack.title" placeholder="Title" :class="{ active: !!uTrack.title }" />
      <input v-model="uTrack.artist" placeholder="Artist" :class="{ active: !!uTrack.artist }"/>
      <input v-model="uTrack.release" placeholder="Release" :class="{ active: !!uTrack.release }"/>
      <input v-model="uTrack.url" placeholder="URL" :class="{ active: !!uTrack.url }"/>
    </div>
    <div class="track-form__video">
      <youtube
        v-if="showYouTube"
        :video-id="youTubeId"
        @ready="onYouTubeReady"
        @qued="onYouTubeCued"
        :player-width="438"
        :player-height="246"
        :player-vars="{ start: startSeconds, autoplay: false }"
        class="track-form__preview"
      ></youtube>
      <div v-if="youTubeLoaded" class="track-form__timing">
        <input
          :value="uTrack.start"
          @keyup.prevent.enter="setStart"
          @blur="setStart"
          placeholder="00:00"
          @wheel.prevent="onTimeScroll('start', $event)"
          :style="startStyle" />
        <input
          :value="uTrack.end"
          @keyup.prevent.enter="setEnd"
          @blur="setEnd"
          :placeholder="maxTimeString"
          @wheel.prevent="onTimeScroll('end', $event)"
          :style="endStyle" />
      </div>
    </div>
    <div class="form-actions">
      <div class="form-actions__left" v-if="track.id && track.episode !== null"> {{ episode }} - <user-name :id="track.uploader"></user-name></div>
      <button name="submit" type="submit" v-show="youTubeLoaded">Save</button>
      <button type="button" @click.prevent="$emit('cancel')">Cancel</button>
    </div>
    <p v-if="error" v-html="error"></p>
  </form>
</template>