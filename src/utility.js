export function secondsToString(totalSeconds) {
  if (totalSeconds === -1) {
    return '';
  }

  let minutes = `${Math.floor(totalSeconds / 60)}`;
  let seconds = `${Math.floor(totalSeconds - (minutes * 60))}`;
  if (seconds.length < 2) {
    seconds = `0${seconds}`;
  }
  if (minutes.length < 2) {
    minutes = `0${minutes}`;
  }
  return `${minutes}:${seconds}`;
}

export function stringToSeconds(string) {
  if (string === '') {
    return -1;
  }

  const parts = string.split(':');
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);

  return ((minutes * 60) + seconds);
}

export function buildMeta(string, track = { artist: '', title: '', release: '', episode: -1 }) {
  return string
    .replace('$$ARTIST', track.artist)
    .replace('$$TITLE', track.title)
    .replace('$$RELEASE', track.release)
    .replace('$$EPISODE', track.episode);
}

export function debounce(func, wait, immediate) {
  let timeout;
  return function debouncedFn(...args) {
    const context = this;
    const later = function applyDebounce() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export function getSource(url) {
  if (url.indexOf('youtube') > -1 || url.indexOf('youtu.be/') > -1) {
    return 'youtube';
  } else if (url.indexOf('soundcloud.com/') > -1) {
    return 'soundcloud';
  }
  return false;
}

export function shuffle(playlist, indexOfCurrentSong) {
  const shuffledPlaylist = JSON.parse(JSON.stringify(playlist));
  let counter = playlist.length;
  let temp;
  let index;

  // While there are elements in the array
  while (counter > 0) {
      // Pick a random index
    index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
    counter -= 1;

      // And swap the last element with it
    temp = shuffledPlaylist[counter];
    shuffledPlaylist[counter] = shuffledPlaylist[index];
    shuffledPlaylist[index] = temp;
  }

  const songToAdd = shuffledPlaylist.splice(indexOfCurrentSong, 1);
  shuffledPlaylist.unshift(songToAdd[0]);

  return shuffledPlaylist;
}

export function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

export const defaultColors = {
  primary: {
    hsl: {
      h: 219.99999999999997,
      s: 0.13043478260869565,
      l: 0.1803921568627451,
      a: 1,
    },
    hex: '#282C34',
    rgba: {
      r: 40,
      g: 44,
      b: 52,
      a: 1,
    },
    hsv: {
      h: 219.99999999999997,
      s: 0.23076923076923078,
      v: 0.20392156862745098,
      a: 1,
    },
    oldHue: 219.99999999999997,
    source: 'hex',
    a: 1,
  },
  secondary: {
    hsl: {
      h: 0,
      s: 0,
      l: 1,
      a: 1,
    },
    hex: '#FFFFFF',
    rgba: {
      r: 255,
      g: 255,
      b: 255,
      a: 1,
    },
    hsv: {
      h: 0,
      s: 0,
      v: 1,
      a: 1,
    },
    oldHue: 0,
    source: 'hex',
    a: 1,
  },
  accent: {
    hsl: {
      h: 0,
      s: 0,
      l: 0,
      a: 1,
    },
    hex: '#000000',
    rgba: {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    },
    hsv: {
      h: 0,
      s: 0,
      v: 0,
      a: 1,
    },
    oldHue: 0,
    source: 'hex',
    a: 1,
  },
};
