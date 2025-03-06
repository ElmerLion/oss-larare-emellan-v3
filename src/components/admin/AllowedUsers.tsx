import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AllowedUsersManager() {
  const queryClient = useQueryClient();
  const [newEmail, setNewEmail] = useState("");

  // Fetch allowed_users
  const {
    data: allowedUsers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allowedUsers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("allowed_users")
        .select("*")
        .order("email");
      if (error) throw error;
      return data;
    },
  });

  // Mutation to add a new allowed user
  const addUserMutation = useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase
        .from("allowed_users")
        .insert({ email });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Användare tillagd!");
      queryClient.invalidateQueries({ queryKey: ["allowedUsers"] });
      setNewEmail("");
    },
    onError: (error: any) => {
      toast.error("Error adding user: " + error.message);
    },
  });

  // Mutation to remove an allowed user
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("allowed_users")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("User removed successfully");
      queryClient.invalidateQueries({ queryKey: ["allowedUsers"] });
    },
    onError: (error: any) => {
      toast.error("Error removing user: " + error.message);
    },
  });

  const handleAddUser = () => {
    if (!newEmail.trim()) return;
    addUserMutation.mutate(newEmail.trim());
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mx-auto">
      <h2 className="text-2xl font-bold">Tillåtna Användare</h2>
      <p className="mb-4">Skriv alltid med små bokstäver.</p>
      <div className="flex flex-col sm:flex-row items-center mb-4 gap-2">
        <input
          type="email"
          placeholder="Enter email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="border rounded px-2 py-2 w-full sm:w-auto"
        />
        <Button className="bg-[color:var(--ole-green)] hover:bg-[color:var(--hover-green)] text-white" onClick={handleAddUser} disabled={addUserMutation.isLoading}>
          Lägg till användare
        </Button>
      </div>
      {isLoading ? (
        <div>Laddar tillåtna användare...</div>
      ) : error ? (
        <div>Ett problem  uppstod.</div>
      ) : (
        <ul className="space-y-2">
          {allowedUsers && allowedUsers.length > 0 ? (
            allowedUsers.map((user: any) => (
              <li key={user.id} className="flex items-center justify-between border-b pb-2">
                <span className="break-words">{user.email}</span>
                <Button
                  variant="outline"
                  onClick={() => deleteUserMutation.mutate(user.id)}
                  disabled={deleteUserMutation.isLoading}
                >
                  Ta bort
                </Button>
              </li>
            ))
          ) : (
            <li>Inga tillåtna användare hittades.</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default AllowedUsersManager;
