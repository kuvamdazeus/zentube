import { atom } from 'recoil';
import { IPlayer, IUser } from '../types';

export const userAtom = atom<IUser | null>({
  key: 'userAtom',
  default: null,
});

export const searchInputAtom = atom<HTMLInputElement | null>({
  key: 'searchInputAtom',
  default: null,
});

export const playerAtom = atom<IPlayer | null>({
  key: 'playerAtom',
  default: null,
});

export const authAtom = atom({
  key: 'authAtom',
  default: false,
});

export const customPlayerAtom = atom({
  key: 'customPlayerAtom',
  default: false,
});

// export const streamServerStateAtom = atom<IStreamServerState>({
//   key: 'streamServerState',
//   default: 'down',
// });
