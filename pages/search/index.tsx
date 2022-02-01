import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { getInfo } from 'ytdl-core';
import { YT_GET_VIDEOS_DATA_URL } from '../../constants/youtubeAPI';

interface _IVideoPreviewData {
  title: string;
  description: string;
  thumbnail: string;
}

interface Props {
  previewData: _IVideoPreviewData;
}

export default function Search({ previewData }: Props) {
  const SearchResults = dynamic(
    () => import('../../components/search/SearchResults'),
  );

  return (
    <section>
      <Head>
        <title>Search ZenTUBE</title>

        <meta property="og:title" content={previewData && previewData.title} />

        <meta
          property="og:description"
          content={previewData && previewData.description}
        />

        <meta
          property="og:image"
          content={previewData && previewData.thumbnail}
        />
      </Head>

      <SearchResults />
    </section>
  );
}

// Get video preview data in case there is an 'id' param in url
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const videoId = query.id;

  let videoData: any = null;

  if (videoId) {
    const url =
      YT_GET_VIDEOS_DATA_URL([videoId as string]) +
      '&key=' +
      process.env.NEXT_PUBLIC_YT_API_KEY;

    const response = await fetch(url);
    const data: any = await response.json();

    if (data?.items?.length !== 0) {
      videoData = {
        title: data.items[0].snippet.title,
        description: (data.items[0].snippet.description as string).slice(
          0,
          100,
        ),
        thumbnail: data.items[0].snippet.thumbnails.high.url,
      };
    }
  }

  return {
    props: {
      previewData: videoData ? videoData : null,
    },
  };
};
