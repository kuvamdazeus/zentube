import { useState } from 'react';
import type { NextPage } from 'next';
import router from 'next/router';
import { GoogleLoginResponse, useGoogleLogin } from 'react-google-login';
import { useSetRecoilState } from 'recoil';
import { authAtom, userAtom } from '../state/atoms';
import cookie from 'react-cookies';

const Home: NextPage = () => {
  const [searchInputTimer, setSearchInputTimer] = useState<number | null>(null);

  const [searchInput, setSearchInput] = useState('');

  const setUser = useSetRecoilState(userAtom);

  const setAuth = useSetRecoilState(authAtom);

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    // TODO: Add autocomplete to homepage search
    // clearTimeout(searchInputTimer as number);
    // setTimeout(async () => {
    //   const res = await fetch(`
    //     https://www.google.com/complete/search?client=hp&hl=en&sugexp=msedr&gs_rn=62&gs_ri=hp&cp=1&gs_id=9c&q=${e.target.value}&xhr=t
    //   `);
    //   const data = await res.json();
    //   console.log(data);
    // }, 1000);
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const tokenData = cookie.load('token_data');

    if (!tokenData) signIn();
    else if (!!searchInput.trim()) router.push('/search?q=' + searchInput);
  };

  const handleFame = (data: GoogleLoginResponse) => {
    console.log('HANDLE FAME', data);
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
  });

  return (
    <section className="text-white flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center">
        <img
          className="object-contain h-[70px] lg:h-[100px] mb-5"
          src="/logo.png"
        />
        <form onSubmit={handleInputSubmit}>
          <input
            placeholder="Search"
            className="
              py-1 px-2 text-lg bg-black text-slate-300
              w-80 lg:w-96 border border-light
            "
            onChange={onSearchInputChange}
          />
        </form>
        {/* {searchInput.trim().length !== 0 && searchResults && (
          <div className="w-96 bg-lightdark">
            <section
              className="
                border-b border-t border-[rgb(45,45,45)] p-2 cursor-pointer hover:bg-light
              "
            >
              <p className="">
                how to do s<span>tand up comedy</span>
              </p>
            </section>
          </div>
        )} */}
      </div>
    </section>
  );
};

export default Home;
