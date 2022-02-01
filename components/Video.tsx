import React, { useEffect, useRef, useState } from 'react';
import router from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';
import Player from 'react-player';
import { IoClose } from 'react-icons/io5';
import { playerAtom } from '../state/atoms';
import type { IVideo } from '../types';
import jwt from 'jsonwebtoken';

interface Props {
  data: IVideo;
}

export default function Video({ data }: Props) {
  console.log(data);

  const getUrlQuery = () =>
    String(new URL(window.location.href).searchParams.get('q'));

  const getVideoQuery = () =>
    String(new URL(window.location.href).searchParams.get('id'));

  const playerContainerRef = useRef<HTMLElement | null>(null);

  const [playerData, setPlayerData] = useRecoilState(playerAtom);

  const [fullscreen, setFullscreen] = useState(false);

  // I HATE YOU YOUTUBE, I HATE YOU
  const getViews = (views: string) => {
    if (views.length <= 3) return views + ' views';

    if (views.length <= 6)
      return `${Math.round(parseInt(views) / 1000)}K views`;

    if (views.length <= 9)
      return `${Math.round(parseInt(views) / 1_000_000)}M views`;

    return `${Math.round(parseInt(views) / 1_000_000_000)}B views`;
  };

  // I FUCKIN' HATE YOUTUBE
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
    setPlayerData({ id: data.id, playing: true });
  };

  useEffect(() => {
    // window.addEventListener('keypress', async (e) => {
    //   if (e.key === '`' && playerContainerRef.current) {
    //     console.log('REQUESTING FULL SCREEN');
    //     setPlayerData({ id: data.id, playing: true });
    //     setFullscreen(true);
    //     await playerContainerRef.current.requestFullscreen();
    //   }
    // });

    if (getVideoQuery() === data.id) {
      console.log('Got ID, toggling player');
      togglePlayer();
      setTimeout(
        () =>
          playerContainerRef.current
            ? playerContainerRef.current.scrollIntoView()
            : null,
        500,
      );
    }

    // Choose for a custom player if the duration is <= 30 minutes, else spawn the normal yet buggy one
    // let duration = getDuration(data.duration).split(':').reverse(); // [SS, MM, HH?]
    // if (duration.length < 3 && parseInt(duration[1]) <= 30) {
    //   setCustomPlayer(true);
    // } else setCustomPlayer(false);
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
          onClick={() => {
            setPlayerData(null);
            router.push('/search?q=' + getUrlQuery(), undefined, {
              shallow: true,
            });
          }}
          className="text-2xl text-white cursor-pointer"
          color="white"
        />
      </section>
      <section className="lg:flex mb-7">
        <div className="flex-shrink-0">
          <img
            onClick={() => {
              router.push(
                '/search?q=' + getUrlQuery() + '&id=' + data.id,
                undefined,
                { shallow: true },
              );
            }}
            className="w-full lg:w-96 object-cover lg:object-contain cursor-pointer"
            src={data.thumbnail}
          />

          <div className="w-full flex justify-between -mt-7 -ml-1">
            <div />
            <div className="bg-black opacity-80 p-1">
              <p className="text-xs">{data.duration}</p>
            </div>
          </div>
        </div>

        <div className="w-full ml-3 hidden lg:block">
          <p
            onClick={() => {
              router.push(
                '/search?q=' + getUrlQuery() + '&id=' + data.id,
                undefined,
                { shallow: true },
              );
            }}
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
              src={data.channelData.thumbnail}
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

        <div className="flex lg:hidden w-full mt-4">
          <img
            src={data.channelData.thumbnail}
            className="object-contain h-10 rounded-full mr-3"
          />

          <div>
            <p
              onClick={() => {
                router.push(
                  '/search?q=' + getUrlQuery() + '&id=' + data.id,
                  undefined,
                  { shallow: true },
                );
              }}
              className="font-bold text-sm hover:underline cursor-pointer mb-1"
            >
              {data.title}
            </p>

            <p className="text-xs text-gray-400 font-light">
              {data.channelData.title} · {getViews(data.viewCount)} ·{' '}
              {new Date(data.publishedAt).toString().split(' ')[1]}{' '}
              {new Date(data.publishedAt).toString().split(' ')[3]}
            </p>
          </div>
        </div>
      </section>

      {playerData && playerData.id === data.id && (
        <section ref={playerContainerRef} className="bg-black relative">
          <section>
            <Player
              url={`https://www.youtube.com/watch?v=${playerData.id}`}
              playing={playerData.playing}
              height={fullscreen ? '100vh' : '400px'}
              width="100%"
              controls
              onPause={async () => {
                setPlayerData({ id: playerData.id, playing: false });
                // setFullscreen(false);
                // await document.exitFullscreen();
              }}
              onPlay={() => setPlayerData({ id: playerData.id, playing: true })}
              onEnded={async () => {
                setPlayerData(null);
                setFullscreen(false);
                await document.exitFullscreen();
              }}
              onBuffer={() =>
                setPlayerData({ id: playerData.id, playing: true })
              }
              config={{
                youtube: { playerVars: { fs: 1, rel: 0, showinfo: 0 } },
              }}
              playbackRate={playerData.playing ? 1 : 0.25}
              muted={playerData.playing ? false : true}
            />
          </section>

          {/* <section
                className={`
                  flex flex-col items-center justify-center h-[348px] w-full
                  cursor-pointer absolute top-0
                `}
                onClick={() =>
                  setPlayerData({
                    id: playerData.id,
                    playing: !playerData.playing,
                  })
                }
              /> */}

          {/* {customPlayer && (
            <video
              controls
              onPlay={console.log}
              onPause={console.log}
              onEnded={console.log}
            >
              <source
                src={`${process.env.NEXT_PUBLIC_BE}/stream?q=${jwt.sign(
                  {
                    url: `https://www.youtube.com/watch?v=${playerData.id}`,
                  },
                  process.env.NEXT_PUBLIC_JWT_SECRET as string,
                )}`}
                type="video/mp4"
              />
            </video>
          )} */}
        </section>
      )}
    </section>
  );
}
