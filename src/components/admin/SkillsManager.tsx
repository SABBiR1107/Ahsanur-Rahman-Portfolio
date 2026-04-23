"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface Skill {
  id: number;
  name: string;
  category: "hard" | "soft" | "tool";
  proficiency: number | null;
  iconUrl: string | null;
}

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "hard" as "hard" | "soft" | "tool",
    proficiency: 50,
    iconUrl: "",
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      setError("Failed to fetch skills");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const url = editingId ? `/api/skills?id=${editingId}` : "/api/skills";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");

      await fetchSkills();
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      setError("Failed to save skill");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency ?? 0,
      iconUrl: skill.iconUrl ?? "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      const token = localStorage.getItem("bearer_token");
      await fetch(`/api/skills?id=${id}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      await fetchSkills();
    } catch (err) {
      setError("Failed to delete skill");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "hard",
      proficiency: 50,
      iconUrl: "",
    });
    setEditingId(null);
    setError("");
  };

  const hardSkills = skills.filter((s) => s.category === "hard");
  const softSkills = skills.filter((s) => s.category === "soft");
  const tools = skills.filter((s) => s.category === "tool");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Skills Management</h2>
          <p className="text-muted-foreground">Manage your technical and soft skills</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Skill</DialogTitle>
              <DialogDescription>
                {editingId ? "Update" : "Add"} a skill to your portfolio
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div>
                <Label htmlFor="name">Skill Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: "hard" | "soft" | "tool") => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hard">Hard Skill</SelectItem>
                    <SelectItem value="soft">Soft Skill</SelectItem>
                    <SelectItem value="tool">Tool/Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.category !== "tool" ? (
                <div>
                  <Label htmlFor="proficiency">Progress: {formData.proficiency}%</Label>
                  <div className="space-y-3 pt-2">
                    <Slider
                      id="proficiency"
                      min={0}
                      max={100}
                      step={10}
                      value={[formData.proficiency]}
                      onValueChange={(value) => setFormData({ ...formData, proficiency: value[0] })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="iconUrl">Icon URL (SVG/PNG) *</Label>
                  <Input
                    id="iconUrl"
                    placeholder="https://example.com/icon.svg"
                    value={formData.iconUrl}
                    onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                    required={formData.category === "tool"}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Tip: Use simple SVG icons for best results.
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingId ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hard Skills ({hardSkills.length})</CardTitle>
              <CardDescription>Technical expertise and tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hardSkills.map((skill) => (
                  <div key={skill.id} className="space-y-2 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Badge variant="default">{skill.name}</Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(skill)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(skill.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all duration-300"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {hardSkills.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hard skills added yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Soft Skills ({softSkills.length})</CardTitle>
              <CardDescription>Interpersonal abilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {softSkills.map((skill) => (
                  <div key={skill.id} className="space-y-2 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{skill.name}</Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(skill)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(skill.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-secondary rounded-full h-2 transition-all duration-300"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {softSkills.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No soft skills added yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Tools & Technologies ({tools.length})</CardTitle>
              <CardDescription>Software, frameworks, and libraries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {tools.map((tool) => (
                  <div key={tool.id} className="relative group flex flex-col items-center justify-center p-4 border rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(tool)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(tool.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    {tool.iconUrl ? (
                      <img src={tool.iconUrl} alt={tool.name} className="h-10 w-10 mb-3 object-contain" />
                    ) : (
                      <div className="h-10 w-10 mb-3 bg-muted rounded flex items-center justify-center text-xs">No Icon</div>
                    )}
                    <span className="text-sm font-medium text-center truncate w-full">{tool.name}</span>
                  </div>
                ))}
                {tools.length === 0 && (
                  <p className="col-span-full text-sm text-muted-foreground text-center py-8">
                    No tools added yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}