Canva Editor


Description
-----------

This project is a React.js-based tool designed to provide functionality similar to Canva.com. It utilizes the Vite build tool and manages state with ProseMirror. The tool allows users to create and design content through an intuitive interface.


[![Demo](https://github.com/kenvinlu/canva-editor/blob/deploy/Screenshot.png?raw=true)](https://canva-editor-three.vercel.app)

## Demo

Explore the live demo: [Try it out!](https://www.canvaclone.com)

Get full source code here: https://kenvinlu.gumroad.com/l/canva-editor

Installation
------------

Before you begin, ensure that you have [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed on your machine.

1.  Clone the repository:
    
    ```sh
    git clone https://github.com/kenvinlu/canva-editor.git
    ```
    
2.  Navigate to the project directory:
    
    ```sh
    cd canva-editor
    ```
    
3.  Install dependencies using Yarn:
    
    ```sh
    yarn install
    ```
    

Configuration
-------------

To customize the tool for your environment, please update the `editorConfig`.

```javascript
export type EditorConfig = {
  logoUrl?: string;
  apis: {
    url: string;
    searchFonts: string;
    searchTemplates: string;
    searchTexts: string;
    searchImages: string;
    searchShapes: string;
    searchFrames: string;
    templateKeywordSuggestion: string;
    textKeywordSuggestion: string;
    imageKeywordSuggestion: string;
    shapeKeywordSuggestion: string;
    frameKeywordSuggestion: string;
  };
  placeholders?: {
    searchTemplate?: string;
    searchText?: string;
    searchImage?: string;
    searchShape?: string;
    searchFrame?: string;
  }
  editorAssetsUrl: string;
  imageKeywordSuggestions?: string;
  templateKeywordSuggestions?: string;
};

const editorConfig: EditorConfig = {
  apis: {
    url: 'http://localhost:4000/api',
    searchFonts: '/fonts',
    searchTemplates: '/templates',
    searchTexts: '/texts',
    searchImages: '/images',
    searchShapes: '/shapes',
    searchFrames: '/frames',
    templateKeywordSuggestion: '/template-suggestion',
    textKeywordSuggestion: '/text-suggestion',
    imageKeywordSuggestion: '/image-suggestion',
    shapeKeywordSuggestion: '/shape-suggestion',
    frameKeywordSuggestion: '/frame-suggestion',
  },
  placeholders: {
    searchTemplate: 'Search templates',
    searchText: 'Search texts',
    searchImage: 'Search images',
    searchShape: 'Search shapes',
    searchFrame: 'Search frames'
  },
  editorAssetsUrl: 'http://localhost:4000/editor',
  imageKeywordSuggestions: 'animal,sport,love,scene,dog,cat,whale',
  templateKeywordSuggestions:
    'mother,sale,discount,fashion,model,deal,motivation,quote',
};
```

| Property                       | Type     | Description                                             | Required | Default Value                                              |
|--------------------------------|----------|---------------------------------------------------------|----------|------------------------------------------------------------|
| apis                           | Object   | API endpoints for various functionalities in the tool   | Required | -                                                          |
| apis.url                       | String   | Base URL for the API                                    | Required | -                                                          |
| apis.searchFonts               | String   | Endpoint for searching fonts                            | Required | '/fonts'                                                   |
| apis.searchTemplates           | String   | Endpoint for searching templates                        | Required | '/templates'                                               |
| apis.searchTexts               | String   | Endpoint for searching texts                            | Required | '/texts'                                                   |
| apis.searchImages              | String   | Endpoint for searching images                           | Required | '/images'                                                  |
| apis.searchShapes              | String   | Endpoint for searching shapes                           | Required | '/shapes'                                                  |
| apis.searchFrames              | String   | Endpoint for searching frames                           | Required | '/frames'                                                  |
| apis.templateKeywordSuggestion | String   | Endpoint for template keyword suggestions               | Required | '/template-suggestion'                                     |
| apis.textKeywordSuggestion     | String   | Endpoint for text keyword suggestions                   | Required | '/text-suggestion'                                         |
| apis.imageKeywordSuggestion    | String   | Endpoint for image keyword suggestions                  | Required | '/image-suggestion'                                        |
| apis.shapeKeywordSuggestion    | String   | Endpoint for shape keyword suggestions                  | Required | '/shape-suggestion'                                        |
| apis.frameKeywordSuggestion    | String   | Endpoint for frame keyword suggestions                  | Required | '/frame-suggestion'                                        |
| placeholders                   | Object   | Placeholder text for search inputs                      | Optional | Default values provided below                              |
| placeholders.searchTemplate    | String   | Placeholder text for template search input              | Optional | 'Search templates'                                         |
| placeholders.searchText        | String   | Placeholder text for text search input                  | Optional | 'Search texts'                                             |
| placeholders.searchImage       | String   | Placeholder text for image search input                 | Optional | 'Search images'                                            |
| placeholders.searchShape       | String   | Placeholder text for shape search input                 | Optional | 'Search shapes'                                            |
| placeholders.searchFrame       | String   | Placeholder text for frame search input                 | Optional | 'Search frames'                                            |
| editorAssetsUrl                | String   | URL for editor-related assets                           | Required | -                                                          |
| imageKeywordSuggestions        | String   | Comma-separated list of image keyword suggestions       | Optional | 'animal,sport,love,scene,dog,cat,whale'                    |
| templateKeywordSuggestions     | String   | Comma-separated list of template keyword suggestions    | Optional | 'mother,sale,discount,fashion,model,deal,motivation,quote' |


Usage
-----

### Example Test Component

Here's an example usage of the CanvaEditor component within a React component:

```javascript
import { CanvaEditor, EditorConfig } from 'canva-editor';
import { data } from './sampleData';
import { useState } from 'react';

const editorConfig: EditorConfig = {
  logoUrl: './your-logo.png',
  apis: {
    url: 'http://localhost:4000/api',
    searchFonts: '/fonts',
    searchTemplates: '/templates',
    searchTexts: '/texts',
    searchImages: '/images',
    searchShapes: '/shapes',
    searchFrames: '/frames',
    templateKeywordSuggestion: '/template-suggestion',
    textKeywordSuggestion: '/text-suggestion',
    imageKeywordSuggestion: '/image-suggestion',
    shapeKeywordSuggestion: '/shape-suggestion',
    frameKeywordSuggestion: '/frame-suggestion',
  },
  placeholders: {
    searchTemplate: 'Search templates',
    searchText: 'Search texts',
    searchImage: 'Search images',
    searchShape: 'Search shapes',
    searchFrame: 'Search frames',
  },
  editorAssetsUrl: 'http://localhost:4000/editor',
  imageKeywordSuggestions: 'animal,sport,love,scene,dog,cat,whale',
  templateKeywordSuggestions:
    'mother,sale,discount,fashion,model,deal,motivation,quote',
};

const Test = () => {
  const [saving, setSaving] = useState(false);
  const name = '';
  const handleOnChanges = (changes: any) => {
    console.log('On changes');
    console.log(changes);

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1e3);
  };

  const handleOnDesignNameChanges = (newName: string) => {
    console.log('On name changes');
    console.log(newName);

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1e3);
  };
  return (
    <CanvaEditor
      data={{
        name,
        editorConfig: data,
      }}
      config={editorConfig}
      saving={saving}
      onChanges={handleOnChanges}
      onDesignNameChanges={handleOnDesignNameChanges}
    />
  );
};

export default Test;
```
### Editor Options

The `options` property in the `CanvaEditor` component allows you to customize the behavior and appearance of the editor. Below are some key options you can use to tailor the editor to your specific needs:

*   **`saving` (Boolean):**
    
    *   **Description:** A flag indicating whether the editor is in a saving state. When set to `true`, it typically triggers UI changes to indicate that the content is being saved.
    *   **Default:** `false`
*   **`onChanges` (Function):**
    
    *   **Description:** A callback function triggered when content changes occur in the editor. Use this callback to handle any logic or state updates related to changes in the editor content.
    *   **Default:** None (Required)
*   **`onDesignNameChanges` (Function):**
    
    *   **Description:** A callback function triggered when the design name changes. This is useful for capturing and handling updates to the design name within the editor.
    *   **Default:** None (Required)

These options provide a way to interact with the editor's state and behavior. Incorporate them into your `CanvaEditor` instance to enhance the customization of the editor within your React application.

To start the development API server, run:

```sh
yarn api
```

To start the development server, run:

```sh
yarn dev
```

This will launch the tool at [http://localhost:5173](http://localhost:5173).

License
-------

This project is licensed under the **MIT License with No Resale Clause**. See the [LICENSE](LICENSE) file for details.
