import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FilterSidebar() {
  return (
    <div className="w-64 bg-[#F6F6F7] p-6 border-r border-gray-200">
      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="Vad letar du efter?"
          className="bg-white pl-10 text-sm"
        />
      </div>

      {/* Filter Options */}
      <div className="space-y-4">
        {/* Senast uppladdade */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Senast uppladdade
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white">
            <option>Senast uppladdade</option>
            <option>Äldst uppladdade</option>
          </select>
        </div>

        {/* Alla typer */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Alla typer
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white">
            <option>Alla typer</option>
            <option>Prov</option>
            <option>Anteckningar</option>
          </select>
        </div>

        {/* Alla ämnen */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Alla ämnen
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white">
            <option>Alla ämnen</option>
            <option>Matematik</option>
            <option>Svenska</option>
            <option>Engelska</option>
          </select>
        </div>

        {/* Alla årskurser */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Alla årskurser
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white">
            <option>Alla årskurser</option>
            <option>Gymnasiet 1</option>
            <option>Gymnasiet 2</option>
            <option>Årskurs 9</option>
          </select>
        </div>

        {/* Svårighetsgrader */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Svårighetsgrader
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white">
            <option>Svårighetsgrader</option>
            <option>Lätt</option>
            <option>Medel</option>
            <option>Svår</option>
          </select>
        </div>
      </div>
    </div>
  );
}
