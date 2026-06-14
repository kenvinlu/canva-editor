import { UserModel } from '../models/user.model';
import { Configuration, MenuItem } from '../models/configuration.model';

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

export interface IConfigurationState {
  topMessage: string | null;
  topMessageEnabled: boolean | null;
  topMessageType: 'info' | 'success' | 'warning' | 'error' | null;
  headerMenu: MenuItem[];
  footerMenu: MenuItem[];
  setConfiguration: (configuration: Partial<Configuration>) => void;
  getHeaderMenu: () => MenuItem[];
  getTopMessage: () => {
    topMessage: string | null;
    topMessageEnabled: boolean | null;
    topMessageType: 'info' | 'success' | 'warning' | 'error' | null;
  };
}
