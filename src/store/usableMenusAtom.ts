import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { UsableMenuEntity } from '../types/MenuEntity';

export type UsableMenusStateEntity = UsableMenuEntity & {};

const initMenu = {
  menuId: 0,
  menuName: '',
  menuUrl: '',
  parentId: null,
  accessibleRoles: [],
  menuDepth: 0,
  children: [],
} as UsableMenusStateEntity;

// sessionStorage에 상태를 저장하기 위한 Recoil Persist 설정
const { persistAtom: usableMenusPersist } = recoilPersist({
  key: 'usableMenusPersist', // Key to identify the storage
  storage: sessionStorage, // Use sessionStorage for persistence
});

export const usableMenusState = atom<UsableMenusStateEntity>({
  key: 'usableMenusState', // unique ID (with respect to other atoms/selectors)
  default: initMenu, // initial value (aka initial state)
  effects_UNSTABLE: [usableMenusPersist], // Apply persistence
});
