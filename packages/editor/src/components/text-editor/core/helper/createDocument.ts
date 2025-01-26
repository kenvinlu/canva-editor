import { createNodeFromContent } from './createNodeFromContent.js';
import { Schema } from 'prosemirror-model';

export function createDocument(content: string, schema: Schema) {
    return createNodeFromContent(content, schema);
}
