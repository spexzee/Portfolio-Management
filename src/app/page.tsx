'use client'
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGetCounts } from "@/queries/common";
import { Briefcase, Wrench } from 'lucide-react';
import Link from "next/link";

export default function DashboardHome() {
  const {data : counts} = useGetCounts()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
        <Link target="_blank" href='https://spexzee-portfolio.vercel.app' className="" passHref>
        <Button variant="outline" className="bg-primary text-white">
          View Portfolio
        </Button>
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {/* Projects Summary Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Projects
            </CardTitle>
            <Briefcase className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts?.projects ?? 0}</div>
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
            <div className="text-2xl font-bold">{counts?.technologies ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Showcase your technical abilities
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
