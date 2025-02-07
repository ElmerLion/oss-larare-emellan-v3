
export interface Material {
  id: string;
  title: string;
  file_path: string | null;
  file_name: string | null;
  description: string;
  type: string;
  subject: string;
  grade: string;
  difficulty: 'easy' | 'medium' | 'hard';
  downloads?: number;
  author_id: string;
  created_at?: string;
  updated_at?: string;
}
