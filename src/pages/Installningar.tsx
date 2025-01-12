import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { DeleteAccountDialog } from "@/components/settings/DeleteAccountDialog";

export default function Installningar() {
  return (
    <div className="min-h-screen flex bg-[#F6F6F7]">
      <AppSidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="mt-16 min-h-[calc(100vh-4rem)] bg-[#F6F6F7]">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold mb-8">Inställningar</h1>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Farozon</h2>
                <p className="text-gray-600 mb-4">
                  Åtgärder i detta avsnitt kan inte ångras. Var försiktig.
                </p>
                <DeleteAccountDialog />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}