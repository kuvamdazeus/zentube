import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { SiBuymeacoffee } from 'react-icons/si';
import router from 'next/router';
import cookie from 'react-cookies';
import { useSetRecoilState } from 'recoil';
import type { IGoogleAuthResponse, IVideo } from '../../types';
import Video from '../../components/Video';
import { searchInputAtom } from '../../state/atoms';
import jwt from 'jsonwebtoken';

export default function SearchResults() {
  const getUrlQuery = () =>
    String(new URL(window.location.href).searchParams.get('q'));

  const getVideoQuery = () =>
    String(new URL(window.location.href).searchParams.get('id'));

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const setSearchInputElem = useSetRecoilState<HTMLInputElement | null>(
    searchInputAtom,
  );

  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>(getUrlQuery());
  const [data, setData] = useState<IVideo[]>([]);
  const [searchInputTimer, setSearchInputTimer] =
    useState<NodeJS.Timeout | null>(null);

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

      if (cachedData.query === getUrlQuery().toLowerCase()) {
        setData(cachedData.data);
        return null;
      }
    }

    const { expires_at, access_token }: IGoogleAuthResponse = cookieData;

    // // LOGOUT LOGIC
    // if (new Date() >= new Date(expires_at)) {
    //   setUser(null);
    //   cookie.remove('token_data');
    //   setAuth(false);
    //   return null;
    // }

    if (searchInput === getUrlQuery() && !bypassUrlCheck) return null;
    // TODO: show errors

    const q = jwt.sign(
      searchInput,
      process.env.NEXT_PUBLIC_JWT_SECRET as string,
    );
    const data = await fetch(`/api/search?q=${q}`).then((res) => res.json());

    setData(data);
    sessionStorage.setItem(
      'videos',
      JSON.stringify({ query: searchInput, data }),
    );
  };

  // const handleSuccess = (data: any) => {
  //   const {
  //     expires_at,
  //     access_token,
  //   }: { expires_at: number; access_token: string } = data.tokenObj;

  //   const { name, imageUrl } = data.profileObj;
  //   setUser({ name, imageUrl });

  //   cookie.save('token_data', JSON.stringify({ expires_at, access_token }), {
  //     path: '/',
  //   });

  //   setAuth(true);
  // };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setSearchResults([]);

    if (!e.target.value.trim()) return;

    clearTimeout(searchInputTimer as NodeJS.Timeout);
    setSearchInputTimer(
      setTimeout(async () => {
        const res = await fetch(`/api/autocomplete?q=${e.target.value}`);
        const data = (await res.json()) as string[];
        setSearchResults(data);
      }, 300),
    );
  };

  // const { signIn } = useGoogleLogin({
  //   clientId: process.env.NEXT_PUBLIC_GAUTH_CLIENTID as string,
  //   onSuccess: handleSuccess,
  //   onFailure: console.error,
  //   scope: 'https://www.googleapis.com/auth/youtube.readonly',
  // });

  useEffect(() => {
    // if (cookie.load('token_data')) setAuth(true);
    setSearchInputElem(searchInputRef.current);
    fetchSearchResults(true);
  }, []);

  // useEffect(() => {
  //   if (auth) fetchSearchResults(true);
  // }, [auth]);

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
              onChange={handleSearchInputChange}
            />
          </form>

          <div
            onClick={() => handleSearchInputSubmit(null)}
            className="bg-light h-[30px] lg:h-[42px] w-[40px] lg:w-[60px] flex justify-center items-center cursor-pointer"
          >
            <IoIosSearch className="text-gray-300 text-xl lg:text-2xl" />
          </div>
        </div>

        <a
          href="https://buymeacoffee.com/kuvam"
          target="_blank"
          rel="noreferrer"
          className="lg:border border-yellow-400 lg:px-3 py-1.5 flex items-center cursor-pointer"
        >
          <SiBuymeacoffee className="mr-1 text-[22px] lg:text-[20px] text-yellow-400" />
          <p className="hidden lg:block text-yellow-400 font-bold">LIKE IT?</p>
        </a>

        {/* {auth && (
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
        )} */}
      </nav>
      {/* --- */}

      {data && (
        <section className="pt-3 lg:pt-7 px-5 lg:px-10">
          {data.map((video) => (
            <Video key={video.id} data={video} />
          ))}
        </section>
      )}

      {/* {!auth && (
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
      )} */}

      {/* --- */}

      {searchInput.trim().length !== 0 && searchResults && (
        <section className="absolute top-[53px] w-full flex justify-center">
          <div className="w-80 lg:w-[446px] bg-lightdark">
            {searchResults.slice(0, 5).map((searchResult) => (
              <section
                className="
                    border-b border-t border-[rgb(45,45,45)] p-2 cursor-pointer hover:bg-light
                  "
                onClick={() => {
                  setSearchInput(searchInput + searchResult);
                  setSearchResults([]);
                  if (searchInputRef.current) searchInputRef.current.focus();
                }}
              >
                <p className="text-gray-300">
                  {searchInput}
                  <span className="text-white font-bold">{searchResult}</span>
                </p>
              </section>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
