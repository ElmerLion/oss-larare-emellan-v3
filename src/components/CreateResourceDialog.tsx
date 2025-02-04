// CreateResourceDialog.tsx
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

interface CreateResourceDialogProps {
  // If provided, this element will be used as the trigger
  triggerElement?: React.ReactNode;
}

export function CreateResourceDialog({ triggerElement }: CreateResourceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
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

      if (!file) {
        toast({
          title: "Error",
          description: "Du måste välja en fil att ladda upp",
          variant: "destructive",
        });
        return;
      }

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create resource record
      const { error: resourceError } = await supabase
        .from('resources')
        .insert({
          author_id: user.id,
          title,
          description,
          subject,
          grade,
          type,
          difficulty,
          file_path: filePath,
          file_name: file.name
        });

      if (resourceError) throw resourceError;

      toast({
        title: "Material uppladdat",
        description: "Ditt material har delats!",
      });

      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error('Ett problem uppstod:', error);
      toast({
        title: "Error",
        description: "Kunde inte ladda upp materialet. Försök igen.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSubject("");
    setGrade("");
    setType("");
    setDifficulty("medium");
    setFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerElement ? triggerElement : (
          <Button variant="outline" size="sm">
            Dela material
          </Button>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Ämne</Label>
              <Select value={subject} onValueChange={setSubject} required>
                <SelectTrigger>
                  <SelectValue placeholder="Välj ämne" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Matematik">Matematik</SelectItem>
                  <SelectItem value="Svenska">Svenska</SelectItem>
                  <SelectItem value="Engelska">Engelska</SelectItem>
                  <SelectItem value="Programmering">Programmering</SelectItem>
                  <SelectItem value="Samhällskunskap">Samhällskunskap</SelectItem>
                  <SelectItem value="Fysik">Fysik</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Årskurs</Label>
              <Select value={grade} onValueChange={setGrade} required>
                <SelectTrigger>
                  <SelectValue placeholder="Välj årskurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Årskurs 1">Årskurs 1</SelectItem>
                  <SelectItem value="Årskurs 2">Årskurs 2</SelectItem>
                  <SelectItem value="Årskurs 3">Årskurs 3</SelectItem>
                  <SelectItem value="Årskurs 4">Årskurs 4</SelectItem>
                  <SelectItem value="Årskurs 5">Årskurs 5</SelectItem>
                  <SelectItem value="Årskurs 6">Årskurs 6</SelectItem>
                  <SelectItem value="Årskurs 7">Årskurs 7</SelectItem>
                  <SelectItem value="Årskurs 8">Årskurs 8</SelectItem>
                  <SelectItem value="Årskurs 9">Årskurs 9</SelectItem>
                  <SelectItem value="Gymnasiet 1">Gymnasiet 1</SelectItem>
                  <SelectItem value="Gymnasiet 2">Gymnasiet 2</SelectItem>
                  <SelectItem value="Gymnasiet 3">Gymnasiet 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Resurstyp</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Välj typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Prov">Prov</SelectItem>
                  <SelectItem value="Anteckningar">Anteckningar</SelectItem>
                  <SelectItem value="Lektionsplanering">Lektionsplanering</SelectItem>
                  <SelectItem value="Quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Svårighetsgrad</Label>
              <Select value={difficulty} onValueChange={(value: "easy" | "medium" | "hard") => setDifficulty(value)} required>
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
