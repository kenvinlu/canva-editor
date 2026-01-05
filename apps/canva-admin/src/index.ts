import type { Core } from "@strapi/strapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    const contentTypeName = strapi.contentType(
      "plugin::users-permissions.user"
    );
  
    contentTypeName.attributes = {
      ...contentTypeName.attributes,
      totpSecret: {
        type: "string",
        private: true,
        configurable: false,
      },
      enableTotp: {
        type: "boolean",
        default: false,
        configurable: false,
      },
    };
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap() {
    // Custom email provider is now installed as an npm package
    // No need to register it manually - Strapi will load it automatically
  },
};
