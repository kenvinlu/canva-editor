import { $get, $nextPost, $nextPut } from './base-request.service';
import { Project } from '@canva-web/src/models/project.model';

async function fetchProjects(page = 1, limit = 10, keyword = '') {
  return $get<Project[]>(`/projects/my-projects?pi=${page}&ps=${limit}&kw=${keyword}`);
}

async function createProject(templateId: number) {
  return $nextPost<Project>(`/projects/create`, { templateId });
}

async function fetchUserProjectById(documentId: string) {
  return $get<Project>(`/projects/${documentId}`, {
    revalidate: 0,
  });
}

async function updateProject(id: number, data: any) {
  return $nextPut<Project>(`/projects/update/${id}`, data);
}

export {
  fetchProjects,
  createProject,
  fetchUserProjectById,
  updateProject,
};
