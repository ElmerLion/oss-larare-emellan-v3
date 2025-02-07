export interface Material {
  id: string;
  title: string;
  file_path?: string;
  description?: string;
  type?: string;
  subject?: string;
  grade?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  author_id: string;
  created_at?: string;
  updated_at?: string;
} 