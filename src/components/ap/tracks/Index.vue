<script>
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { getSource } from '../../../utility';
import { state } from '../../../app';
import TrackView from './TrackView';
import TrackForm from './TrackForm';

function search(track, query) {
  const lquery = query.toLowerCase();
  if (track.title.toLowerCase().indexOf(lquery) !== -1) {
    return true;
  }

  if (track.artist.toLowerCase().indexOf(lquery) !== -1) {
    return true;
  }

  if (track.release.toLowerCase().indexOf(lquery) !== -1) {
    return true;
  }

  if (track.episode && track.episode.toLowerCase().toString().indexOf(lquery) !== -1) {
    return true;
  }

  return false;
}

// This is defined as the component data in the "wrong" way
// on purpose so the filters stay the same when we return to it
const data = {
  published: false,
  query: '',
  source: null,
  uploader: null,
  sources: ['soundcloud', 'youtube'],
  adding: false,
};

export default {
  components: {
    TrackView,
    TrackForm,
  },
  data: () => (data),
  subscriptions() {
    this.filterChange$ = new ReplaySubject();
    this.filterChange$.next(null);

    return {
      user: state.user,
      users: state.users,
      tracks: Observable
            .combineLatest(
              state.tracks,
              this.filterChange$,
            )
            .map(streams => streams[0])
            .map(tracks => tracks.filter((track) => {
              if (this.published === true && track.episode === null) {
                return false;
              }

              if (this.published === false && track.episode !== null) {
                return false;
              }

              if (this.source && getSource(track.url) !== this.source) {
                return false;
              }

              if (this.query && !search(track, this.query)) {
                return false;
              }

              if (this.uploader && this.uploader !== track.uploader) {
                return false;
              }

              return true;
            }))
            .map(tracks => tracks.sort((a, b) => {
              if (this.published) {
                return b.episode - a.episode;
              }
              return b.lastChangeStamp - a.lastChangeStamp;
            })),
    };
  },
};
</script>

<template>
  <div class="tracklist">
    <track-form :class="{ 'track-form_visible': adding }" @saved="adding = false" @cancel="adding = false"></track-form>
    <div class="tracklist__filters">
      <input type="text" v-model="query" placeholder="Search here" v-stream:input="filterChange$" />
      <select v-model="published" v-stream:change="filterChange$">
        <option :value="false">Queue</option>
        <option :value="true">Published</option>
      </select>
      <select v-model="source" v-stream:change="filterChange$">
        <option :value="null">all sources</option>
        <option v-for="availableSource in sources" :key="availableSource">{{ availableSource }}</option>
      </select>
      <select v-model="uploader" v-stream:change="filterChange$">
        <option :value="null">all users</option>
        <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
      </select>
    </div>
    <div class="tracklist__list">
      <div class="tracklist__list-item tracklist__list-item_add center">
        <button @click.prevent="adding = true">Add Track</button>
      </div>
      <div class="tracklist__list-item" v-if="tracks.length === 0">No tracks found</div>
      <track-view
        v-else
        class="tracklist__list-item"
        v-for="track in tracks"
        :key="track.id"
        :track="track"
      ></track-view>
    </div>
  </div>
</template>
