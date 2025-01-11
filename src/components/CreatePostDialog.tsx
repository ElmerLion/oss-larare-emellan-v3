import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Upload, Link } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LinkMaterialDialog } from "./LinkMaterialDialog";

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

      // Insert linked materials
      if (linkedMaterials.length > 0) {
        const { error: materialsError } = await supabase
          .from('post_materials')
          .insert(
            linkedMaterials.map(material => ({
              post_id: post.id,
              title: material.title,
              type: material.type,
            }))
          );

        if (materialsError) throw materialsError;
      }

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
            className="w-full bg-[color:var(--ole-green)] border-[color:var(--hover-green)] hover:bg-[color:var(--hover-green)] text-white py-6 text-lg font-medium mb-6"
          >
            Dela en tanke
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
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
            
            {linkedMaterials.length > 0 && (
              <div className="space-y-2">
                <Label>Länkade material</Label>
                <div className="space-y-2">
                  {linkedMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span>{material.title}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMaterial(material.id)}
                      >
                        Ta bort
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Lägg till</Label>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Ladda upp fil
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowLinkMaterial(true)}
                >
                  <Link className="w-4 h-4 mr-2" />
                  Länka material
                </Button>
              </div>
            </div>

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