import { useEffect, useRef } from 'react';
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
          src={`http://localhost:3000/api/stream?q=${'eyJhbGciOiJIUzI1NiJ9.aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g_dj1tZVRwTVAwSjVFOA.23-cQHrFlaj-yIpGnPHmhM3mlRead579GDN-tvUi7Ws'}`}
          type="video/mp4"
        />
      </video>
    </section>
  );
}
