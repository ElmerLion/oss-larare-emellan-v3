import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { InviteDialog } from "@/components/profile/InviteDialog";

interface MiniProfileProps {
  id: string;
  name: string;
  avatarUrl: string;
  title?: string;
  school?: string;
  created_at?: string;
  size?: "small" | "medium" | "large";
  showLink?: boolean;
}

function formatTimeAgo(created_at: string): string {
  const date = new Date(created_at);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "nyss";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return diffInMinutes === 1 ? "1 minut sen" : `${diffInMinutes} minuter sen`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return diffInHours === 1 ? "1 timme sen" : `${diffInHours} timmar sen`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7)
    return diffInDays === 1 ? "1 dag sen" : `${diffInDays} dagar sen`;
  if (diffInDays < 30) {
    const diffInWeeks = Math.floor(diffInDays / 7);
    return diffInWeeks === 1 ? "1 vecka sen" : `${diffInWeeks} veckor sen`;
  }
  if (diffInDays < 365) {
    const diffInMonths = Math.floor(diffInDays / 30);
    return diffInMonths === 1 ? "1 månad sen" : `${diffInMonths} månader sen`;
  }
  const diffInYears = Math.floor(diffInDays / 365);
  return diffInYears === 1 ? "1 år sen" : `${diffInYears} år sen`;
}

export const MiniProfile = ({
  id,
  name,
  avatarUrl,
  title,
  school,
  created_at,
  size = "medium",
  showLink = true,
}: MiniProfileProps) => {
  const responsiveAvatarClass = {
    small: "w-6 h-6 sm:w-8 sm:h-8",
    medium: "w-8 h-8 sm:w-10 sm:h-10",
    large: "w-12 h-12 sm:w-16 sm:h-16",
  }[size];

  const responsivePaddingClass = {
    small: "pl-1 sm:pl-2",
    medium: "pl-2 sm:pl-3",
    large: "pl-3 sm:pl-4",
  }[size];

  const combinedTitleSchool =
    title && school ? `${title} på ${school}` : title || school || "";

  // State for context menu position.
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  // State for showing the invite dialog.
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  // Local state to hold the current user's ID.
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Ref for the context menu element.
  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  const handleClickOutside = () => {
    if (contextMenuPos) setContextMenuPos(null);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenuPos]);

  // Close the context menu if the mouse moves too far away.
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (contextMenuRef.current) {
        const rect = contextMenuRef.current.getBoundingClientRect();
        const buffer = 50; // Allow a 50px margin around the menu
        if (
          e.clientX < rect.left - buffer ||
          e.clientX > rect.right + buffer ||
          e.clientY < rect.top - buffer ||
          e.clientY > rect.bottom + buffer
        ) {
          setContextMenuPos(null);
        }
      }
    };

    if (contextMenuPos) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [contextMenuPos]);

  // Fetch current user ID.
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  const content = (
    <div className="flex items-center" onContextMenu={handleContextMenu}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img
          src={avatarUrl || "/placeholder.svg"}
          alt={name || "Unnamed User"}
          className={`${responsiveAvatarClass} rounded-full object-cover`}
        />
      </div>
      {/* Profile Information */}
      <div className={`flex flex-col ${responsivePaddingClass}`}>
        <div className="font-medium text-xs sm:text-sm">{name || "Unnamed User"}</div>
        {combinedTitleSchool && (
          <div className="text-[10px] sm:text-xs text-gray-500">{combinedTitleSchool}</div>
        )}
        {created_at && (
          <div className="text-[10px] sm:text-xs text-gray-400">
            {formatTimeAgo(created_at)}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {showLink ? (
        <Link to={`/profil/${id}`} className="block">
          {content}
        </Link>
      ) : (
        content
      )}

      {contextMenuPos &&
        createPortal(
          <div
            ref={contextMenuRef}
            className="bg-white border rounded shadow-md z-50"
            style={{
              position: "fixed",
              top: contextMenuPos.y + 5, // slight offset to appear beside the mouse
              left: contextMenuPos.x + 5,
            }}
          >
            <button
              className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
              onClick={() => {
                window.location.href = `/profil/${id}`;
                setContextMenuPos(null);
              }}
            >
              Öppna profil
            </button>
            <button
              className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
              onClick={() => {
                setShowInviteDialog(true);
                setContextMenuPos(null);
              }}
            >
              Bjud in till grupp
            </button>
          </div>,
          document.body
        )}

      {showInviteDialog && currentUserId && (
        <InviteDialog
          open={showInviteDialog}
          onOpenChange={setShowInviteDialog}
          inviteeId={id}
          currentUserId={currentUserId}
        />
      )}
    </>
  );
};

export default MiniProfile;
