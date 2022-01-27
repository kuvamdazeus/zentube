import { useEffect, useRef } from 'react';
import jwt from 'jsonwebtoken';
import ytdl from 'ytdl-core';

export default function StreamTest() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // useEffect(() => {
  //   fetch('/api/stream')
  //     .then((res) => {
  //       console.log(res);
  //       return res.arrayBuffer();
  //     })
  //     .then((arrayBuffer) => {
  //       console.log(arrayBuffer);
  //       setTimeout(() => console.log(arrayBuffer), 5000);
  //       if (!videoRef.current) return;
  //       const blob = new Blob([arrayBuffer]);
  //       videoRef.current.src = URL.createObjectURL(blob);
  //     });
  // }, []);

  return (
    <section className="text-white">
      <p>STREAM</p>
      <video controls>
        <source
          src={`${process.env.NEXT_PUBLIC_BE}/stream?q=${jwt.sign(
            {
              url: 'https://www.youtube.com/watch?v=meTpMP0J5E8',
            },
            process.env.NEXT_PUBLIC_JWT_SECRET as string,
          )}`}
          type="video/mp4"
        />
      </video>

      {/* <video controls>
        <source src="blob:https://www.youtube-nocookie.com/3262a493-fd3a-4010-9908-42e9bacc1180https://www.youtube-nocookie.com/embed/DFup8QRqur0/?controls=1&enablejsapi=1&modestbranding=1&showinfo=0&origin=https%3A%2F%2Fwww.khanacademy.org&iv_load_policy=3&html5=1&fs=1&rel=0&hl=en&cc_lang_pref=en&cc_load_policy=0&start=0" />
      </video> */}
    </section>
  );
}
