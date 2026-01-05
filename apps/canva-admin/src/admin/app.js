import MenuLogo from "./extensions/assets/menu-logo.svg";
import Favicon from "./extensions/assets/favicon.ico";
import CanvaCloneLogo from "./extensions/assets/logo.svg";
import axios from "axios";
import {
  Autoformat,
  Bold,
  Italic,
  Essentials,
  Heading,
} from "ckeditor5";

import {
  defaultHtmlPreset,
  setPluginConfig,
  StrapiMediaLib,
  StrapiUploadAdapter,
} from "@_sh/strapi-plugin-ckeditor";

const CKEConfig = () => ({
  presets: [
    {
      ...defaultHtmlPreset,

      /**
       * If you use default preset and haven't updated your schemas to replace
       * the `default` preset with `defaultHtml`, you can change `name`
       * in defaultHtmlPreset to 'default' to avoid missing preset error.
       */
      // name: 'default',

      editorConfig: {
        ...defaultHtmlPreset.editorConfig,
        plugins: [
          ...defaultHtmlPreset.editorConfig.plugins,
        ],
        toolbar: [
          ...defaultHtmlPreset.editorConfig.toolbar,
        ],
      },
    },
    {
      name: "myCustomPreset",
      description: "My custom preset",
      editorConfig: {
        licenseKey: "GPL",
        plugins: [
          Autoformat,
          Bold,
          Italic,
          Essentials,
          Heading,
          StrapiMediaLib,
          StrapiUploadAdapter,
        ],
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "link",
          "|",
          "bulletedList",
          "numberedList",
          "|",
          "insertDynamicForm",
          "blockQuote",
          "codeBlock",
          "htmlEmbed",
          "|",
          "insertTable",
          "strapiMediaLib",
          "|",
          "undo",
          "redo",
          "|",
          "sourceEditing",
        ],
      },
    },
  ],
  // theme: {},
});

export default {
  config: {
    locales: [
      'en'
    ],
    auth: {
      logo: CanvaCloneLogo,
    },
    head: {
      favicon: Favicon,
    },
    menu: {
      logo: MenuLogo,
    },
    tutorials: false,
    notifications: { releases: false },
  },
  register(app) {
    const myConfig = CKEConfig();
    setPluginConfig(myConfig);

    // Preview button
    app.registerHook(
      "plugin/preview-button/before-build-url",
      async ({ draft, published }) => {
        try {
          const config = await axios.get("/api/configuration");
          const siteURL = config?.data?.data?.site_url;

          if (!siteURL) {
            console.error("Please set `site_url` in the configuration.");
            return { draft, published };
          }

          return {
            draft: {
              ...draft,
              url: `${siteURL}${draft.url}`,
              query: {
                ...(draft.query || {}),
                preview: "true",
              },
            },
            published: {
              ...published,
              url: `${siteURL}${published.url}`,
            },
          };
        } catch (error) {
          console.error("Error fetching configuration:", error);
          return { draft, published };
        }
      }
    );
    app.registerPlugin({
      id: "preview-hook",
      name: "Preview Hook",
    });
  },
};
