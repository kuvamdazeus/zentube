import React, { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { playerAtom } from '../state/atoms';
import type { IVideo } from '../types';
import Player from 'react-player';
import { FaPlay } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

interface Props {
  data: IVideo;
}

export default function Video({ data }: Props) {
  const windowIsFullScreen = () =>
    window.innerWidth == screen.width && window.innerHeight == screen.height;

  const playerContainerRef = useRef<HTMLElement | null>(null);

  const [playerData, setPlayerData] = useRecoilState(playerAtom);

  // const { signIn } = useGoogleLogin({
  //   clientId: process.env.NEXT_PUBLIC_GAUTH_CLIENTID,
  // });

  // I HATE YOU YOUTUBE, I HATE YOU
  const getViews = (views: string) => {
    if (views.length <= 3) return views + ' views';

    if (views.length <= 6)
      return `${Math.round(parseInt(views) / 1000)}K views`;

    if (views.length <= 9)
      return `${Math.round(parseInt(views) / 1_000_000)}M views`;

    return `${Math.round(parseInt(views) / 1_000_000_000)}B views`;
  };

  // I HATE YOU YOUTUBE, I HATE YOU
  const getDuration = (durationStr: string) => {
    let hoursMatch = durationStr.match(/(\d+)H/);
    let minutesMatch = durationStr.match(/(\d+)M/);
    let secondsMatch = durationStr.match(/(\d+)S/);

    return (
      (hoursMatch
        ? (hoursMatch[1].length == 1 ? '0' + hoursMatch[1] : hoursMatch[1]) +
          ':'
        : '') +
      (minutesMatch
        ? (minutesMatch[1].length == 1
            ? '0' + minutesMatch[1]
            : minutesMatch[1]) + ':'
        : '00:') +
      (secondsMatch
        ? secondsMatch[1].length == 1
          ? '0' + secondsMatch[1]
          : secondsMatch[1]
        : '00')
    );
  };

  const getDescription = (description: string) => {
    description = description.replaceAll(/\n+/g, ' ');
    if (description.length >= 100)
      description = description.slice(0, 200) + '...';
    return description;
  };

  const togglePlayer = () => {
    if (playerData && playerData.id !== data.id)
      return setPlayerData({ id: data.id, playing: true });

    if (!playerData) setPlayerData({ id: data.id, playing: true });
    else setPlayerData(null);
  };

  useEffect(() => {
    window.addEventListener('keypress', async (e) => {
      if (e.key === '`' && playerContainerRef.current) {
        if (windowIsFullScreen())
          await playerContainerRef.current.requestFullscreen();
        console.log('REQUESTING FULL SCREEN');
      }
    });
  }, []);

  return (
    <section
      className={`${
        playerData &&
        playerData.id === data.id &&
        'bg-[#292929] p-3 rounded mb-10'
      }`}
    >
      <section
        className={`
          ${
            playerData && playerData.id === data.id ? 'block' : 'hidden'
          } flex justify-between w-full
        `}
      >
        <div />
        <IoClose
          onClick={() => setPlayerData(null)}
          className="text-2xl text-white cursor-pointer"
          color="white"
        />
      </section>
      <section className="flex mb-7">
        <div className="flex-shrink-0">
          <img
            onClick={togglePlayer}
            className="object-contain cursor-pointer"
            src={data.thumbnails.medium.url}
          />

          <div className="w-full flex justify-between -mt-7 -ml-1">
            <div />
            <div className="bg-black opacity-80 p-1">
              <p className="text-xs">{getDuration(data.duration)}</p>
            </div>
          </div>
        </div>

        <div className="w-full ml-3">
          <p
            onClick={togglePlayer}
            className="font-bold text-lg hover:underline cursor-pointer w-max"
          >
            {data.title}
          </p>

          <p className="text-xs text-gray-400 font-light">
            {getViews(data.viewCount)} ·{' '}
            {new Date(data.publishedAt).toString().split(' ')[1]}{' '}
            {new Date(data.publishedAt).toString().split(' ')[3]}
          </p>

          <div className="flex items-center my-4">
            <img
              src={data.channelData.thumbnails.default.url}
              className="object-contain h-7 rounded-full mr-1.5"
            />
            <p className="text-xs text-gray-400 font-light">
              {data.channelData.title}
            </p>
          </div>

          <p className="text-xs text-gray-400 font-light">
            {getDescription(data.description)}
          </p>
        </div>
      </section>

      {playerData && playerData.id === data.id && (
        <section
          ref={playerContainerRef}
          className="bg-black h-screen relative"
        >
          <section className={`${playerData.playing ? 'block' : 'hidden'}`}>
            <Player
              url={`https://www.youtube.com/watch?v=${playerData.id}`}
              playing={playerData.playing}
              height="100vh"
              width="100%"
              controls
              onPause={async () => {
                setPlayerData({ id: playerData.id, playing: false });
                if (windowIsFullScreen()) await document.exitFullscreen();
              }}
              onPlay={() => setPlayerData({ id: playerData.id, playing: true })}
              onEnded={async () => {
                if (windowIsFullScreen()) await document.exitFullscreen();
                setPlayerData(null);
              }}
              onBuffer={() =>
                setPlayerData({ id: playerData.id, playing: true })
              }
              config={{
                youtube: { playerVars: { fs: 1, rel: 0, showinfo: 0 } },
              }}
            />
          </section>

          <section
            className={`
              flex flex-col items-center justify-center h-screen w-full
              ${playerData.playing ? 'hidden' : 'block'}
              border border-dotted bg-black cursor-pointer
            `}
            onClick={() => setPlayerData({ id: playerData.id, playing: true })}
          >
            <FaPlay className="text-2xl cursor-pointer mr-5" />
          </section>
        </section>
      )}
    </section>
  );
}
