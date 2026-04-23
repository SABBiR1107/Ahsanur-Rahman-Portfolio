"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, GraduationCap, Award, Briefcase, Code, FileText, Mail, User } from "lucide-react";
import EducationManager from "@/components/admin/EducationManager";
import SkillsManager from "@/components/admin/SkillsManager";
import ExperienceManager from "@/components/admin/ExperienceManager";
import ProjectsManager from "@/components/admin/ProjectsManager";
import CertificatesManager from "@/components/admin/CertificatesManager";
import ContactManager from "@/components/admin/ContactManager";
import HeroManager from "@/components/admin/HeroManager";

export default function AdminPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const token = localStorage.getItem("bearer_token");

    await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    localStorage.removeItem("bearer_token");
    router.push("/");
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {session.user.name || session.user.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/")}>
              View Portfolio
            </Button>
            <Button variant="destructive" onClick={handleSignOut} disabled={isSigningOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="hero" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-7 h-auto gap-2">
            <TabsTrigger value="hero" className="gap-2">
              <User className="h-4 w-4" />
              Hero
            </TabsTrigger>
            <TabsTrigger value="education" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </TabsTrigger>
            <TabsTrigger value="skills" className="gap-2">
              <Award className="h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="experience" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <Code className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="certificates" className="gap-2">
              <FileText className="h-4 w-4" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <Mail className="h-4 w-4" />
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <HeroManager />
          </TabsContent>

          <TabsContent value="education">
            <EducationManager />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsManager />
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceManager />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsManager />
          </TabsContent>

          <TabsContent value="certificates">
            <CertificatesManager />
          </TabsContent>

          <TabsContent value="contact">
            <ContactManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}