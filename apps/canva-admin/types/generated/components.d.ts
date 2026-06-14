import type { Schema, Struct } from '@strapi/strapi';

export interface FontFamilyFontFamily extends Struct.ComponentSchema {
  collectionName: 'components_font_family_font_families';
  info: {
    displayName: 'Font Family';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    style: Schema.Attribute.String;
    url: Schema.Attribute.Text;
  };
}

export interface MenuMenu extends Struct.ComponentSchema {
  collectionName: 'components_menu_menus';
  info: {
    displayName: 'Menu';
    icon: 'menu';
  };
  attributes: {
    items: Schema.Attribute.Component<'menu.menu-item', true>;
  };
}

export interface MenuMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_menu_menu_items';
  info: {
    displayName: 'Menu Item';
    icon: 'list';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    isAuth: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    target: Schema.Attribute.Enumeration<
      ['_self', '_blank', '_parent', '_top']
    > &
      Schema.Attribute.DefaultTo<'_self'>;
  };
}

export interface MessageReplyMessageReply extends Struct.ComponentSchema {
  collectionName: 'components_message_reply_message_replies';
  info: {
    description: 'A reply to a message in the inbox thread';
    displayName: 'Message Reply';
  };
  attributes: {
    content: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    isAdmin: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    senderEmail: Schema.Attribute.Email & Schema.Attribute.Required;
    senderName: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsCardSlider extends Struct.ComponentSchema {
  collectionName: 'components_sections_card_sliders';
  info: {
    description: 'Horizontal card slider showing multiple blog posts';
    displayName: 'Card slider';
    icon: 'grid';
  };
  attributes: {
    articles: Schema.Attribute.Relation<'manyToMany', 'api::article.article'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsColumnList extends Struct.ComponentSchema {
  collectionName: 'components_sections_column_lists';
  info: {
    description: 'Column-based list of blog posts';
    displayName: 'Column list';
    icon: 'bulletList';
  };
  attributes: {
    articles: Schema.Attribute.Relation<'manyToMany', 'api::article.article'>;
    columns: Schema.Attribute.Integer;
    title: Schema.Attribute.String;
  };
}

export interface SectionsHeroSlideshow extends Struct.ComponentSchema {
  collectionName: 'components_sections_hero_slideshows';
  info: {
    description: 'Top banner slideshow for blog home';
    displayName: 'Hero slideshow';
    icon: 'slideshow';
  };
  attributes: {
    articles: Schema.Attribute.Relation<'manyToMany', 'api::article.article'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SeoOpenGraph extends Struct.ComponentSchema {
  collectionName: 'components_seo_open_graphs';
  info: {
    displayName: 'OpenGraph';
    icon: 'search';
  };
  attributes: {
    ogDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    ogImage: Schema.Attribute.Media<'images'>;
    ogTitle: Schema.Attribute.String & Schema.Attribute.Required;
    ogType: Schema.Attribute.String;
    ogUrl: Schema.Attribute.String;
  };
}

export interface SeoSeo extends Struct.ComponentSchema {
  collectionName: 'components_seo_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaImage: Schema.Attribute.Media<'images'>;
    metaRobots: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    metaViewport: Schema.Attribute.String;
    openGraph: Schema.Attribute.Component<'seo.open-graph', false>;
    structuredData: Schema.Attribute.JSON;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'font-family.font-family': FontFamilyFontFamily;
      'menu.menu': MenuMenu;
      'menu.menu-item': MenuMenuItem;
      'message-reply.message-reply': MessageReplyMessageReply;
      'sections.card-slider': SectionsCardSlider;
      'sections.column-list': SectionsColumnList;
      'sections.hero-slideshow': SectionsHeroSlideshow;
      'seo.open-graph': SeoOpenGraph;
      'seo.seo': SeoSeo;
    }
  }
}
