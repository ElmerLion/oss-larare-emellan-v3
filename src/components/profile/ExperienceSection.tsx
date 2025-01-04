import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EditExperienceDialog } from "./EditExperienceDialog";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  is_current: boolean;
}

export function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { toast } = useToast();

  const fetchExperiences = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching experiences:', error);
      return;
    }

    setExperiences(data || []);
    setIsCurrentUser(!!user);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete experience. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Experience deleted",
      description: "Your experience has been deleted successfully.",
    });
    fetchExperiences();
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Arbetslivserfarenhet</h2>
        {isCurrentUser && (
          <EditExperienceDialog onExperienceUpdate={fetchExperiences} />
        )}
      </div>
      <div className="space-y-4">
        {experiences.map((experience) => (
          <div key={experience.id} className="flex items-start gap-4">
            <div className={`w-3 h-3 ${experience.is_current ? 'bg-green-500' : 'bg-gray-500'} rounded-full mt-2`} />
            <div className="flex-1">
              <div className="text-gray-600">
                {format(new Date(experience.start_date), 'yyyy')} - {
                  experience.is_current ? 'Nu' : 
                  experience.end_date ? format(new Date(experience.end_date), 'yyyy') : ''
                }
              </div>
              <div className="font-medium">{experience.role}</div>
              <div className="text-gray-600">{experience.company}</div>
              {experience.description && (
                <div className="text-gray-800 mt-2">{experience.description}</div>
              )}
            </div>
            {isCurrentUser && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(experience.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}