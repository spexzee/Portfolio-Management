import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getProjects, getSkills } from '@/lib/data';
import { Briefcase, Wrench, Activity } from 'lucide-react';

export default async function DashboardHome() {
  // Fetch initial counts (replace with real API calls)
  const projects = await getProjects();
  const skills = await getSkills();
  const projectCount = projects.length;
  const skillCount = skills.length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Projects Summary Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Projects
            </CardTitle>
            <Briefcase className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectCount}</div>
            <p className="text-xs text-muted-foreground">
              Manage your portfolio projects
            </p>
          </CardContent>
        </Card>

        {/* Skills Summary Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Skills
            </CardTitle>
            <Wrench className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skillCount}</div>
            <p className="text-xs text-muted-foreground">
              Showcase your technical abilities
            </p>
          </CardContent>
        </Card>

        {/* Optional: Add another summary card, e.g., Recent Activity */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Activity
            </CardTitle>
            <Activity className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div> {/* Placeholder */}
            <p className="text-xs text-muted-foreground">
              Last updated: Just now {/* Placeholder */}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for future charts or detailed views */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        {/* Add charts or other dashboard elements here */}
        <p className="text-muted-foreground">More dashboard widgets coming soon...</p>
      </div>
    </div>
  );
}
