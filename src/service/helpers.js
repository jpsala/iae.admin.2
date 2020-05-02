/* eslint-disable no-param-reassign */
import { watch } from 'vue';
import store from '../store';
import router from '../router';

let loggedInChangedFN = () => {};
const onLoggedInChanged = (fn) => {
  loggedInChangedFN = fn;
  loggedInChangedFN(store.getters['session/loggedIn'], undefined);
};
watch(
  () => store.getters['session/loggedIn'],
  (v) => loggedInChangedFN(v),
  { immediate: true },
);
const tryToLogin = () => {
  store.dispatch('session/tryToLogin')
    .then((resp) => {
      if (!resp || resp.status !== 200) {
        router.push('/login');
      }
    })
    .catch(() => {
      router.push('/login');
    });
};

const debounce = (func, wait, immediate) => {
  let timeout; let args; let context; let timestamp; let
    result;
  if (wait == null) wait = 100;

  const later = () => {
    const last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        // eslint-disable-next-line no-multi-assign
        context = args = null;
      }
    }
  };

  function debounced() {
    context = this;
    args = arguments;
    timestamp = Date.now();
    const callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  }

  debounced.clear = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  debounced.flush = () => {
    if (timeout) {
      result = func.apply(context, args);
      context = args = null;

      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};

const throttle = (fn, threshhold, scope) => {
  if (!threshhold) (threshhold = 250);
  let last;
  let deferTimer;
  return () => {
    const context = scope || this;

    const now = +new Date();
    // eslint-disable-next-line prefer-rest-params
    // eslint-disable-next-line no-undef
    const args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
};
const uniqueID = () => Date.now();
export {
  onLoggedInChanged, tryToLogin, debounce, throttle, uniqueID,
};
