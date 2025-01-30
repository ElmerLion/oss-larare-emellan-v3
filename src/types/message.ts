export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  materials?: {
    material_id: string;
    resources: {
      id: string;
      title: string;
      file_path: string;
    };
  }[];
}