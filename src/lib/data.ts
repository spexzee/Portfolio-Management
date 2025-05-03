import type { Project, Skill } from '@/lib/types';

// Mock Data
const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'E-commerce Platform',
    description: 'A full-featured online store with product listings, cart, and checkout.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
    imageUrl: 'https://picsum.photos/400/300',
    liveUrl: '#',
    repoUrl: '#',
    createdAt: new Date(2023, 5, 15),
    updatedAt: new Date(2023, 10, 1),
  },
  {
    id: 'proj-2',
    name: 'Task Management App',
    description: 'A Kanban-style task board for project management.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Firebase'],
    imageUrl: 'https://picsum.photos/400/301',
    liveUrl: '#',
    repoUrl: '#',
    createdAt: new Date(2024, 1, 10),
    updatedAt: new Date(2024, 3, 5),
  },
  {
    id: 'proj-3',
    name: 'Blog CMS',
    description: 'Content Management System for creating and publishing blog posts.',
    technologies: ['Vue.js', 'Supabase', 'Nuxt.js'],
    imageUrl: 'https://picsum.photos/400/302',
    repoUrl: '#',
    createdAt: new Date(2023, 8, 20),
    updatedAt: new Date(2024, 0, 15),
  },
];

const mockSkills: Skill[] = [
  {
    id: 'skill-1',
    name: 'React',
    category: 'Frontend',
    proficiency: 'Expert',
    icon: 'React', // Placeholder, needs mapping to actual icon
    createdAt: new Date(2022, 0, 1),
    updatedAt: new Date(2024, 2, 1),
  },
  {
    id: 'skill-2',
    name: 'Node.js',
    category: 'Backend',
    proficiency: 'Advanced',
    icon: 'NodeJs', // Placeholder
    createdAt: new Date(2022, 1, 1),
    updatedAt: new Date(2024, 3, 1),
  },
  {
    id: 'skill-3',
    name: 'TypeScript',
    category: 'Frontend',
    proficiency: 'Advanced',
    icon: 'Code', // Placeholder
    createdAt: new Date(2022, 6, 1),
    updatedAt: new Date(2024, 1, 1),
  },
   {
    id: 'skill-4',
    name: 'MongoDB',
    category: 'Database',
    proficiency: 'Intermediate',
    icon: 'Database',
    createdAt: new Date(2023, 0, 1),
    updatedAt: new Date(2024, 0, 1),
  },
   {
    id: 'skill-5',
    name: 'Docker',
    category: 'DevOps',
    proficiency: 'Intermediate',
    icon: 'Container',
    createdAt: new Date(2023, 5, 1),
    updatedAt: new Date(2024, 4, 1),
  },
];

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated Fetch Functions
export const getProjects = async (): Promise<Project[]> => {
  await delay(500); // Simulate network latency
  // In a real app, replace this with an API call:
  // const response = await fetch('/api/projects');
  // const data = await response.json();
  // return data;
  return [...mockProjects]; // Return a copy to prevent mutation
};

export const getSkills = async (): Promise<Skill[]> => {
  await delay(300);
  // In a real app, replace with API call
  return [...mockSkills];
};

export const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
  await delay(400);
  const newProject: Project = {
    ...projectData,
    id: `proj-${Date.now()}`, // Simple unique ID generation
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockProjects.push(newProject); // Add to mock data
  // In real app: POST request to /api/projects
  console.log('Added Project:', newProject);
  return newProject;
};

export const updateProject = async (id: string, projectData: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project | null> => {
  await delay(400);
  const projectIndex = mockProjects.findIndex(p => p.id === id);
  if (projectIndex === -1) return null;

  mockProjects[projectIndex] = {
    ...mockProjects[projectIndex],
    ...projectData,
    updatedAt: new Date(),
  };
  // In real app: PUT/PATCH request to /api/projects/{id}
  console.log('Updated Project:', mockProjects[projectIndex]);
  return mockProjects[projectIndex];
};

export const deleteProject = async (id: string): Promise<boolean> => {
  await delay(300);
  const initialLength = mockProjects.length;
  const index = mockProjects.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProjects.splice(index, 1); // Remove from mock data
    // In real app: DELETE request to /api/projects/{id}
    console.log('Deleted Project ID:', id);
    return true;
  }
  return false;
};


export const addSkill = async (skillData: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Skill> => {
    await delay(400);
    const newSkill: Skill = {
        ...skillData,
        id: `skill-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    mockSkills.push(newSkill);
    console.log('Added Skill:', newSkill);
    return newSkill;
};

export const updateSkill = async (id: string, skillData: Partial<Omit<Skill, 'id' | 'createdAt'>>): Promise<Skill | null> => {
    await delay(400);
    const skillIndex = mockSkills.findIndex(s => s.id === id);
    if (skillIndex === -1) return null;

    mockSkills[skillIndex] = {
        ...mockSkills[skillIndex],
        ...skillData,
        updatedAt: new Date(),
    };
    console.log('Updated Skill:', mockSkills[skillIndex]);
    return mockSkills[skillIndex];
};

export const deleteSkill = async (id: string): Promise<boolean> => {
    await delay(300);
    const index = mockSkills.findIndex(s => s.id === id);
    if (index !== -1) {
        mockSkills.splice(index, 1);
        console.log('Deleted Skill ID:', id);
        return true;
    }
    return false;
};
