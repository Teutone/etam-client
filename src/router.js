import VueRouter from 'vue-router';
import { Observable } from 'rxjs/Observable';
import { buildMeta } from './utility';
import { state, logout } from './app';

export function authGuard(to, from, next) {
  state.user.subscribe((user) => {
    if (user === null) {
      next({ name: 'login', params: { redirect: to.fullPath } });
    } else {
      next();
    }
  });
}

export function usersExist(to, from, next) {
  state.users.subscribe((users) => {
    if (users.length === 0) {
      next({ name: 'install' });
    } else {
      next();
    }
  }, next({ name: 'error' }));
}
export const routes = [
  {
    name: 'ap',
    path: '/ap',
    component: () => import('./components/ap/AdminPanel.vue'),
    beforeEnter: authGuard,
    redirect: '/ap/tracks',
    children: [
      {
        name: 'tracks',
        path: 'tracks',
        component: () => import('./components/ap/tracks/Index.vue'),
      },
      {
        name: 'users',
        path: 'users',
        component: () => import('./components/ap/users/Index.vue'),
      },
      {
        name: 'config',
        path: 'config',
        component: () => import('./components/ap/config/Index.vue'),
      },
      {
        name: 'fb-connect',
        path: 'config/fb-connect',
        component: () => import('./components/ap/config/FbConnect.vue'),
      },
      { path: '*', redirectTo: { name: 'tracks' } },
    ],
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('./components/Login.vue'),
  },
  {
    name: 'logout',
    path: '/ap/logout',
    beforeEnter: (to, from, next) => logout().then(() => next({ name: 'main' })),
  },
  {
    name: 'player',
    path: '/:episode',
    component: () => import('./components/player/Player.vue'),
  },
  {
    name: 'main',
    path: '/',
    beforeEnter: (to, from, next) => {
      state.tracks.subscribe((tracks) => {
        const latestEpisode = tracks.reduce((prev, curr) => {
          const isLarger = curr.episode !== null && curr.episode > prev;
          return isLarger ? curr.episode : prev;
        }, -1);
        next({ name: 'player', params: { episode: latestEpisode } });
      });
    },
  },
  { path: '*', redirectTo: { name: 'main' } },
];

export const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  Observable.combineLatest(
    state.config,
    state.tracks,
  )
  .subscribe((data) => {
    const config = data[0];
    const tracks = data[1];

    if (to.name === 'player') {
      const latestTrack = tracks.filter(t => t.episode === parseInt(to.params.episode, 10))[0];
      document.title = buildMeta(config.title.episode, latestTrack);
    } else {
      document.title = config.title.default;
    }

    next();
  });
});
