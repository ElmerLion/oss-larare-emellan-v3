import React, { useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { ResourceDetailsDialog } from "@/components/resources/ResourceDetailsDialog";
import { AdminItemsList } from "./AdminItemsList";
import { Button } from "@/components/ui/button";

export function AdminOverview(): JSX.Element {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [selectedResource, setSelectedResource] = useState<any>(null);
    const [isResourceDialogOpen, setIsResourceDialogOpen] = useState<boolean>(false);

    // Query for recent comments with pagination
    const {
        data: commentsPages,
        fetchNextPage: fetchNextCommentsPage,
        hasNextPage: hasNextCommentsPage,
        isLoading: commentsLoading,
        error: commentsError,
    } = useInfiniteQuery({
        queryKey: ["adminComments"],
        queryFn: async ({ pageParam = 0 }) => {
            const limit = 5;
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
                .range(pageParam, pageParam + limit - 1);
            if (error) throw error;
            return { data, nextPage: data && data.length === limit ? pageParam + limit : undefined };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    // Query for recent posts with pagination
    const {
        data: postsPages,
        fetchNextPage: fetchNextPostsPage,
        hasNextPage: hasNextPostsPage,
        isLoading: postsLoading,
        error: postsError,
    } = useInfiniteQuery({
        queryKey: ["adminPosts"],
        queryFn: async ({ pageParam = 0 }) => {
            const limit = 5;
            const { data, error } = await supabase
                .from("posts")
                .select(`
          id,
          content,
          created_at,
          profiles(id, full_name, avatar_url, title, school)
        `)
                .order("created_at", { ascending: false })
                .range(pageParam, pageParam + limit - 1);
            if (error) throw error;
            return { data, nextPage: data && data.length === limit ? pageParam + limit : undefined };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    // Query for recent discussions with pagination
    const {
        data: discussionsPages,
        fetchNextPage: fetchNextDiscussionsPage,
        hasNextPage: hasNextDiscussionsPage,
        isLoading: discussionsLoading,
        error: discussionsError,
    } = useInfiniteQuery({
        queryKey: ["adminDiscussions"],
        queryFn: async ({ pageParam = 0 }) => {
            const limit = 5;
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
                .range(pageParam, pageParam + limit - 1);
            if (error) throw error;
            return { data, nextPage: data && data.length === limit ? pageParam + limit : undefined };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    // Query for recent resources with pagination
    const {
        data: resourcesPages,
        fetchNextPage: fetchNextResourcesPage,
        hasNextPage: hasNextResourcesPage,
        isLoading: resourcesLoading,
        error: resourcesError,
    } = useInfiniteQuery({
        queryKey: ["adminResources"],
        queryFn: async ({ pageParam = 0 }) => {
            const limit = 5;
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
                .range(pageParam, pageParam + limit - 1);
            if (error) throw error;
            return { data, nextPage: data && data.length === limit ? pageParam + limit : undefined };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    // Query for recently created accounts with pagination, now selecting last_seen instead of created_at
    const {
        data: accountsPages,
        fetchNextPage: fetchNextAccountsPage,
        hasNextPage: hasNextAccountsPage,
        isLoading: accountsLoading,
        error: accountsError,
    } = useInfiniteQuery({
        queryKey: ["newAccounts"],
        queryFn: async ({ pageParam = 0 }) => {
            const limit = 5;
            const { data, error } = await supabase
                .from("profiles")
                .select("id, full_name, avatar_url, last_seen, email")
                .order("last_seen", { ascending: false })
                .range(pageParam, pageParam + limit - 1);
            if (error) throw error;
            return { data, nextPage: data && data.length === limit ? pageParam + limit : undefined };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    // Query for groups with pagination
    const {
        data: groupsPages,
        fetchNextPage: fetchNextGroupsPage,
        hasNextPage: hasNextGroupsPage,
        isLoading: groupsLoading,
        error: groupsError,
    } = useInfiniteQuery({
        queryKey: ["adminGroups"],
        queryFn: async ({ pageParam = 0 }) => {
            const limit = 5;
            const { data, error } = await supabase
                .from("groups")
                .select("*")
                .order("created_at", { ascending: false })
                .range(pageParam, pageParam + limit - 1);
            if (error) throw error;
            return { data, nextPage: data && data.length === limit ? pageParam + limit : undefined };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    if (
        commentsError ||
        postsError ||
        discussionsError ||
        resourcesError ||
        accountsError ||
        groupsError
    ) {
        toast.error("Ett fel uppstod vid hämtning av översiktsdata");
    }

    const isLoading =
        commentsLoading ||
        postsLoading ||
        discussionsLoading ||
        resourcesLoading ||
        accountsLoading ||
        groupsLoading;

    const deleteComment = async (id: string) => {
        const { error } = await supabase.from("post_comments").delete().eq("id", id);
        if (error) {
            toast.error("Kunde inte ta bort kommentaren: " + error.message);
        } else {
            toast.success("Kommentar borttagen");
            queryClient.invalidateQueries({ queryKey: ["adminComments"] });
        }
    };

    const deletePost = async (id: string) => {
        const { error } = await supabase.from("posts").delete().eq("id", id);
        if (error) {
            toast.error("Kunde inte ta bort inlägget: " + error.message);
        } else {
            toast.success("Inlägg borttaget");
            queryClient.invalidateQueries({ queryKey: ["adminPosts"] });
        }
    };

    const deleteDiscussion = async (slug: string) => {
        const { error } = await supabase.from("discussions").delete().eq("slug", slug);
        if (error) {
            toast.error("Kunde inte ta bort diskussionen: " + error.message);
        } else {
            toast.success("Diskussion borttagen");
            queryClient.invalidateQueries({ queryKey: ["adminDiscussions"] });
        }
    };

    const deleteResource = async (id: string) => {
        const { error } = await supabase.from("resources").delete().eq("id", id);
        if (error) {
            toast.error("Kunde inte ta bort resursen: " + error.message);
        } else {
            toast.success("Resurs borttagen");
            queryClient.invalidateQueries({ queryKey: ["adminResources"] });
        }
    };

    const deleteAccount = async (id: string) => {
        const { error } = await supabase.from("profiles").delete().eq("id", id);
        if (error) {
            toast.error("Kunde inte ta bort kontot: " + error.message);
        } else {
            toast.success("Konto borttaget");
            queryClient.invalidateQueries({ queryKey: ["newAccounts"] });
        }
    };

    const deleteGroup = async (id: string) => {
        const { error } = await supabase.from("groups").delete().eq("id", id);
        if (error) {
            toast.error("Kunde inte ta bort gruppen: " + error.message);
        } else {
            toast.success("Grupp borttagen");
            queryClient.invalidateQueries({ queryKey: ["adminGroups"] });
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
                    <AdminItemsList
                        comments={commentsPages ? commentsPages.pages.flatMap((page) => page.data) : []}
                        posts={postsPages ? postsPages.pages.flatMap((page) => page.data) : []}
                        discussions={discussionsPages ? discussionsPages.pages.flatMap((page) => page.data) : []}
                        resources={resourcesPages ? resourcesPages.pages.flatMap((page) => page.data) : []}
                        accounts={accountsPages ? accountsPages.pages.flatMap((page) => page.data) : []}
                        adminGroups={groupsPages ? groupsPages.pages.flatMap((page) => page.data) : []}
                        deleteComment={deleteComment}
                        deletePost={deletePost}
                        deleteDiscussion={deleteDiscussion}
                        deleteResource={deleteResource}
                        deleteAccount={deleteAccount}
                        deleteGroup={deleteGroup}
                        selectedResource={selectedResource}
                        setSelectedResource={setSelectedResource}
                        isResourceDialogOpen={isResourceDialogOpen}
                        setIsResourceDialogOpen={setIsResourceDialogOpen}
                        fetchNextCommentsPage={fetchNextCommentsPage}
                        hasNextCommentsPage={!!hasNextCommentsPage}
                        fetchNextPostsPage={fetchNextPostsPage}
                        hasNextPostsPage={!!hasNextPostsPage}
                        fetchNextDiscussionsPage={fetchNextDiscussionsPage}
                        hasNextDiscussionsPage={!!hasNextDiscussionsPage}
                        fetchNextResourcesPage={fetchNextResourcesPage}
                        hasNextResourcesPage={!!hasNextResourcesPage}
                        fetchNextAccountsPage={fetchNextAccountsPage}
                        hasNextAccountsPage={!!hasNextAccountsPage}
                        fetchNextGroupsPage={fetchNextGroupsPage}
                        hasNextGroupsPage={!!hasNextGroupsPage}
                    />
                )}
            </main>
            <ResourceDetailsDialog
                resource={selectedResource}
                open={isResourceDialogOpen}
                onOpenChange={setIsResourceDialogOpen}
                onResourceUpdate={(updatedResource) =>
                    setSelectedResource(updatedResource)
                }
            />
        </div>
    );
}

export default AdminOverview;
