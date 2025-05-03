'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DataTableWrapper } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have a Textarea component
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getProjects, addProject, updateProject, deleteProject } from '@/lib/data';
import type { Project } from '@/lib/types';
import type { TableColumn } from 'react-data-table-component';
import { Pencil, Trash2, PlusCircle, ExternalLink, Code } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ProjectFormData = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl'> & { technologiesInput: string };

const ProjectForm = ({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Project | null;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    technologies: initialData?.technologies || [],
    technologiesInput: initialData?.technologies.join(', ') || '',
    liveUrl: initialData?.liveUrl || '',
    repoUrl: initialData?.repoUrl || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const technologies = formData.technologiesInput.split(',').map(tech => tech.trim()).filter(tech => tech);
    await onSubmit({ ...formData, technologies });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="mt-1"
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="technologiesInput">Technologies (comma-separated)</Label>
        <Input
          id="technologiesInput"
          name="technologiesInput"
          value={formData.technologiesInput}
          onChange={handleChange}
          className="mt-1"
          placeholder="e.g., React, Node.js, Tailwind CSS"
        />
      </div>
       <div>
        <Label htmlFor="liveUrl">Live URL (Optional)</Label>
        <Input
          id="liveUrl"
          name="liveUrl"
          type="url"
          value={formData.liveUrl}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
       <div>
        <Label htmlFor="repoUrl">Repository URL (Optional)</Label>
        <Input
          id="repoUrl"
          name="repoUrl"
          type="url"
          value={formData.repoUrl}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      {/* Add fields for imageUrl if needed */}
      <DialogFooter>
        <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
            </Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Project' : 'Add Project')}
        </Button>
      </DialogFooter>
    </form>
  );
};


export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
       toast({
          title: "Error",
          description: "Failed to load projects.",
          variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

 const handleAddProject = async (data: ProjectFormData) => {
    try {
      await addProject(data);
      toast({
        title: "Success",
        description: "Project added successfully.",
      });
      setIsDialogOpen(false);
      fetchProjects(); // Re-fetch projects
    } catch (error) {
      console.error('Failed to add project:', error);
      toast({
        title: "Error",
        description: "Failed to add project.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProject = async (data: ProjectFormData) => {
    if (!editingProject) return;
    try {
      await updateProject(editingProject.id, data);
      toast({
        title: "Success",
        description: "Project updated successfully.",
      });
      setIsDialogOpen(false);
      setEditingProject(null);
      fetchProjects(); // Re-fetch projects
    } catch (error) {
      console.error('Failed to update project:', error);
       toast({
        title: "Error",
        description: "Failed to update project.",
        variant: "destructive",
      });
    }
  };

 const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete.id);
       toast({
        title: "Success",
        description: `Project "${projectToDelete.name}" deleted successfully.`,
      });
      setProjectToDelete(null); // Close the confirmation dialog implicitly
      fetchProjects(); // Re-fetch projects
    } catch (error) {
      console.error('Failed to delete project:', error);
        toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingProject(null); // Ensure we are in "add" mode
    setIsDialogOpen(true);
  }

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProject(null); // Reset editing state when closing
  }

   const columns: TableColumn<Project>[] = useMemo(() => [
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
      grow: 2, // Allow more space for name
    },
    {
      name: 'Description',
      selector: (row) => row.description,
      sortable: true,
      grow: 3, // Allow more space for description
       cell: (row) => <div className="truncate py-2" title={row.description}>{row.description}</div>,
    },
    {
        name: 'Technologies',
        selector: (row) => row.technologies.join(', '),
        cell: (row) => (
            <div className="flex flex-wrap gap-1 py-2 max-w-xs overflow-hidden">
            {row.technologies.map((tech) => (
                <Badge key={tech} variant="secondary">{tech}</Badge>
            ))}
            </div>
        ),
        grow: 2,
    },
    {
      name: 'Links',
      cell: (row) => (
         <div className="flex gap-2 items-center">
            {row.liveUrl && (
              <a href={row.liveUrl} target="_blank" rel="noopener noreferrer" title="Live Demo">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            )}
             {row.repoUrl && (
              <a href={row.repoUrl} target="_blank" rel="noopener noreferrer" title="Repository">
                <Button variant="outline" size="icon" className="h-8 w-8">
                    <Code className="h-4 w-4" />
                </Button>
              </a>
            )}
        </div>
      ),
      ignoreRowClick: true,
      // allowOverflow: true, // Removed to prevent React warning
      button: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => openEditDialog(row)}
            aria-label={`Edit ${row.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialogTrigger asChild>
               <Button
                   variant="destructive"
                   size="icon"
                   className="h-8 w-8"
                    onClick={() => setProjectToDelete(row)} // Set the project to delete when trigger is clicked
                   aria-label={`Delete ${row.name}`}
               >
                   <Trash2 className="h-4 w-4" />
               </Button>
            </AlertDialogTrigger>

        </div>
      ),
      ignoreRowClick: true,
      // allowOverflow: true, // Removed to prevent React warning
      button: true, // Indicates this cell contains buttons/actions
      width: '120px' // Fixed width for actions column
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [openEditDialog]); // Dependency array ensures columns are memoized


  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Manage Projects</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
             <Button onClick={openAddDialog}>
               <PlusCircle className="mr-2 h-4 w-4" /> Add Project
             </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
            <ProjectForm
              initialData={editingProject}
              onSubmit={editingProject ? handleUpdateProject : handleAddProject}
              onCancel={closeDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTableWrapper
        columns={columns}
        data={projects}
        pagination
        highlightOnHover
        pointerOnHover
        isLoading={isLoading}
        loadingRows={5} // Adjust number of skeleton rows
        filterPlaceholder="Search projects..."
      />

       {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
             {/* No Trigger needed here as it's controlled by state */}
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the project
                    <span className="font-semibold"> "{projectToDelete?.name}"</span>.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setProjectToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
