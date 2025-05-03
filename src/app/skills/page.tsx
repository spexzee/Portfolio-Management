
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSkills, addSkill, updateSkill, deleteSkill } from '@/lib/data';
import type { Skill } from '@/lib/types';
import type { TableColumn } from 'react-data-table-component';
import { Pencil, Trash2, PlusCircle, Activity, Database, Code, Server, Smartphone } from 'lucide-react'; // Example icons
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
import { Badge } from '@/components/ui/badge'; // Import Badge component


type SkillFormData = Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>;

// Helper to map category to icon
const CategoryIcon = ({ category }: { category: Skill['category'] }) => {
    switch (category) {
        case 'Frontend': return <Code className="h-4 w-4 text-blue-500" />;
        case 'Backend': return <Server className="h-4 w-4 text-green-500" />;
        case 'Database': return <Database className="h-4 w-4 text-purple-500" />;
        case 'DevOps': return <Activity className="h-4 w-4 text-orange-500" />; // Using Activity as placeholder
        case 'Mobile': return <Smartphone className="h-4 w-4 text-indigo-500" />;
        default: return <Code className="h-4 w-4 text-gray-500" />; // Default icon
    }
};

// Helper to get badge color based on proficiency
const getProficiencyBadgeVariant = (proficiency: Skill['proficiency']): "default" | "secondary" | "outline" | "destructive" | null | undefined => {
    switch (proficiency) {
        case 'Expert': return 'default'; // Use primary color
        case 'Advanced': return 'secondary'; // Use secondary color
        case 'Intermediate': return 'outline'; // Use outline style
        case 'Beginner': return undefined; // Default badge style (can adjust if needed)
        default: return undefined;
    }
};

const SkillForm = ({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Skill | null;
  onSubmit: (data: SkillFormData) => Promise<void>;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<SkillFormData>({
    name: initialData?.name || '',
    category: initialData?.category || 'Frontend',
    proficiency: initialData?.proficiency || 'Beginner',
    icon: initialData?.icon || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   const handleSelectChange = (name: keyof SkillFormData) => (value: string) => {
     setFormData((prev) => ({ ...prev, [name]: value }));
   };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Skill Name</Label>
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
        <Label htmlFor="category">Category</Label>
         <Select name="category" value={formData.category} onValueChange={handleSelectChange('category')} required>
            <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Frontend">Frontend</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="Database">Database</SelectItem>
                <SelectItem value="DevOps">DevOps</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
        </Select>
      </div>
       <div>
        <Label htmlFor="proficiency">Proficiency</Label>
         <Select name="proficiency" value={formData.proficiency} onValueChange={handleSelectChange('proficiency')} required>
            <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select proficiency" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
            </SelectContent>
        </Select>
      </div>
      {/* Optional: Field for Icon if you allow custom icons */}
      {/* <div>
        <Label htmlFor="icon">Icon (Lucide Name or SVG Path)</Label>
        <Input
          id="icon"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
          className="mt-1"
          placeholder="e.g., Code, Database or /icons/custom.svg"
        />
      </div> */}
      <DialogFooter>
        <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
            </Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Skill' : 'Add Skill')}
        </Button>
      </DialogFooter>
    </form>
  );
};


export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  // Removed: const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
       toast({
          title: "Error",
          description: "Failed to load skills.",
          variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

 const handleAddSkill = async (data: SkillFormData) => {
    try {
      await addSkill(data);
      toast({
        title: "Success",
        description: "Skill added successfully.",
      });
      setIsDialogOpen(false);
      fetchSkills(); // Re-fetch skills
    } catch (error) {
      console.error('Failed to add skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSkill = async (data: SkillFormData) => {
    if (!editingSkill) return;
    try {
      await updateSkill(editingSkill.id, data);
      toast({
        title: "Success",
        description: "Skill updated successfully.",
      });
      setIsDialogOpen(false);
      setEditingSkill(null);
      fetchSkills(); // Re-fetch skills
    } catch (error) {
      console.error('Failed to update skill:', error);
       toast({
        title: "Error",
        description: "Failed to update skill.",
        variant: "destructive",
      });
    }
  };

 const handleDeleteSkill = async (skillId: string, skillName: string) => {
    try {
      await deleteSkill(skillId);
       toast({
        title: "Success",
        description: `Skill "${skillName}" deleted successfully.`,
      });
      // Removed: setSkillToDelete(null); // Close the confirmation dialog implicitly
      fetchSkills(); // Re-fetch skills
    } catch (error) {
      console.error('Failed to delete skill:', error);
        toast({
        title: "Error",
        description: "Failed to delete skill.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (skill: Skill) => {
    setEditingSkill(skill);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingSkill(null); // Ensure we are in "add" mode
    setIsDialogOpen(true);
  }

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingSkill(null); // Reset editing state when closing
  }

   const columns: TableColumn<Skill>[] = useMemo(() => [
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
      grow: 2,
    },
    {
      name: 'Category',
      selector: (row) => row.category,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2 py-2">
          <CategoryIcon category={row.category} />
          <span>{row.category}</span>
        </div>
      ),
       grow: 1,
    },
     {
      name: 'Proficiency',
      selector: (row) => row.proficiency,
      sortable: true,
      cell: (row) => (
        <Badge variant={getProficiencyBadgeVariant(row.proficiency)} className="capitalize">
          {row.proficiency}
        </Badge>
      ),
      grow: 1,
    },
    // { // Optional: Display Icon if needed
    //   name: 'Icon',
    //   cell: (row) => row.icon ? <span>{row.icon}</span> : '-', // Render icon component here if possible
    //   width: '80px',
    // },
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
                        This action cannot be undone. This will permanently delete the skill
                        <span className="font-semibold"> "{row.name}"</span>.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteSkill(row.id, row.name)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      ),
      ignoreRowClick: true,
      // button: true, // Removed to fix React warning
      width: '120px',
    },
   // eslint-disable-next-line react-hooks/exhaustive-deps
   ], [openEditDialog]); // Dependency array


  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Manage Skills</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
             <Button onClick={openAddDialog}>
               <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
             </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
            </DialogHeader>
            <SkillForm
              initialData={editingSkill}
              onSubmit={editingSkill ? handleUpdateSkill : handleAddSkill}
              onCancel={closeDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTableWrapper
        columns={columns}
        data={skills}
        pagination
        highlightOnHover
        pointerOnHover
        isLoading={isLoading}
        loadingRows={5}
        filterPlaceholder="Search skills..."
      />

      {/* Delete Confirmation Dialog is now part of the cell renderer */}

    </div>
  );
}

    