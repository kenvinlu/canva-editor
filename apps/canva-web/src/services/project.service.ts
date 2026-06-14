import { $get, $nextPost, $nextPut, $nextDelete } from './base-request.service';
import { Project } from '@canva-web/src/models/project.model';
import FETCH_TAGS from '@canva-web/src/utils/fetchTags';

async function fetchProjects(page = 1, limit = 10, keyword = '') {
  // Can't revalidate -> skip cache
  return $get<Project[]>(`/projects/my-projects?pi=${page}&ps=${limit}&kw=${keyword}`, undefined, 0, [FETCH_TAGS.PROJECT_LIST]);
}

async function createProject(templateId?: number) {
  return $nextPost<Project>(`/projects/create`, templateId ? { templateId } : {});
}

async function fetchUserProjectById(documentId: string) {
  return $get<Project>(`/projects/${documentId}`, undefined, 0);
}

async function updateProject(id: number, data: any) {
  return $nextPut<Project>(`/projects/update/${id}`, data);
}

async function deleteProject(documentId: string) {
  return $nextDelete<{ documentId: string; message: string }>(`/projects/delete/${documentId}`);
}

export {
  fetchProjects,
  createProject,
  fetchUserProjectById,
  updateProject,
  deleteProject,
};
