import { useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import router from 'next/router';
import { GoogleLoginResponse, useGoogleLogin } from 'react-google-login';
import { useSetRecoilState } from 'recoil';
import { authAtom, userAtom } from '../state/atoms';
import cookie from 'react-cookies';

const Home: NextPage = () => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchInputTimer, setSearchInputTimer] =
    useState<NodeJS.Timeout | null>(null);

  const setUser = useSetRecoilState(userAtom);
  const setAuth = useSetRecoilState(authAtom);

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setSearchResults([]);

    if (!e.target.value.trim()) return;

    clearTimeout(searchInputTimer as NodeJS.Timeout);
    setSearchInputTimer(
      setTimeout(async () => {
        const res = await fetch(`/api/search?q=${e.target.value}`);
        const data = await res.json();
        setSearchResults(data);
      }, 300),
    );
  };

  const handleInputSubmit = (
    e: React.FormEvent<HTMLFormElement> | null,
    searchInputQuery: string,
  ) => {
    if (e) e.preventDefault();

    const tokenData = cookie.load('token_data');

    if (!tokenData) signIn();
    else if (tokenData && !!searchInput.trim())
      router.push('/search?q=' + searchInputQuery);
  };

  const handleFame = (data: GoogleLoginResponse) => {
    const { expires_at, access_token } = data.tokenObj;

    const { name, imageUrl } = data.profileObj;
    setUser({ name, imageUrl });

    cookie.save('token_data', JSON.stringify({ expires_at, access_token }), {
      path: '/',
    });

    setAuth(true);
    router.push('/search?q=' + searchInput);
  };

  const { signIn } = useGoogleLogin({
    clientId: process.env.NEXT_PUBLIC_GAUTH_CLIENTID as string,
    onSuccess: (data) => handleFame(data as GoogleLoginResponse),
    onFailure: console.error,
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
  });

  useEffect(() => {
    // TODO: Make keyboard operable suggestion box & componentiate the thing
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  return (
    <section className="text-white flex justify-center h-screen">
      <div className="flex flex-col items-center mt-[20%]">
        <img
          className="object-contain h-[70px] lg:h-[100px] mb-5"
          src="/logo.png"
        />

        <form onSubmit={(e) => handleInputSubmit(e, searchInput)}>
          <input
            ref={searchInputRef}
            placeholder="Search"
            className="
              py-1 px-2 text-lg bg-black text-slate-300
              w-80 lg:w-96 border border-light
            "
            onChange={onSearchInputChange}
            value={searchInput}
          />
        </form>

        {searchInput.trim().length !== 0 && searchResults && (
          <div className="w-80 lg:w-96 bg-lightdark">
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
        )}
      </div>
    </section>
  );
};

export default Home;
