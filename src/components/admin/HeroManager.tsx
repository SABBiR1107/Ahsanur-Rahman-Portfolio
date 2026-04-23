"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Hero {
  id: number;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  cvUrl: string | null;
  availableForWork: boolean;
}

export default function HeroManager() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    imageUrl: "",
    cvUrl: "",
    availableForWork: true,
  });

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await fetch("/api/hero");
      const data = await res.json();
      if (data.length > 0) {
        setHero(data[0]);
        setFormData({
          name: data[0].name || "",
          title: data[0].title || "",
          description: data[0].description || "",
          imageUrl: data[0].imageUrl || "",
          cvUrl: data[0].cvUrl || "",
          availableForWork: data[0].availableForWork ?? true,
        });
      }
    } catch (err) {
      setError("Failed to fetch hero information");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const url = hero ? `/api/hero?id=${hero.id}` : "/api/hero";
      const method = hero ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");

      setSuccess("Hero section updated successfully!");
      await fetchHero();
    } catch (err) {
      setError("Failed to save hero information");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Hero Section</h2>
        <p className="text-muted-foreground">Manage the hero section of your portfolio</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Hero Section Details
          </CardTitle>
          <CardDescription>
            Update the main hero section displayed on your portfolio homepage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="title">Job Title / Role *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Software Engineer & Data Scientist"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description about yourself..."
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be displayed below your name and title
                </p>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="imageUrl">Profile Image URL *</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/profile.jpg"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Direct link to your profile image
                </p>
              </div>

              {formData.imageUrl && (
                <div className="md:col-span-2">
                  <Label>Image Preview</Label>
                  <div className="mt-2 flex justify-center">
                    <div className="relative">
                      <img 
                        src={formData.imageUrl} 
                        alt="Profile preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-muted shadow-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/128";
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <Label htmlFor="cvUrl">CV / Resume URL</Label>
                <Input
                  id="cvUrl"
                  type="url"
                  value={formData.cvUrl}
                  onChange={(e) => setFormData({ ...formData, cvUrl: e.target.value })}
                  placeholder="https://drive.google.com/your-cv-link"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Link to your CV/Resume (Google Drive, Dropbox, or direct URL). This will appear as a &quot;Hire Me&quot; button on your portfolio.
                </p>
              </div>

              <div className="md:col-span-2 flex items-center space-x-2">
                <Checkbox
                  id="availableForWork"
                  checked={formData.availableForWork}
                  onCheckedChange={(checked) => setFormData({ ...formData, availableForWork: checked as boolean })}
                />
                <Label htmlFor="availableForWork" className="cursor-pointer">
                  Show "Available for opportunities" badge
                </Label>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
