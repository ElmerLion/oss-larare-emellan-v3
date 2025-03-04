import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";

interface FeedbackItem {
  id: number;
  user_id: string;
  message: string;
  status: string; // "open" or "saved"
  profiles: {
    full_name: string;
  } | null;
}

export function AdminFeedback(): JSX.Element {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("feedback")
        .select("id, user_id, message, status, profiles(full_name)");

      if (error) {
        console.error("Error fetching feedbacks:", error);
        toast.error("Error fetching feedbacks: " + error.message);
        setLoading(false);
        return;
      }

      if (data) {
        setFeedbacks(data);
      }
      setLoading(false);
    };

    fetchFeedbacks();
  }, []);

  // Separate feedback items into open vs. saved
  const openFeedbacks = feedbacks.filter((f) => f.status === "open");
  const savedFeedbacks = feedbacks.filter((f) => f.status === "saved");

  // Mark feedback as saved
  const handleSave = async (id: number) => {
    const { error } = await supabase
      .from("feedback")
      .update({ status: "saved" })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error saving feedback:", error);
      toast.error("Failed to save feedback: " + error.message);
      return;
    }

    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "saved" } : f))
    );
    toast.success("Feedback saved!");
  };

  // Delete feedback
  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from("feedback")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback: " + error.message);
      return;
    }

    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    toast.success("Feedback deleted!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />
      <main className="pl-64 p-4 mx-8">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* OPEN FEEDBACK SECTION */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2 ml-4">
                Öppen Feedback
              </h2>
              {openFeedbacks.length === 0 ? (
                <div className="ml-4">Ingen öppen feedback hittad.</div>
              ) : (
                <div className="space-y-4">
                  {openFeedbacks.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow p-4 flex flex-col"
                    >
                      <div>
                        <div className="font-semibold">
                          {item.profiles ? item.profiles.full_name : "Unknown"}
                        </div>
                        <div className="text-gray-600 mt-1 break-words">
                          {item.message}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          onClick={() => handleSave(item.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Spara
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Ta bort
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* SAVED FEEDBACK SECTION */}
            <section>
              <h2 className="text-xl font-semibold mb-2 ml-4">
                Sparad Feedback
              </h2>
              {savedFeedbacks.length === 0 ? (
                <div className="ml-4">Ingen sparad feedback hittad.</div>
              ) : (
                <div className="space-y-4">
                  {savedFeedbacks.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow p-4 flex flex-col"
                    >
                      <div>
                        <div className="font-semibold">
                          {item.profiles ? item.profiles.full_name : "Unknown"}
                        </div>
                        <div className="text-gray-600 mt-1 break-words">
                          {item.message}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Ta bort
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
