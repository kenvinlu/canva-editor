import { IConfigApp } from '../constraint';
import { Authentication, Common, Footer, Header, Blog, Editor, Home } from '../modules/en';

const config: IConfigApp = {
  home: Home,
  common: Common,
  header: Header,
  footer: Footer,
  auth: Authentication,
  blog: Blog,
  editor: Editor,
};

module.exports = config;
