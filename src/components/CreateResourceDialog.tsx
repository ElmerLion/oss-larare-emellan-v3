import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import {
  subjectOptionsForGrundskola,
  gradeOptionsGrundskola,
  courseSubjectOptionsForGymnasiet,
  courseLevelsMapping,
  resourceTypeOptions, // <-- Import the type options
} from "@/types/resourceOptions";

export function CreateResourceDialog({ triggerElement }: { triggerElement?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // School-level UI (only used for controlling the UI, not stored in the table)
  const [school, setSchool] = useState("");
  // For Grundskola: subject; for Gymnasiet: course subject.
  const [subject, setSubject] = useState("all");
  // For Grundskola: grade; for Gymnasiet: course level.
  const [grade, setGrade] = useState("all");
  const [courseLevel, setCourseLevel] = useState("all");
  const [type, setType] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields.
    if (!title.trim()) {
      toast.error("Ange en titel.");
      return;
    }
    if (!description.trim()) {
      toast.error("Ange en beskrivning.");
      return;
    }
    if (!school) {
      toast.error("Välj skolnivå.");
      return;
    }
    if (!type.trim() || type === "all") {
      toast.error("Välj resurstyp.");
      return;
    }
    if (!difficulty || difficulty === "all") {
      toast.error("Välj svårighetsgrad.");
      return;
    }
    if (school === "Grundskola") {
      if (grade === "all") {
        toast.error("Välj årskurs.");
        return;
      }
      if (subject === "all") {
        toast.error("Välj ämne.");
        return;
      }
    } else if (school === "Gymnasiet") {
      if (subject === "all") {
        toast.error("Välj kursämne.");
        return;
      }
      if (courseLevelsMapping[subject] && courseLevelsMapping[subject].length > 0 && courseLevel === "all") {
        toast.error("Välj kursnivå.");
        return;
      }
    }
    if (!file) {
      toast.error("Välj en fil att ladda upp.");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Du måste vara inloggad för att dela material",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      // Build resourceData.
      const resourceData: any = {
        author_id: user.id,
        title,
        description,
        type,
        difficulty,
        file_path: filePath,
        file_name: file.name,
      };

      if (school === "Gymnasiet") {
        resourceData["subject"] = courseLevel; // e.g. "Matematik 3c"
        resourceData["grade"] = "Gymnasiet";
        resourceData["subject_level"] = courseLevel;
      } else if (school === "Grundskola") {
        resourceData["subject"] = subject;
        resourceData["grade"] = grade;
        resourceData["subject_level"] = null;
      }

      const { error: resourceError } = await supabase
        .from('resources')
        .insert(resourceData);
      if (resourceError) throw resourceError;

      toast({
        title: "Material uppladdat",
        description: "Ditt material har delats!",
      });
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Ett problem uppstod:", error);
      toast({
        title: "Error",
        description: "Kunde inte ladda upp materialet. Försök igen.",
        variant: "destructive",
      });
    }
  };

  // Reset only the dependent fields; we do not reset the school selection.
  const resetForm = () => {
    setTitle("");
    setDescription("");
    // Preserve the selected school; reset its dependents.
    setSubject("all");
    setGrade("all");
    setCourseLevel("all");
    setType("");
    setDifficulty("medium");
    setFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerElement ? triggerElement : (
          <Button variant="outline" size="sm">Dela material</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Dela material</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ange en titel för materialet"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beskriv materialet"
              className="min-h-[100px]"
              required
            />
          </div>
          {/* New Filters using shared options */}
          <div className="grid grid-cols-2 gap-4">
            {/* Skolnivå */}
            <div className="space-y-2">
              <Label htmlFor="school">Skolnivå</Label>
              <Select
                value={school}
                onValueChange={(val) => {
                  setSchool(val);
                  // Reset only dependent fields when school changes.
                  setSubject("all");
                  setGrade("all");
                  setCourseLevel("all");
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj skolnivå" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Grundskola">Grundskola</SelectItem>
                  <SelectItem value="Gymnasiet">Gymnasiet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Resurstyp */}
            <div className="space-y-2">
              <Label htmlFor="type">Resurstyp</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Välj typ" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Conditional Filters for Grundskola */}
            {school === "Grundskola" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="grade">Årskurs</Label>
                  <Select value={grade} onValueChange={setGrade} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj årskurs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Välj årskurs</SelectItem>
                      {gradeOptionsGrundskola.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Ämne</Label>
                  <Select value={subject} onValueChange={setSubject} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj ämne" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Välj ämne</SelectItem>
                      {subjectOptionsForGrundskola.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {/* Conditional Filters for Gymnasiet */}
            {school === "Gymnasiet" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="subject">Kursämne</Label>
                  <Select value={subject} onValueChange={setSubject} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj kursämne" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Välj kursämne</SelectItem>
                      {courseSubjectOptionsForGymnasiet.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {subject !== "all" && courseLevelsMapping[subject] && courseLevelsMapping[subject].length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="courseLevel">Kursnivå</Label>
                    <Select value={courseLevel} onValueChange={setCourseLevel} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj kursnivå" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Välj kursnivå</SelectItem>
                        {courseLevelsMapping[subject].map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}
            {/* Difficulty */}
            <div className="space-y-2">
              <Label htmlFor="difficulty">Svårighetsgrad</Label>
              <Select value={difficulty} onValueChange={setDifficulty} required>
                <SelectTrigger>
                  <SelectValue placeholder="Välj svårighetsgrad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Lätt</SelectItem>
                  <SelectItem value="medium">Medel</SelectItem>
                  <SelectItem value="hard">Svår</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Fil</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[color:var(--ole-green)] file:text-white hover:file:bg-[color:var(--hover-green)]"
                required
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <Button type="submit" className="bg-[color:var(--ole-green)] border-[color:var(--hover-green)] hover:bg-[color:var(--hover-green)]">
              <Upload className="w-4 h-4 mr-2" />
              Ladda upp
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
