import { ICommon } from './interfaces';
import { IAuthentication } from './interfaces/authentication';
import { IFooter } from './interfaces/footer';
import { IHeader } from './interfaces/header';
import { IBlog } from './interfaces/blog';
import { IEditor } from './interfaces/editor';
import { IHome } from './interfaces/home';

export interface IConfigApp {
  home: IHome;
  header: IHeader;
  footer: IFooter;
  common: ICommon;
  auth: IAuthentication;
  blog: IBlog;
  editor: IEditor;
}

// We'll need this type for our production config.
// Alternatively, you can use ts-essentials https://github.com/krzkaczor/ts-essentials
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};
