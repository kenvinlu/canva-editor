import { IConfigApp } from '../constraint';
import { Authentication, Common, Footer, Header, Blog, Editor, Home, User, SEO } from '../modules/en';

const config: IConfigApp = {
  home: Home,
  common: Common,
  header: Header,
  footer: Footer,
  auth: Authentication,
  blog: Blog,
  editor: Editor,
  user: User,
  seo: SEO,
};

module.exports = config;
