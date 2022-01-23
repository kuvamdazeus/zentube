import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import cookie from 'react-cookies';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <section className="min-h-screen bg-[#181818] pb-1">
        <Component {...pageProps} />
      </section>
    </RecoilRoot>
  );
}

export default MyApp;
