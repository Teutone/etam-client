<script>
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { state } from '../app';

export default {
  components: { },
  data: () => ({
    title: 'latenight.blue',
  }),
  subscriptions() {
    this.routeChange$ = new ReplaySubject();
    this.routeChange$.next(this.$route);

    return {
      showApLink: Observable
            .combineLatest(
              state.user,
              this.routeChange$,
            )
            .map((streams) => {
              const user = streams[0];
              const route = streams[1];
              return (user !== null && route && route.name === 'player');
            }),
      user: state.user,
    };
  },
  mounted() {
    this.$router.afterEach((to) => {
      this.routeChange$.next(to);
    });
  },
};
</script>

<template>
  <nav role="navigation" class="nav" :class="{ 'nav_hidden': !user }">
    <router-link class="nav__title" :to="{ name: 'main' }" title="11:30am" :class="{ nav__title_hidden: $route.name === 'player' }">
      11:30am
    </router-link>
    <router-link :to="{ name: 'tracks' }">
      Tracks
    </router-link>
    <router-link :to="{ name: 'users' }">
      Users
    </router-link>
    <router-link :to="{ name: 'config' }" v-if="user && user.role === 'admin'">
      Config
    </router-link>
    <router-link :to="{ name: 'logout' }">
      Logout
    </router-link>
  </nav>
</template>
