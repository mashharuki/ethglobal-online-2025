/**
 * プロジェクト情報のローカルストレージ管理
 */

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  targetToken: string;
  targetChain: string;
  unifiedAddress: string;
  multiChainAddresses: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'crossdonate_projects';

/**
 * ローカルストレージからプロジェクト一覧を取得
 */
export function getStoredProjects(): ProjectData[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load projects from localStorage:', error);
    return [];
  }
}

/**
 * プロジェクトをローカルストレージに保存
 */
export function saveProject(project: ProjectData): void {
  if (typeof window === 'undefined') return;

  try {
    const projects = getStoredProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id);

    if (existingIndex >= 0) {
      // 既存プロジェクトを更新
      projects[existingIndex] = {
        ...project,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // 新しいプロジェクトを追加
      projects.push(project);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save project to localStorage:', error);
  }
}

/**
 * プロジェクトをローカルストレージから削除
 */
export function deleteProject(projectId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const projects = getStoredProjects();
    const filteredProjects = projects.filter((p) => p.id !== projectId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProjects));
  } catch (error) {
    console.error('Failed to delete project from localStorage:', error);
  }
}

/**
 * 特定のプロジェクトを取得
 */
export function getProject(projectId: string): ProjectData | null {
  const projects = getStoredProjects();
  return projects.find((p) => p.id === projectId) || null;
}

/**
 * プロジェクトIDを生成
 */
export function generateProjectId(): string {
  return `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * プロジェクトデータを作成
 */
export function createProjectData(
  name: string,
  description: string,
  targetToken: string,
  targetChain: string,
  unifiedAddress: string,
  multiChainAddresses: Record<string, string>
): ProjectData {
  return {
    id: generateProjectId(),
    name,
    description,
    targetToken,
    targetChain,
    unifiedAddress,
    multiChainAddresses,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

