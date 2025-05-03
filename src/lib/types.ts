export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  imageUrl?: string; // Optional image URL
  liveUrl?: string; // Optional live demo URL
  repoUrl?: string; // Optional repository URL
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Mobile' | 'Other';
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  icon?: string; // Optional: name of a lucide-react icon or path to custom SVG
  createdAt: Date;
  updatedAt: Date;
}
