import { UserModel } from '../models/user.model';

export interface IUserState {
  userData: UserModel | null;
  isLoggedIn: boolean;
  hydrated: boolean;
  setUser: (user: UserModel) => void;
  updateUser: (user: Partial<UserModel>) => void;
  logout: () => void;
  setHydrated: () => void;
}

export interface ICommonState {
  loadingActions: string[];
  addLoading: (action: string) => void;
  removeLoading: (action: string) => void;
  isLoading: (action: string) => boolean;
}
