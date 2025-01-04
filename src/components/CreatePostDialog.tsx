import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Upload, Link } from "lucide-react";

export function CreatePostDialog() {
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual post creation
    console.log("Creating post:", content);
    setIsOpen(false);
    setContent("");
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