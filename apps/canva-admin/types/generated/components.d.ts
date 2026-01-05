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
      'message-reply.message-reply': MessageReplyMessageReply;
      'seo.open-graph': SeoOpenGraph;
      'seo.seo': SeoSeo;
    }
  }
}
