export type MenuItem = {
  id?: number;
  label: string;
  href: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  order?: number;
  isAuth?: boolean;
};

export type Menu = {
  id?: number;
  items?: MenuItem[];
};

export type Configuration = {
  id?: number;
  site_title?: string;
  site_url?: string;
  top_message?: string;
  top_message_enabled?: boolean;
  top_message_type?: 'info' | 'success' | 'warning' | 'error';
  header_menu?: Menu;
  footer_menu?: Menu;
  createdAt?: string;
  updatedAt?: string;
};

