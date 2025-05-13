export interface Project {
  _id ?: string;
  createdAt?: Date;
  updateAt?: Date;
  name: string;
  description: string;
  technologies:string[];
  image ?: string;
  source_code_link: string;
  demo_link: string;
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
