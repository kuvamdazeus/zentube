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
      <video controls className="h-96">
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
    </section>
  );
}
