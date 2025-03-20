import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { MiniProfile } from "@/components/profile/MiniProfile";
import { ResourceDetailsDialog } from "@/components/resources/ResourceDetailsDialog";
import { Button } from "@/components/ui/button";

interface AdminItemsListProps {
  comments: any[];
  posts: any[];
  discussions: any[];
  resources: any[];
  accounts: any[];
  adminGroups: any[];
  deleteComment: (id: string) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  deleteDiscussion: (slug: string) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  // Pagination props
  fetchNextCommentsPage: () => void;
  hasNextCommentsPage: boolean;
  fetchNextPostsPage: () => void;
  hasNextPostsPage: boolean;
  fetchNextDiscussionsPage: () => void;
  hasNextDiscussionsPage: boolean;
  fetchNextResourcesPage: () => void;
  hasNextResourcesPage: boolean;
  fetchNextAccountsPage: () => void;
  hasNextAccountsPage: boolean;
  fetchNextGroupsPage: () => void;
  hasNextGroupsPage: boolean;
  // Resource dialog props
  selectedResource: any;
  setSelectedResource: React.Dispatch<React.SetStateAction<any>>;
  isResourceDialogOpen: boolean;
  setIsResourceDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AdminItemsList({
  comments,
  posts,
  discussions,
  resources,
  accounts,
  adminGroups,
  deleteComment,
  deletePost,
  deleteDiscussion,
  deleteResource,
  deleteAccount,
  deleteGroup,
  fetchNextCommentsPage,
  hasNextCommentsPage,
  fetchNextPostsPage,
  hasNextPostsPage,
  fetchNextDiscussionsPage,
  hasNextDiscussionsPage,
  fetchNextResourcesPage,
  hasNextResourcesPage,
  fetchNextAccountsPage,
  hasNextAccountsPage,
  fetchNextGroupsPage,
  hasNextGroupsPage,
  selectedResource,
  setSelectedResource,
  isResourceDialogOpen,
  setIsResourceDialogOpen,
}: AdminItemsListProps) {
  const navigate = useNavigate();

  // Local state toggles for each section
  const [openComments, setOpenComments] = useState(true);
  const [openPosts, setOpenPosts] = useState(true);
  const [openDiscussions, setOpenDiscussions] = useState(true);
  const [openResources, setOpenResources] = useState(true);
  const [openAccounts, setOpenAccounts] = useState(true);
  const [openGroups, setOpenGroups] = useState(true);

  return (
    <>
      {/* Recent Comments */}
      <section className="mb-8">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setOpenComments(!openComments)}
        >
          <h2 className="text-xl font-semibold mb-4">Senaste Kommentarer</h2>
          {openComments ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
        {openComments && (
          <>
            {comments.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {comments.map((comment: any) => (
                    <div
                      key={comment.id}
                      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition relative"
                    >
                      <Link to={`/forum/${comment.post_id}`} className="block">
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
                {hasNextCommentsPage && (
                  <div className="mt-4 flex justify-center">
                    <Button className="bg-[var(--ole-green)] hover:bg-[var(--hover-green)]" onClick={fetchNextCommentsPage}>
                      Ladda fler kommentarer
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p>Inga kommentarer hittades.</p>
            )}
          </>
        )}
      </section>

      {/* Recent Posts */}
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
            {posts.length > 0 ? (
              <>
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
                {hasNextPostsPage && (
                  <div className="mt-4 flex justify-center">
                    <Button className="bg-[var(--ole-green)] hover:bg-[var(--hover-green)]"  onClick={fetchNextPostsPage}>
                      Ladda fler inlägg
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p>Inga inlägg hittades.</p>
            )}
          </>
        )}
      </section>

      {/* Recent Discussions */}
      <section className="mb-8">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setOpenDiscussions(!openDiscussions)}
        >
          <h2 className="text-xl font-semibold mb-4">Senaste Diskussioner</h2>
          {openDiscussions ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
        {openDiscussions && (
          <>
            {discussions.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {discussions.map((discussion: any) => (
                    <div
                      key={discussion.slug}
                      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition relative"
                    >
                      <Link to={`/forum/${discussion.slug}`} className="block">
                        <MiniProfile
                          id={discussion.creator.id}
                          name={discussion.creator.full_name}
                          avatarUrl={discussion.creator.avatar_url}
                          title={discussion.creator.title}
                          school={discussion.creator.school}
                          created_at={discussion.created_at}
                          size="small"
                          showLink={false}
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
                {hasNextDiscussionsPage && (
                  <div className="mt-4 flex justify-center">
                    <Button className="bg-[var(--ole-green)] hover:bg-[var(--hover-green)]" onClick={fetchNextDiscussionsPage}>
                      Ladda fler diskussioner
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p>Inga diskussioner hittades.</p>
            )}
          </>
        )}
      </section>

      {/* Recent Resources */}
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
            {resources.length > 0 ? (
              <>
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
                {hasNextResourcesPage && (
                  <div className="mt-4 flex justify-center">
                    <Button className="bg-[var(--ole-green)] hover:bg-[var(--hover-green)]" onClick={fetchNextResourcesPage}>
                      Ladda fler resurser
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p>Inga resurser hittades.</p>
            )}
          </>
        )}
      </section>

      {/* Recent Accounts */}
      <section className="mb-8">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setOpenAccounts(!openAccounts)}
        >
          <h2 className="text-xl font-semibold mb-4">Senaste Konton</h2>
          {openAccounts ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
        {openAccounts && (
          <>
            {accounts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4">
                                  {accounts.map((account: any) => (
                                      <div
                                          key={account.id}
                                          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition relative"
                                      >
                                          <MiniProfile
                                              id={account.id}
                                              name={account.full_name}
                                              avatarUrl={account.avatar_url}
                                              created_at={account.last_seen}
                                              size="small"
                                          />
                                          <p className="text-sm text-gray-500 mt-2">{account.email}</p>
                                      </div>
                                  ))}

                </div>
                {hasNextAccountsPage && (
                  <div className="mt-4 flex justify-center">
                    <Button className="bg-[var(--ole-green)] hover:bg-[var(--hover-green)]" onClick={fetchNextAccountsPage}>
                      Ladda fler konton
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p>Inga konton hittades.</p>
            )}
          </>
        )}
      </section>

      {/* Recent Groups */}
      <section className="mb-8">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setOpenGroups(!openGroups)}
        >
          <h2 className="text-xl font-semibold mb-4">Senaste Grupper</h2>
          {openGroups ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
        {openGroups && (
          <>
            {adminGroups.length > 0 ? (
              <>
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
                {hasNextGroupsPage && (
                  <div className="mt-4 flex justify-center">
                    <Button onClick={fetchNextGroupsPage}>
                      Ladda fler grupper
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p>Inga grupper hittades.</p>
            )}
          </>
        )}
      </section>

      {/* Resource Details Dialog */}
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
    </>
  );
}
