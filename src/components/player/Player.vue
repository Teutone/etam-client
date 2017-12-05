<script>
import marked from 'marked';
import { state } from '../../app';
import { shuffle, secondsToString, toggleFullscreen } from '../../utility';
import VolumeBar from './VolumeBar';
import TrackList from './TrackList';
import YtWrap from './YtWrap';

export default {
  components: {
    VolumeBar,
    YtWrap,
    TrackList,
  },
  data: () => ({
    status: 'loading',
    view: 'player',
    index_: 0,
    shuffling_: false,
    originalPlaylist: [],
    shuffledPlaylist: [],
    player_: null,
    duration: 0,
    currentTime: 0,
    muted_: false,
    volume_: 100,
  }),
  methods: {
    playing() {
      this.duration = this.player.getDuration();
      this.status = 'playing';
    },
    shamelessRevisionism() {
      this.$router.replace({ name: 'player', params: { episode: this.track.episode } });
    },
    togglePlayPause() {
      if (this.status === 'playing') {
        this.player.pauseVideo();
      } else {
        this.player.playVideo();
      }
    },
    /*
      * Skips to the next song in the current playlist
      */
    next() {
      if (this.index === this.playlist.length - 1) {
        this.index = 0;
      } else {
        this.index += 1;
      }
    },

    /*
      * Skips to the previous song in the current playlist
      */
    previous() {
      if (this.index === 0) {
        this.index = this.playlist.length - 1;
      } else {
        this.index -= 1;
      }
    },
    goTo(index) {
      this.index = index;
    },

    onKeyDown(event) {
      if (event.keyCode === 32) { // spacebar
        this.togglePlayPause();
      } else if (event.keyCode === 37) { // left arrow
        this.previous();
      } else if (event.keyCode === 39) { // right arrow
        this.next();
      } else if (event.keyCode === 70) { // f
        toggleFullscreen();
      } else if (event.keyCode === 77) { // m
        this.muted = !this.muted;
      } else if (event.keyCode === 73) { // i
        this.view = this.view === 'about' ? 'player' : 'about';
      } else if (event.keyCode === 76) { // l
        this.view = this.view === 'playlist' ? 'player' : 'playlist';
      } else if (event.keyCode === 80) { // p
        this.view = this.view === 'widget' ? 'player' : 'widget';
      } else if (event.keyCode === 83) { // s
        this.shuffle = !this.shuffle;
      }
    },
  },
  subscriptions() {
    state.tracks
      .map(tracks => tracks.filter(t => t.episode !== null).sort((a, b) => b.episode - a.episode))
      .subscribe((tracks) => {
        this.originalPlaylist = tracks;
        this.status = 'buffering';
        for (let i = 0; i < tracks.length; i += 1) {
          if (tracks[i].episode === parseInt(this.$route.params.episode, 10)) {
            this.index = i;
            return;
          }
        }
      });

    return {
      informationText: state.config.map(config => marked(config.informationText)),
      users: state.users,
    };
  },
  computed: {
    uploader() {
      if (!this.track.uploader) {
        return null;
      }
      return this.users.filter(user => user.id === this.track.uploader)[0];
    },
    player: {
      get() {
        return this.player_;
      },
      set(val) {
        this.player_ = val;
        this.volume = 100;
        this.muted = true;
      },
    },
    muted: {
      get() {
        return this.muted_;
      },
      set(val) {
        this.muted_ = val;
        if (val) {
          this.player.mute();
        } else {
          this.player.unMute();
        }
      },
    },
    volume: {
      get() {
        return this.volume_;
      },
      set(val) {
        this.volume_ = val;
        this.player.setVolume(this.volume_);
      },
    },
    index: {
      get() {
        return this.index_;
      },
      set(val) {
        this.index_ = val;
        this.shamelessRevisionism();
      },
    },
    shuffling: {
      get() {
        return this.shuffling_;
      },
      set(val) {
        this.shuffling_ = val;
        if (val) {
          this.shuffledPlaylist = shuffle(this.originalPlaylist, this.index);
          this.index = 0;
        } else {
          for (let i = 0; i < this.originalPlaylist.length; i += 1) {
            if (this.originalPlaylist[i].episode === this.shuffledPlaylist[this.index].episode) {
              this.index = i;
              return;
            }
          }
        }
      },
    },
    playlist() {
      return this.shuffling ? this.shuffledPlaylist : this.originalPlaylist;
    },
    track() {
      return this.playlist[this.index];
    },

    timeString() {
      return secondsToString(this.currentTime);
    },
    totalTimeString() {
      return secondsToString(this.duration);
    },
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeyDown);
  },
  created() {
    document.addEventListener('keydown', this.onKeyDown, false);
  },
};
</script>

