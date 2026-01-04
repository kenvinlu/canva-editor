'use client';

import { useState } from 'react';
import { Project } from '../models/project.model';
import { updateProject } from '../services/project.service';
import { apiUrl } from '../utils/config';
import dynamic from 'next/dynamic';

// Define EditorConfig type inline to avoid loading canva-editor module during SSR
type EditorConfig = {
  logoUrl?: string;
  logoComponent?: React.ReactNode;
  apis: {
    url: string;
    userToken: string;
    searchFonts: string;
    searchTemplates: string;
    searchTexts: string;
    searchImages: string;
    searchShapes: string;
    searchFrames: string;
    fetchUserImages: string;
    uploadUserImage: string;
    removeUserImage: string;
    templateKeywordSuggestion: string;
    textKeywordSuggestion: string;
    imageKeywordSuggestion: string;
    shapeKeywordSuggestion: string;
    frameKeywordSuggestion: string;
  };
  unsplash: {
    accessKey: string;
    pageSize?: number;
  };
  editorAssetsUrl: string;
  imageKeywordSuggestions?: string;
  templateKeywordSuggestions?: string;
  translations?: Record<string, any>;
};

const CanvaEditor = dynamic(
  () => import('canva-editor').then((mod) => mod.CanvaEditor),
  { ssr: false }
);

const editorConfig: EditorConfig = {
  apis: {
    url: `${apiUrl}/api/editor`,
    userToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzQ5MTM5NzU3LCJleHAiOjE3NTE3MzE3NTd9.doy2N-AmnNtZ6RXdnSS4Oeco6pAf9dZvgBiFrvN7CkU',
    searchFonts: '/search-fonts',
    searchTemplates: '/search-templates',
    searchTexts: '/search-texts',
    searchImages: '/search-images',
    searchShapes: '/search-shapes',
    searchFrames: '/search-frames',
    fetchUserImages: '/your-uploads/get-user-images',
    uploadUserImage: '/your-uploads/upload',
    removeUserImage: '/your-uploads/remove',
    templateKeywordSuggestion: '/template-suggestion',
    textKeywordSuggestion: '/text-suggestion',
    imageKeywordSuggestion: '/image-suggestion',
    shapeKeywordSuggestion: '/shape-suggestion',
    frameKeywordSuggestion: '/frame-suggestion',
  },
  unsplash: {
    accessKey: 'h7hl06iEAXniAqSKnIY9UxVOjt_Bc1SRtp6T0b-T2ow',
    pageSize: 30,
  },
  editorAssetsUrl: 'https://canva-editor-api.vercel.app/editor',
  imageKeywordSuggestions: 'animal,sport,love,scene,dog,cat,whale',
  templateKeywordSuggestions:
    'mother,sale,discount,fashion,model,deal,motivation,quote',
};

const DesignEditor: React.FC<{ 
  project: Project; 
  token?: string; 
  messages?: Record<string, unknown>;
}> = ({ project, token = '', messages = {} }) => {
  console.log(project);
  editorConfig.apis.userToken = token;
  console.log(messages?.editor)
  // Add translations to editor config
  const configWithTranslations: EditorConfig = {
    ...editorConfig,
    translations: messages?.editor as Record<string, any>,
  };
  
  const [saving, setSaving] = useState(false);
  const handleOnChanges = (changes: any) => {
    console.log('On changes');
    console.log(changes);
    console.log('project', project);

    setSaving(true);
    updateProject(project.id, { data: changes }).then(() => {
      setSaving(false);
    });
  };

  const handleOnDesignNameChanges = (newName: string) => {
    console.log('On name changes');
    console.log(newName);
    if (!project?.id) {
      console.error('Project id is not found');
      return;
    }
    if (!newName || (project.title && newName === project.title)) {
      console.error('New name is not valid');
      return;
    }
    setSaving(true);
    updateProject(project.id, { title: newName }).then(() => {
      setSaving(false);
    });
  };

  const handleOnRemove = () => {
    console.log('On remove');
  };

  return (
    <CanvaEditor
      data={{
        name: project?.title || '',
        editorConfig: project?.data,
      }}
      config={configWithTranslations}
      saving={saving}
      onChanges={handleOnChanges}
      onDesignNameChanges={handleOnDesignNameChanges}
      onRemove={handleOnRemove}
    />
  );
};

export default DesignEditor;
