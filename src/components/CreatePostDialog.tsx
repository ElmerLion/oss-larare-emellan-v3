import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LinkMaterialDialog } from "./LinkMaterialDialog";
import { LinkedMaterialsList } from "./post/LinkedMaterialsList";
import { PostActionButtons } from "./post/PostActionButtons";
import { useQueryClient } from "@tanstack/react-query";

interface Material {
  id: string;
  title: string;
  description: string;
  type: string;
}

export function CreatePostDialog() {
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showLinkMaterial, setShowLinkMaterial] = useState(false);
  const [linkedMaterials, setLinkedMaterials] = useState<Material[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a post",
          variant: "destructive",
        });
        return;
      }

      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          content,
          author_id: user.id,
        })
        .select()
        .single();

      if (postError) throw postError;

      if (linkedMaterials.length > 0) {
        const { error: materialsError } = await supabase
          .from('post_materials')
          .insert(
            linkedMaterials.map(material => ({
              post_id: post.id,
              title: material.title,
              type: material.type,
              resource_id: material.id,
            }))
          );

        if (materialsError) throw materialsError;
      }

      // Invalidate and refetch posts query to show the new post immediately
      await queryClient.invalidateQueries({ queryKey: ['posts'] });

      toast({
        title: "Publicerad",
        description: "Din post har delats!",
      });

      setIsOpen(false);
      setContent("");
      setLinkedMaterials([]);
    } catch (error) {
      console.error('Ett problem uppstod:', error);
      toast({
        title: "Error",
        description: "Misslyckades att skapa en post. Försök igen.",
        variant: "destructive",
      });
    }
  };

  const handleMaterialSelect = (material: Material) => {
    setLinkedMaterials(prev => [...prev, material]);
  };

  const removeMaterial = (materialId: string) => {
    setLinkedMaterials(prev => prev.filter(m => m.id !== materialId));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full bg-[color:var(--ole-green)] border-[color:var(--hover-green)] hover:bg-[color:var(--hover-green)] text-white py-6 text-lg font-medium mt-2"
          >
            Dela en tanke
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px] bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Dela en tanke</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Vad vill du dela med dig av?</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Skriv din text här..."
                className="min-h-[150px]"
              />
            </div>
            
            <LinkedMaterialsList 
              materials={linkedMaterials}
              onRemove={removeMaterial}
            />
            
            <PostActionButtons
              onUploadClick={() => {}}
              onLinkClick={() => setShowLinkMaterial(true)}
            />

            <div className="pt-4 flex justify-end">
              <Button type="submit" className="bg-[color:var(--ole-green)] border-[color:var(--hover-green)] hover:bg-[color:var(--hover-green)]">
                Publicera
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <LinkMaterialDialog
        open={showLinkMaterial}
        onOpenChange={setShowLinkMaterial}
        onSelect={handleMaterialSelect}
      />
    </>
  );
}