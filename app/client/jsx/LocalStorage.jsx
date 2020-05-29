const ttl = 10 * 60 * 1000; // 10 mins
const topLevelKey = 'APP';

function getTopLevel() {
  const topLevel = localStorage.getItem(topLevelKey);
  return topLevel ? JSON.parse(topLevel) : null;
}

export default class LocalStorage {
  static set(key, value) {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + ttl,
    };

    const current = getTopLevel() || {};
    current[key] = item;

    localStorage.setItem(topLevelKey, JSON.stringify(current));
  }

  static get(key) {
    const state = getTopLevel();
    if (!state) {
      return null;
    }

    const item = state[key];
    if (!item) {
      return null;
    }

    const now = new Date();
    if (now.getTime() > item.expiry) {
      delete state[key];
      localStorage.setItem(topLevelKey, state);
      return null;
    }

    return item.value;
  }

  // reset TTL
  static touch(key) {
    const currentValue = LocalStorage.get(key);
    if (currentValue) {
      LocalStorage.set(key, currentValue);
    }
  }
}