<template>
  <div class="player">
    <h1 class="logo" :class="{ 'logo_small': view === 'playlist' }">
      <router-link :to="{ name: 'main' }" title="11:30am">11:30am</router-link>
    </h1>
    <div v-if="status === 'loading'">
      Loading...
    </div>
    <div v-if="track" class="player__wrapper">
      <!-- Episode -->
      <div class="player__episode">
        episode {{ track.episode }}
      </div>

      <!-- Track information -->
      <div class="player__track-details" v-if="view === 'player'">
        <h2>
          <a title="View on Youtube" target="_blank" :href="track.url">
            {{ track.title }}
          </a>
        </h2>
        <div>{{ track.artist }} - {{ track.release }}</div>
        <a href="#" @click.prevent="view = 'about'" class="player__user" v-if="uploader">Uploaded by {{ uploader.name }}</a>
      </div>

      <track-list :playlist="playlist" :track="track" @go-to="goTo" :open="view === 'playlist'"></track-list>

      <!-- the actual player -->
      <yt-wrap
        :hidden="view !== 'widget'"
        :track="track"
        :width="468"
        @ready="player = $event"
        @ping="currentTime = $event"
        @paused="status = 'paused'"
        @playing="playing"
        @error="next"
        @ended="next"
        class="player__yt-wrap"
      ></yt-wrap>

      <div class="player__about" v-show="view ==='about'">
        <div v-html="informationText"></div>
        <div v-if="uploader && uploader.bio">
          <h4>{{ uploader.name }}</h4>
          <p>{{ uploader.bio }}</p>
        </div>
      </div>

      <div class="loader" v-if="player === null">
          <span class="iconicfill-spin-alt ani-spin"></span> Loading...
      </div>

      <!-- Buttons and controls -->
      <div class="controls" :class="{ controls_low: view !== 'player' }" v-if="player !== null">
        <button
          title="Previous [Left Arrow]"
          @click.prevent="previous"
          class="icon-button"
        >
          <span class="iconicstroke-first"></span>
        </button>
        <button
          title="Play / Pause [Spacebar]"
          @click.prevent="togglePlayPause"
          class="icon-button"
        >
          <span v-if="status === 'paused'" class="iconicstroke-play"></span>
          <span v-if="status === 'playing'" class="iconicstroke-pause"></span>
          <span v-if="status === 'buffering'" class="iconicstroke-spin-alt ani-spin"></span>
        </button>
        <button
          title="Next [Right Arrow]"
          @click.prevent="next"
          class="icon-button"
        >
          <span class="iconicstroke-last"></span>
        </button>

        <volume-bar
          :muted="muted"
          :volume="volume"
          @mute="muted = $event"
          @volume="volume = $event"
        ></volume-bar>

        <span class="controls__time">
          {{ timeString }} / {{ totalTimeString }}
        </span>

        <span class="flexxer"></span>

        <button
          title="Show Playlist [P]"
          @click.prevent="view = view === 'playlist' ? 'player' : 'playlist'"
          class="icon-button"
          :class="{ active: view === 'playlist' }"
        >
          <span class="iconicstroke-list"></span>
        </button>
        <button
          title="Shuffle [S]"
          @click.prevent="shuffling = !shuffling"
          class="icon-button"
          :class="{ active: shuffling }"
          >
          <span class="iconicstroke-fork"></span>
        </button>
        <button
          title="Show Player [V]"
          @click.prevent="view = view === 'widget' ? 'player' : 'widget'"
          class="icon-button"
          :class="{ active: view === 'widget' }"
        >
          <span class="iconicstroke-eye"></span>
        </button>
        <button
          title="Show information [I]"
          @click.prevent="view = view === 'about' ? 'player' : 'about'"
          class="icon-button"
          :class="{ active: view === 'about' }"
        >
          <span class="iconicstroke-info"></span>
        </button>
      </div>
    </div>
  </div>
</template>
