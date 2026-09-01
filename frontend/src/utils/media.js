import BACKEND_URL from '../config';

export const getMediaUrl = (mediaPath) => {
  if (!mediaPath) return '';
  if (
    mediaPath.startsWith('http://') ||
    mediaPath.startsWith('https://') ||
    mediaPath.startsWith('blob:')
  ) {
    return mediaPath;
  }
  return `${BACKEND_URL}${mediaPath.startsWith('/') ? '' : '/'}${mediaPath}`;
};
