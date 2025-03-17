// Search.tsx
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { ProfileCard } from "@/components/ProfileCard";
import LatestDiscussions from "@/components/LatestDiscussions";
import ResourceTabContent from "@/components/search/ResourceTabContent";
import ContactsTabContent from "@/components/search/ContactsTabContent";
import DiscussionTabContent from "@/components/search/DiscussionTabContent";
import GroupsTabContent from "@/components/search/GroupsTabContent";

export default function Search() {
  const [activeTab, setActiveTab] = useState("Resurser");
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const renderTabContent = () => {
    switch (activeTab) {
      case "Resurser":
        return <ResourceTabContent initialSearchQuery={query} />;
      case "Kontakter":
        return <ContactsTabContent searchQuery={query} />;
      case "Diskussioner":
        return <DiscussionTabContent searchQuery={query} />;
      case "Grupper":
        return <GroupsTabContent searchQuery={query} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />
      {/* On extra-large screens, add left padding for the sidebar */}
      <main className="pl-0 lg:pl-64 pt-8 mt-8">
        <Header />
        <div className="max-w-[1500px] mx-auto px-4 xl:px-6 py-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <h1 className="text-3xl font-bold mb-4">Sökresultat för "{query}"</h1>
            <div className="mb-4 flex flex-wrap gap-4 border-b pb-2">
              {["Resurser", "Kontakter", "Samtal"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 ${
                    activeTab === tab
                      ? "border-b-2 border-[var(--ole-green)] text-[var(--ole-green)]"
                      : "text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div>{renderTabContent()}</div>
          </div>
          <div className="hidden xl:block space-y-6">
            <ProfileCard />
            <LatestDiscussions />
          </div>
        </div>
      </main>
    </div>
  );
}
