const YT_SEARCH_BASE_URL = 'https://youtube.googleapis.com/youtube/v3/search';
const YT_VIDEOS_BASE_URL = 'https://youtube.googleapis.com/youtube/v3/videos';
const YT_CHANNELS_BASE_URL =
  'https://youtube.googleapis.com/youtube/v3/channels';

export const YT_GET_SEARCH_RESULTS_URL = (q: string) => {
  return `${YT_SEARCH_BASE_URL}?part=snippet&q=${q}&maxResults=15&type=video`;
};

export const YT_GET_VIDEOS_DATA_URL = (videoIds: string[]) => {
  return `${YT_VIDEOS_BASE_URL}?part=snippet,contentDetails,statistics&id=${videoIds.join(
    ',',
  )}`;
};

export const YT_GET_CHANNELS_DATA_URL = (channelIds: string[]) => {
  return `${YT_CHANNELS_BASE_URL}?part=snippet&id=${channelIds.join(',')}`;
};
