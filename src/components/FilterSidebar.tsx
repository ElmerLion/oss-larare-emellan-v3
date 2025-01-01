import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function FilterSidebar() {
  return (
    <div className="w-64 bg-white p-6 border-r border-gray-200 ml-[255px]">
        <h1 className="text-2xl font-semibold pb-4">Resurser</h1>
      {/* Search Bar */}
      <div className="mb-6">
        <Search className="absolute left-[291px] bottom-[802px] -translate-y-1/2 text-gray-400 h-4 w-4" />
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
            Ordning
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white">
            <option>Senast uppladdade</option>
            <option>Mest nedladdade</option>
            <option>Högst rankade</option>
          </select>
        </div>

        {/* Alla typer */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Resurstyp
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white">
            <option>Alla typer</option>
            <option>Prov</option>
            <option>Anteckningar</option>
            <option>Lektionsplanering</option>
            <option>Quiz</option>
          </select>
        </div>

        {/* Alla ämnen */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Ämne
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white">
            <option>Alla ämnen</option>
            <option>Matematik</option>
            <option>Svenska</option>
            <option>Engelska</option>
            <option>Programmering</option>
            <option>Samhällskunskap</option>
            <option>Fysik</option>
          </select>
        </div>

        {/* Alla årskurser */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Årskurs
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white">
            <option>Alla årskurser</option>
            <option>Årskurs 1</option>
            <option>Årskurs 2</option>
            <option>Årskurs 3</option>
            <option>Årskurs 4</option>
            <option>Årskurs 5</option>
            <option>Årskurs 6</option>
            <option>Årskurs 7</option>
            <option>Årskurs 8</option>
            <option>Årskurs 9</option>
            <option>Gymnasiet 1</option>
            <option>Gymnasiet 2</option>
            <option>Gymnasiet 3</option>
          </select>
        </div>

        {/* Svårighetsgrader */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Svårighetsgrad
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white">
            <option>Alla Svårighetsgrader</option>
            <option>Lätt</option>
            <option>Medel</option>
            <option>Svår</option>
          </select>
        </div>
      </div>
    </div>
  );
}
