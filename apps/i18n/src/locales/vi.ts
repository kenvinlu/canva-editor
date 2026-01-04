import { IConfigApp } from '../constraint';
import { Authentication, Common, Footer, Header, Blog, Editor, Home } from '../modules/vi';

const config: IConfigApp = {
  common: Common,
  header: Header,
  footer: Footer,
  auth: Authentication,
  blog: Blog,
  editor: Editor,
  home: Home,
};

module.exports = config;
