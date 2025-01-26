export const isSafari =
  typeof window !== 'undefined'
    ? navigator.userAgent.indexOf('Safari') !== -1
    : false;
