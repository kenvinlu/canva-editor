import { Template } from '../models/template.model';
import { $nextFetch, $nextPut } from './base-request.service';

async function fetchMasterTemplates(page = 1, limit = 10, keyword = '') {
  return $nextFetch<Template[]>(`/templates/search?pi=${page}&ps=${limit}&kw=${keyword}`);
}

async function fetchTemplateById(documentId: string) {
  return $nextFetch<Template>(`/templates/master/by-id/${documentId}`);
}

function fetchRecentTemplates(
  currentPostId: number,
  pageSize = 4
) {
  return $nextFetch<Template[]>(`/templates/master?cid=${currentPostId}&ps=${pageSize}`);
}

async function updateVoteCount(documentId: string, voteCount: number) {
  return $nextPut<{ voteCount: number; }>(`/templates/${documentId}/vote`, {
    voteCount,
  }, undefined, 0);
}

export { fetchRecentTemplates, fetchMasterTemplates, fetchTemplateById, updateVoteCount };
