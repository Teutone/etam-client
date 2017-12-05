import { ReplaySubject } from 'rxjs/ReplaySubject';

export const state = {
  user: new ReplaySubject(1),
  users: new ReplaySubject(1),
  tracks: new ReplaySubject(1),
  config: new ReplaySubject(1),
  theme: new ReplaySubject(1),
};

function request(method, route, body) {
  return fetch(`/api/${route}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : null,
    method,
  })
  .then(res => res.json())
  .then((res) => {
    if (res.error) {
      throw new Error(res.error);
    }
    return res;
  });
}

/* tracks */

export function getTracks() {
  request('GET', 'tracks/').then(tracks => state.tracks.next(tracks));
}

export function addTrack(track) {
  return request('POST', 'tracks/', track)
  .then((res) => {
    getTracks();
    return res;
  });
}
export function updateTrack(track) {
  return request('POST', `tracks/${track.id}`, track)
  .then((res) => {
    getTracks();
    return res;
  });
}
export function publishTrack(id, message = '') {
  return request('POST', `tracks/${id}/publish`, { message })
  .then((res) => {
    getTracks();
    return res;
  });
}
export function claimTrack(id) {
  return request('POST', `tracks/${id}/claim`)
  .then((res) => {
    getTracks();
    return res;
  });
}
export function deleteTrack(id) {
  return request('DELETE', `tracks/${id}`)
  .then((res) => {
    getTracks();
    return res;
  });
}

/* users */

export function getUsers() {
  request('GET', 'users/')
    .then((users) => {
      state.users.next(users);
    });
}
export function addUser(user) {
  return request('POST', 'users/', user)
    .then((res) => {
      getUsers();
      return res;
    });
}
export function updateUser(user) {
  return request('POST', `users/${user.id}`, user)
    .then((res) => {
      getUsers();
      state.user.first().subscribe((currUser) => {
        if (currUser.id === res.id) {
          state.user.next(res);
        }
      });
      return res;
    });
}

/* facebook */

export function getFbRedirectURL() {
  return request('GET', 'fb/getRedirectURL');
}

export function getFbAccess() {
  return request('GET', 'fb/access');
}

export function setFbUserAccessToken(userAccessToken) {
  return request('POST', 'fb/setUserAccessToken', { userAccessToken });
}
export function setFbPage(id, name, accessToken) {
  return request('POST', 'fb/setPage', { id, name, accessToken });
}
export function getFbPages() {
  return request('GET', 'fb/pages');
}
export function clearFbData() {
  return request('DELETE', 'fb');
}

/* misc */

export function install(user) {
  return request('POST', 'install', user)
    .then((res) => {
      getUsers();
      return res;
    });
}

export function getConfig() {
  return request('GET', 'config')
    .then(config => state.config.next(config));
}

export function setConfig(config) {
  return request('POST', 'config', config)
    .then(() => getConfig());
}

/* authentication */

export function login(name, password, remember) {
  return request('POST', 'login', { name, password, remember })
    .then(user => state.user.next(user));
}

export function logout() {
  return request('POST', 'logout')
    .then(() => state.user.next(null));
}

state.user.subscribe(() => {
  getConfig();
  getTracks();
});

state.users.next([]);
state.tracks.next([]);

login().catch(() => state.user.next(null));
getTracks();
getUsers();
getConfig();
