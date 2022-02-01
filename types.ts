interface Thumbnail {
  height: number;
  width: number;
  url: string;
}

// export type IStreamServerState = 'down' | 'up';

export interface IGoogleAuthResponse {
  expires_at: number;
  access_token: string;
}

export interface IUser {
  name: string;
  imageUrl: string;
}

export interface IPlayer {
  playing: boolean;
  id: string;
}

export interface IVideo {
  id: string;
  channelData: {
    title: string;
    thumbnail: string;
  };
  description: string;
  duration: string;
  likeCount: string;
  viewCount: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}
