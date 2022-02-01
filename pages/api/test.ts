import { NextApiRequest, NextApiResponse } from 'next';
import { getInfo } from 'ytdl-core';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const videoInfo = await getInfo('q0oaE9LLQ8');
  return res.status(200).json(videoInfo.videoDetails);
}
