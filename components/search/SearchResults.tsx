import { useEffect, useRef, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineLogout } from 'react-icons/md';
import router from 'next/router';
import cookie from 'react-cookies';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  YT_GET_CHANNELS_DATA_URL,
  YT_GET_SEARCH_RESULTS_URL,
  YT_GET_VIDEOS_DATA_URL,
} from '../../constants/youtubeAPI';
import type { IGoogleAuthResponse, IVideo } from '../../types';
import Video from '../../components/Video';
import { authAtom, searchInputAtom, userAtom } from '../../state/atoms';
import { useGoogleLogin } from 'react-google-login';

export default function SearchResults() {
  const getUrlQuery = () =>
    String(new URL(window.location.href).searchParams.get('q'));

  const getVideoQuery = () =>
    String(new URL(window.location.href).searchParams.get('id'));

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [user, setUser] = useRecoilState(userAtom);
  const [auth, setAuth] = useRecoilState(authAtom);
  const setSearchInputElem = useSetRecoilState<HTMLInputElement | null>(
    searchInputAtom,
  );

  const [searchInput, setSearchInput] = useState<string>(getUrlQuery());
  const [data, setData] = useState<IVideo[]>([]);

  const handleSearchInputSubmit = (
    e: React.FormEvent<HTMLFormElement> | null,
  ) => {
    if (e) e.preventDefault();

    if (searchInput && !!searchInput.trim()) {
      fetchSearchResults();
      router.push('/search?q=' + searchInput);
    }
  };

  // YT, I HATE YOU!!!
  const fetchSearchResults = async (bypassUrlCheck = false) => {
    const cookieData = cookie.load('token_data');
    if (!cookieData) return null;

    const videoCache = sessionStorage.getItem('videos');
    if (videoCache) {
      interface _ISessionVideoCache {
        query: string;
        data: IVideo[];
      }

      const cachedData: _ISessionVideoCache = JSON.parse(videoCache);

      if (cachedData.query === getUrlQuery() && auth) {
        setData(cachedData.data);
        return null;
      }
    }

    const { expires_at, access_token }: IGoogleAuthResponse = cookieData;

    // LOGOUT LOGIC
    if (new Date() >= new Date(expires_at)) {
      setUser(null);
      cookie.remove('token_data');
      setAuth(false);
      return null;
    }

    if (!auth || (searchInput === getUrlQuery() && !bypassUrlCheck))
      return null;
    // TODO: show errors

    // Search REQUEST
    console.info('FETCHING SEARCH RESULTS');
    const searchRes = await fetch(YT_GET_SEARCH_RESULTS_URL(searchInput), {
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    });
    if (searchRes.status !== 200)
      return console.log('SET ERRORS & DISPLAY THEM', searchRes);
    const searchData = await searchRes.json();

    const videoIds = searchData.items.map(
      (videoItem: any) => videoItem.id.videoId,
    ) as string[];

    // Videos data fetch REQUEST
    const videosRes = await fetch(YT_GET_VIDEOS_DATA_URL(videoIds), {
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    });

    if (videosRes.status !== 200)
      return console.log('SET ERRORS & DISPLAY', videosRes);
    const videosData = await videosRes.json();

    const channelIds: string[] = [];
    const videos = videosData.items.map((videoData: any) => {
      channelIds.push(videoData.snippet.channelId);

      const { title, description, thumbnails, channelId, publishedAt } =
        videoData.snippet;
      const { duration } = videoData.contentDetails;
      const { viewCount, likeCount } = videoData.statistics;
      return {
        id: videoData.id,
        title,
        description,
        viewCount,
        likeCount,
        duration,
        thumbnails,
        channelId,
        publishedAt,
      };
    });

    // Corresponding videos' channel fetch REQUEST
    const channelRes = await fetch(YT_GET_CHANNELS_DATA_URL(channelIds), {
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    });

    if (channelRes.status !== 200)
      return console.log('SET ERRORS & DISPLAY', channelRes);
    const channelsData = await channelRes.json();

    const channels: { [key: string]: any } = {};
    channelsData.items.forEach((channel: any) => {
      const { title, thumbnails, customUrl } = channel.snippet;
      channels[channel.id as string] = { title, thumbnails, customUrl };
    });

    const data: IVideo[] = videos.map((video: any) => {
      return { ...video, channelData: channels[video.channelId] };
    });

    // 3 FETCH REQUESTS
    // FUCKIN' SWEAR TO GOD, if there's a stupid 400 error, i'm gonna lose it
    setData(data);
    sessionStorage.setItem(
      'videos',
      JSON.stringify({ query: searchInput, data }),
    );
  };

  const handleSuccess = (data: any) => {
    const {
      expires_at,
      access_token,
    }: { expires_at: number; access_token: string } = data.tokenObj;

    const { name, imageUrl } = data.profileObj;
    setUser({ name, imageUrl });

    cookie.save('token_data', JSON.stringify({ expires_at, access_token }), {
      path: '/',
    });

    setAuth(true);
  };

  const { signIn } = useGoogleLogin({
    clientId: process.env.NEXT_PUBLIC_GAUTH_CLIENTID as string,
    onSuccess: handleSuccess,
    onFailure: console.error,
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
  });

  useEffect(() => {
    if (cookie.load('token_data')) setAuth(true);
    setSearchInputElem(searchInputRef.current);
  }, []);

  useEffect(() => {
    if (auth) fetchSearchResults(true);
  }, [auth]);

  return (
    <section className="text-white relative">
      <nav className="flex justify-between items-center bg-lightdark px-3 py-3">
        <div
          className="h-6 lg:h-8 flex-shrink-0 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <img
            src="/logo.png"
            className="object-contain h-full hidden lg:block"
          />
          <img
            src="/logo_mobile.svg.png"
            className="object-contain h-full lg:hidden"
          />
        </div>

        <div className="flex items-center">
          <form onSubmit={handleSearchInputSubmit}>
            <input
              ref={searchInputRef}
              placeholder="Search"
              className="
                px-2 lg:px-3 py-1 lg:py-2 bg-dark text-gray-300 w-[200px] lg:w-[400px] border border-light outline-none
                text-sm lg:text-base
              "
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>

          <div
            onClick={() => handleSearchInputSubmit(null)}
            className="bg-light h-[30px] lg:h-[42px] w-[40px] lg:w-[60px] flex justify-center items-center cursor-pointer"
          >
            <IoIosSearch className="text-gray-300 text-xl lg:text-2xl" />
          </div>
        </div>

        {/* TODO: Add signIn logic to *this* div */}
        {!auth && (
          <div
            onClick={signIn}
            className="lg:border border-blue-400 lg:px-3 py-1.5 flex items-center cursor-pointer"
          >
            <CgProfile className="text-blue-400 mr-1 text-[22px] lg:text-[20px]" />
            <p className="hidden lg:block text-blue-400 font-bold">SIGN IN</p>
          </div>
        )}

        {auth && (
          <div
            // className="
            //   lg:px-3 py-1 rounded border border-red-500 text-red-500 cursor-pointer
            //   hover:bg-red-500 hover:text-white
            //   transition-all duration-300
            // "
            className="lg:border border-red-500 lg:px-3 py-1.5 flex items-center cursor-pointer"
            onClick={() => {
              cookie.remove('token_data');
              setUser(null);
              setAuth(false);
              setData([]);
            }}
          >
            <MdOutlineLogout className="text-red-500 mr-1 text-[22px] lg:text-[20px]" />
            <p className="hidden lg:block text-red-500 font-bold">LOGOUT</p>
          </div>
        )}
      </nav>
      {/* --- */}

      {auth && data && (
        <section className="pt-3 lg:pt-7 px-5 lg:px-10">
          {data.map((video) => (
            <Video key={video.id} data={video} />
          ))}
        </section>
      )}

      {!auth && (
        <p className="text-center text-3xl text-light font-bold mt-56">
          Please{' '}
          <span
            className="
              text-gray-400 rounded cursor-pointer bg-blue-900 px-2 py-1
            "
            onClick={signIn}
          >
            Sign in
          </span>{' '}
          with <span className="text-red-900">Google</span> to use this app
        </p>
      )}

      {/* --- */}
    </section>
  );
}
