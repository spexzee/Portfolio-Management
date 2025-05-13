import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Home, Briefcase, Wrench } from 'lucide-react';
import Link from 'next/link';
import { QueryClientProvider } from '@/providers/query-provider'; // Import the new provider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Spexzee',
  description: 'Admin dashboard for managing portfolio projects and skills.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'antialiased',
          'flex min-h-screen flex-col' // Ensure body takes full height
        )}
      >
        <QueryClientProvider> {/* Wrap the core layout */}
          <SidebarProvider>
            <Sidebar variant="sidebar" collapsible="icon" className="dark:bg-zinc-900" >
               <SidebarHeader className="p-4">
                  <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-primary dark:text-primary">
                   <Briefcase className="h-6 w-6" />
                   Spexzee
                  </Link>
               </SidebarHeader>
              <SidebarContent className="flex-1">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Link href="/" passHref legacyBehavior>
                       <SidebarMenuButton tooltip="Dashboard" isActive={true}> {/* Add isActive logic later */}
                        <Home />
                        <span>Dashboard</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                     <Link href="/projects" passHref legacyBehavior>
                      <SidebarMenuButton tooltip="Projects">
                        <Briefcase />
                        <span>Projects</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/skills" passHref legacyBehavior>
                      <SidebarMenuButton tooltip="Skills">
                        <Wrench />
                        <span>Skills</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
              {/* Optional Sidebar Footer */}
              {/* <SidebarFooter>...</SidebarFooter> */}
            </Sidebar>

            <SidebarInset className="flex flex-col flex-1">
               <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
                   {/* Mobile Sidebar Trigger */}
                  <div className="md:hidden">
                      <SidebarTrigger />
                  </div>
                  {/* Header Content (e.g., User Menu, Search) can go here */}
                  <div className="ml-auto">
                    {/* Placeholder for User Menu */}
                  </div>
               </header>
               <main className="flex-1 overflow-y-auto p-6">
                  {children}
               </main>
            </SidebarInset>
          </SidebarProvider>
        </QueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
