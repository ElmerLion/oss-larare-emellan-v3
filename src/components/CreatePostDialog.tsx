import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Upload, Link } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function CreatePostDialog() {
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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

      toast({
        title: "Success",
        description: "Your post has been published!",
      });

      setIsOpen(false);
      setContent("");
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-sage-500 hover:bg-sage-600 text-white py-6 text-lg font-medium mb-6"
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
          
          <div className="space-y-2">
            <Label>Lägg till</Label>
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Ladda upp fil
              </Button>
              <Button type="button" variant="outline" className="flex-1">
                <Link className="w-4 h-4 mr-2" />
                Länka material
              </Button>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" className="bg-sage-500 hover:bg-sage-600">
              Publicera
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}