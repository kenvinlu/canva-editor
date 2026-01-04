export type IPrivateRoute = {
  pathname: string;
};

export const authenticatedRoutes: IPrivateRoute[] = [
  {
    pathname: '/dashboard',
  },
  {
    pathname: '/profile',
  },
  {
    pathname: '/profile/settings',
  },
  {
    pathname: '/design/',
  },
  {
    pathname: '/projects',
  },
  {
    pathname: '/2fa-app-setup',
  },
];

export const unauthenticatedRoutes = ['/', '/sign-in', '/sign-up', '/forgot-password', '/reset-password'];
export const defaultRoute = '/';
// export const defaultRoute = '/projects';
