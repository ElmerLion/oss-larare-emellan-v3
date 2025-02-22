export interface Group {
  id: string;
  name: string;
  description?: string;
  is_public: boolean;
  owner_id: string;
  created_at: string;
}
