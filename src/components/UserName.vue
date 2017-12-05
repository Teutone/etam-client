<script>
  import { Observable } from 'rxjs/Observable';
  import { ReplaySubject } from 'rxjs/ReplaySubject';
  import { state } from '../app';

  export default {
    props: {
      id: { type: String, default: null },
    },
    subscriptions() {
      this.idChange$ = new ReplaySubject();
      this.idChange$.next(null);

      return {
        username: Observable
          .combineLatest(
            state.users,
            this.idChange$,
          )
          .map(data => data[0].filter(user => user.id === this.id)[0])
          .map(user => (user ? user.name : null)),
        isLoggedIn: state.user.map(user => user !== null),
      };
    },
    watch: {
      id(val) {
        this.idChange$.next(val);
      },
    },
  };
</script>

<template>
  <span class="user-name">Added by 
    <span v-if="id && username">{{ username }}</span>
    <span v-else>Unknown</span>
  </span>
</template>