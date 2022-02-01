import { NextApiRequest, NextApiResponse } from 'next';
import yts from 'yt-search';
import jwt from 'jsonwebtoken';
import {
  YT_GET_CHANNELS_DATA_URL,
  YT_GET_VIDEOS_DATA_URL,
} from '../../constants/youtubeAPI';
import { IVideo } from '../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let searchQuery: string | null = null;
  try {
    searchQuery = jwt.verify(
      req.query.q as string,
      process.env.NEXT_PUBLIC_JWT_SECRET as string,
    ) as string;
  } catch (err) {
    return res.status(200).send('🧐');
  }

  console.log(searchQuery);

  const data = await yts(searchQuery);
  const videos: IVideo[] = [];

  data.videos.slice(0, 15).forEach((video) => {
    const videoData = {
      id: video.videoId,
      title: video.title,
      description: '',
      duration: video.duration.timestamp,
      viewCount: video.views.toString(),
      thumbnail: video.thumbnail,
      channelData: {
        title: video.author.name,
        thumbnail: '',
      },
      likeCount: '',
      publishedAt: '',
    };

    videos.push(videoData);
  });

  const ids = videos.map((video) => video.id);
  const channelIds: string[] = [];

  // Get videos
  const ytVideosData: any = await fetch(
    `${YT_GET_VIDEOS_DATA_URL(ids)}&key=${process.env.NEXT_PUBLIC_YT_API_KEY}`,
  ).then((res) => res.json());

  const ytVideos = ytVideosData.items as any[];
  videos.forEach((video) => {
    const corrYtVideo = ytVideos.find((ytVideo) => ytVideo.id === video.id);

    video.publishedAt = corrYtVideo.snippet.publishedAt;
    video.likeCount = corrYtVideo.contentDetails.likeCount;
    video.description = corrYtVideo.snippet.description;

    channelIds.push(corrYtVideo.snippet.channelId);
  });

  // Get corresponding channels
  const ytChannlelsData: any = await fetch(
    `${YT_GET_CHANNELS_DATA_URL(channelIds)}&key=${
      process.env.NEXT_PUBLIC_YT_API_KEY
    }`,
  ).then((res) => res.json());

  const ytChannels = ytChannlelsData.items;
  videos.forEach((video) => {
    const corrYtVideo = ytVideos.find((ytVideo) => ytVideo.id === video.id);
    const corrYtChannel = ytChannels.find(
      (ytChannel: any) => ytChannel.id === corrYtVideo.snippet.channelId,
    );

    video.channelData.thumbnail = corrYtChannel.snippet.thumbnails.default.url;
  });

  console.log(videos);
  return res.status(200).json(videos);
}
