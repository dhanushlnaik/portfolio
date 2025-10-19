export type WorkCategory = 'graphics' | 'video';

export interface GraphicsVideoWork {
  id: string;
  title: string;
  description: string;
  image: string;
  thumbnail?: string;
  category: WorkCategory;
  tags?: string[];
  tools?: string[]; // e.g., Photoshop, Premiere Pro, After Effects, etc.
  link?: string; // Link to full work or portfolio entry
  featured?: boolean;
  createdAt?: string; // Date of creation
}
