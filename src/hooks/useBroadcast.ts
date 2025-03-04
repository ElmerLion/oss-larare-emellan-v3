import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBroadcast = () => {
  return useQuery({
    queryKey: ["broadcast"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("broadcast")
        .select("*")
        .eq("id", 1)
        .single();
      if (error) throw error;
      return data;
    },
    staleTime: 60000, // cache for 1 minute
  });
};