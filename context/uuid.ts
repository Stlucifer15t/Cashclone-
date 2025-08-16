import 'react-native-get-random-values';

// @ts-expect-error - The crypto polyfill is not typed correctly
if (typeof crypto === 'undefined') {
  // @ts-expect-error - The crypto polyfill is not typed correctly
  global.crypto = {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
    },
  };
}

export { v4 } from 'uuid';
