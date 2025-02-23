import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourceDetailsDialog } from "@/components/resources/ResourceDetailsDialog";
import MiniProfile from "@/components/profile/MiniProfile";

export function AdminOverview(): JSX.Element {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState<boolean>(false);

  // Dropdown states for each section
  const [openComments, setOpenComments] = useState(true);
  const [openPosts, setOpenPosts] = useState(true);
  const [openDiscussions, setOpenDiscussions] = useState(true);
  const [openResources, setOpenResources] = useState(true);
  const [openAccounts, setOpenAccounts] = useState(true);

  // Query for recent comments (with full profile data)
  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["adminComments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_comments")
        .select(`
          id,
          content,
          created_at,
          post_id,
          profiles(id, full_name, avatar_url, title, school)
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  // Query for recent posts (with full profile data)
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ["adminPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          content,
          created_at,
          profiles(id, full_name, avatar_url, title, school)
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  // Query for recent discussions (with creator profile)
  const {
    data: discussions,
    isLoading: discussionsLoading,
    error: discussionsError,
  } = useQuery({
    queryKey: ["adminDiscussions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussions")
        .select(`
          slug,
          question,
          description,
          created_at,
          creator:profiles(id, full_name, avatar_url, title, school)
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  // Query for recent resources (with author profile)
  const {
    data: resources,
    isLoading: resourcesLoading,
    error: resourcesError,
  } = useQuery({
    queryKey: ["adminResources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select(`
          id,
          title,
          description,
          subject,
          grade,
          type,
          difficulty,
          file_path,
          file_name,
          author_id,
          subject_level,
          created_at,
          author:profiles(id, full_name, avatar_url, title, school)
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  // Query for recently created accounts (profiles)
  const {
    data: accounts,
    isLoading: accountsLoading,
    error: accountsError,
  } = useQuery({
    queryKey: ["newAccounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  if (
    commentsError ||
    postsError ||
    discussionsError ||
    resourcesError ||
    accountsError
  ) {
    toast.error("Ett fel uppstod vid hämtning av översiktsdata");
  }

  const isLoading =
    commentsLoading ||
    postsLoading ||
    discussionsLoading ||
    resourcesLoading ||
    accountsLoading;

  // Delete functions for each type
  const deleteComment = async (id: string) => {
    const { error } = await supabase.from("post_comments").delete().eq("id", id);
    if (error) {
      toast.error("Kunde inte ta bort kommentaren: " + error.message);
    } else {
      toast.success("Kommentar borttagen");
      queryClient.invalidateQueries(["adminComments"]);
    }
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      toast.error("Kunde inte ta bort inlägget: " + error.message);
    } else {
      toast.success("Inlägg borttaget");
      queryClient.invalidateQueries(["adminPosts"]);
    }
  };

  const deleteDiscussion = async (slug: string) => {
    const { error } = await supabase
      .from("discussions")
      .delete()
      .eq("slug", slug);
    if (error) {
      toast.error("Kunde inte ta bort diskussionen: " + error.message);
    } else {
      toast.success("Diskussion borttagen");
      queryClient.invalidateQueries(["adminDiscussions"]);
    }
  };

  const deleteResource = async (id: string) => {
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) {
      toast.error("Kunde inte ta bort resursen: " + error.message);
    } else {
      toast.success("Resurs borttagen");
      queryClient.invalidateQueries(["adminResources"]);
    }
  };

  const deleteAccount = async (id: string) => {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) {
      toast.error("Kunde inte ta bort kontot: " + error.message);
    } else {
      toast.success("Konto borttaget");
      queryClient.invalidateQueries(["newAccounts"]);
    }
  };

  // Query for groups
  const {
    data: adminGroups,
    isLoading: groupsLoading,
    error: groupsError,
  } = useQuery({
    queryKey: ["adminGroups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteGroup = async (id: string) => {
    const { error } = await supabase.from("groups").delete().eq("id", id);
    if (error) {
      toast.error("Kunde inte ta bort gruppen: " + error.message);
    } else {
      toast.success("Grupp borttagen");
      queryClient.invalidateQueries(["adminGroups"]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />
      <main className="pl-64 p-4 mx-8">
        <h1 className="text-2xl font-bold mb-8">Översikt</h1>
        {isLoading ? (
          <div>Laddar översikt...</div>
        ) : (
          <>
            {/* Recent Comments Section */}
            <section className="mb-8">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setOpenComments(!openComments)}
              >
                <h2 className="text-xl font-semibold mb-4">
                  Senaste Kommentarer
                </h2>
                {openComments ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
              {openComments && (
                <>
                  {comments && comments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {comments.map((comment: any) => (
                        <div
                          key={comment.id}
                          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition relative"
                        >
                          <Link
                            to={`/forum/${comment.post_id}`}
                            className="block"
                          >
                            <MiniProfile
                              id={comment.profiles.id}
                              name={comment.profiles.full_name}
                              avatarUrl={comment.profiles.avatar_url}
                              title={comment.profiles.title}
                              school={comment.profiles.school}
                              created_at={comment.created_at}
                              size="small"
                            />
                            <p className="text-gray-600 mt-2 line-clamp-2">
                              {comment.content}
                            </p>
                          </Link>
                          <button
                            onClick={() => deleteComment(comment.id)}
                            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Inga kommentarer hittades.</p>
                  )}
                </>
              )}
            </section>

            {/* Recent Posts Section */}
            <section className="mb-8">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setOpenPosts(!openPosts)}
              >
                <h2 className="text-xl font-semibold mb-4">Senaste Inlägg</h2>
                {openPosts ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
              {openPosts && (
                <>
                  {posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {posts.map((post: any) => (
                        <div
                          key={post.id}
                          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition relative cursor-pointer"
                          onClick={() => navigate("/home")}
                        >
                          <MiniProfile
                            id={post.profiles.id}
                            name={post.profiles.full_name}
                            avatarUrl={post.profiles.avatar_url}
                            title={post.profiles.title}
                            school={post.profiles.school}
                            created_at={post.created_at}
                            size="small"
                          />
                          <p className="text-gray-600 mt-2 line-clamp-2">
                            {post.content}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePost(post.id);
                            }}
                            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Inga inlägg hittades.</p>
                  )}
                </>
              )}
            </section>

            {/* Recent Discussions Section */}
            <section className="mb-8">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setOpenDiscussions(!openDiscussions)}
              >
                <h2 className="text-xl font-semibold mb-4">
                  Senaste Diskussioner
                </h2>
                {openDiscussions ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
              {openDiscussions && (
                <>
                  {discussions && discussions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {discussions.map((discussion: any) => (
                        <div
                          key={discussion.slug}
                          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition relative"
                        >
                          <Link
                            to={`/forum/${discussion.slug}`}
                            className="block"
                          >
                            <MiniProfile
                              id={discussion.creator.id}
                              name={discussion.creator.full_name}
                              avatarUrl={discussion.creator.avatar_url}
                              title={discussion.creator.title}
                              school={discussion.creator.school}
                              created_at={discussion.created_at}
                              size="small"
                            />
                            <p className="text-gray-800 font-medium">
                              {discussion.question}
                            </p>
                            <p className="text-gray-600 mt-2 line-clamp-2">
                              {discussion.description}
                            </p>
                          </Link>
                          <button
                            onClick={() => deleteDiscussion(discussion.slug)}
                            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Inga diskussioner hittades.</p>
                  )}
                </>
              )}
            </section>

            {/* Recent Resources Section */}
            <section className="mb-8">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setOpenResources(!openResources)}
              >
                <h2 className="text-xl font-semibold mb-4">Senaste Resurser</h2>
                {openResources ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
              {openResources && (
                <>
                  {resources && resources.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {resources.map((resource: any) => (
                        <div
                          key={resource.id}
                          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition relative cursor-pointer"
                          onClick={() => {
                            setSelectedResource(resource);
                            setIsResourceDialogOpen(true);
                          }}
                        >
                          <MiniProfile
                            id={resource.author.id}
                            name={resource.author.full_name}
                            avatarUrl={resource.author.avatar_url}
                            title={resource.author.title}
                            school={resource.author.school}
                            created_at={resource.created_at}
                            size="small"
                          />
                          <p className="text-gray-800 font-medium">
                            {resource.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteResource(resource.id);
                            }}
                            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Inga resurser hittades.</p>
                  )}
                </>
              )}
            </section>
            {/* Recent Groups Section */}
            <section className="mb-8">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => {}}
              >
                <h2 className="text-xl font-semibold mb-4">Senaste Grupper</h2>
              </div>
              {groupsLoading ? (
                <div>Laddar grupper...</div>
              ) : adminGroups && adminGroups.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {adminGroups.map((group: any) => (
                    <div
                      key={group.id}
                      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition relative cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={group.icon_url || "/group-placeholder.svg"}
                          alt={group.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-gray-800 font-medium">{group.name}</p>
                          <p className="text-gray-600">{group.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            window.confirm(
                              `Är du säker på att du vill ta bort gruppen "${group.name}"?`
                            )
                          ) {
                            deleteGroup(group.id);
                          }
                        }}
                        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Inga grupper hittades.</p>
              )}
            </section>


          </>
        )}
        {selectedResource && (
          <ResourceDetailsDialog
            resource={selectedResource}
            open={isResourceDialogOpen}
            onOpenChange={setIsResourceDialogOpen}
            onResourceUpdate={(updatedResource) =>
              setSelectedResource(updatedResource)
            }
          />
        )}
      </main>
    </div>
  );
}

export default AdminOverview;
