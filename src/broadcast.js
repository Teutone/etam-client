const Broadcaster = {
  listeners: {},
  on(name, callback) {
    if (!Array.isArray(this.listeners[name])) {
      this.listeners[name] = [];
    }
    return (this.listeners[name].push(callback) - 1);
  },
  emit(name, ...args) {
    if (Array.isArray(this.listeners[name])) {
      for (let i = 0; i < this.listeners[name].length; i += 1) {
        const cb = this.listeners[name][i];
        if (cb && typeof cb === 'function') {
          cb(...args);
        }
      }
    }
  },
};

export default Broadcaster;
