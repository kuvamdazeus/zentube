export interface IGoogleAuthResponse {
  expires_at: number;
  access_token: string;
}

interface Thumbnail {
  height: number;
  width: number;
  url: string;
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
    customUrl: string;
    thumbnails: { default: Thumbnail; medium: Thumbnail; high: Thumbnail };
  };
  channelId: string;
  description: string;
  duration: string;
  likeCount: string;
  viewCount: string;
  title: string;
  thumbnails: { default: Thumbnail; medium: Thumbnail; high: Thumbnail };
  publishedAt: string;
}
