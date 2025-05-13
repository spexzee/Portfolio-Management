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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { useAddProject, useDeleteProject, useEditProject, useGetProjects } from '@/queries/projects';
import { deleteProject } from './../../lib/data';

type ProjectFormData = {
  name: string;
  description: string;
  technologiesInput: string;
  liveUrl: string;
  repoUrl: string;
};

const ProjectForm = ({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Project | null;
  onSubmit: (data: Project) => Promise<void>;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    technologiesInput: initialData?.technologies?.join(', ') || '',
    liveUrl: initialData?.demo_link || '',
    repoUrl: initialData?.source_code_link || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const projectData: Project = {
      name: formData.name,
      description: formData.description,
      technologies: formData.technologiesInput.split(',').map(tech => tech.trim()).filter(tech => tech),
      source_code_link: formData.repoUrl,
      demo_link: formData.liveUrl,
      image : 'demo.img' // Preserve existing image if editing
    };

    await onSubmit(projectData);
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
        <Label htmlFor="liveUrl">Demo URL</Label>
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
        <Label htmlFor="repoUrl">Source Code URL</Label>
        <Input
          id="repoUrl"
          name="repoUrl"
          type="url"
          value={formData.repoUrl}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { data : projects = [], isError, isLoading} = useGetProjects();
  const { mutateAsync : addProject } = useAddProject();
  const {mutateAsync : editProject} = useEditProject()
  const {mutateAsync : deleteProject} = useDeleteProject()

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "Failed to load projects.",
        variant: "destructive",
      });
    }
  }, [isError]);


  const handleAddProject = async (project: Project) => {
    try {
      await addProject(project, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Project added successfully.",
          });
          setIsDialogOpen(false);
        }
      });
    } catch (error) {
      console.error('Failed to add project:', error);
      toast({
        title: "Error",
        description: "Failed to add project.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProject = async (project: Project) => {
    try {
      await editProject(project)
      toast({
        title: "Success",
        description: "Project updated successfully.",
      });
      setIsDialogOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Failed to update project:', error);
      toast({
        title: "Error",
        description: "Failed to update project.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    try {
      await deleteProject(projectId);
      toast({
        title: "Success",
        description: `Project "${projectName}" deleted successfully.`,
      });
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
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
  };

  const columns: TableColumn<Project>[] = useMemo(() => [
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
      grow: 1,
    },
    {
      name: 'Description',
      selector: (row) => row.description,
      sortable: true,
      cell: (row) => <div className="truncate py-2" title={row.description}>{'Description...'}</div>,
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
      center : true,
      cell: (row) => (
        <div className="flex gap-2 items-center">
          {row.demo_link && (
            <a href={row.demo_link} target="_blank" rel="noopener noreferrer" title="Live Demo">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          )}
          {row.source_code_link && (
            <a href={row.source_code_link} target="_blank" rel="noopener noreferrer" title="Repository">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Code className="h-4 w-4" />
              </Button>
            </a>
          )}
        </div>
      ),
      ignoreRowClick: true,
    },
    {
      name: 'Actions',
      center: true,
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                aria-label={`Delete ${row.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the project
                  <span className="font-semibold"> "{row.name}"</span>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() =>{
                    handleDeleteProject(row._id!, row.name)
                  }} 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
      ignoreRowClick: true,
      width: '120px'
    },
  ], []);

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
        loadingRows={5}
        filterPlaceholder="Search projects..."
      />
    </div>
  );
}