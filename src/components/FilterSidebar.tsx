import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FilterSidebarProps {
  onFilterChange: (filters: ResourceFilters) => void;
  onSearchChange: (search: string) => void;
}

export interface ResourceFilters {
  orderBy: 'created_at' | 'downloads' | 'rating';
  type: string;
  subject: string;
  grade: string;
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
}

export function FilterSidebar({ onFilterChange, onSearchChange }: FilterSidebarProps) {
  const handleFilterChange = (key: keyof ResourceFilters, value: string) => {
    onFilterChange({
      orderBy: key === 'orderBy' ? value as 'created_at' | 'downloads' | 'rating' : 'created_at',
      type: key === 'type' ? value : 'all',
      subject: key === 'subject' ? value : 'all',
      grade: key === 'grade' ? value : 'all',
      difficulty: key === 'difficulty' ? value as 'all' | 'easy' | 'medium' | 'hard' : 'all',
    });
  };

  return (
    <div className="w-64 bg-white p-6 border-r border-gray-200 ml-[255px]">
      <h1 className="text-2xl font-semibold pb-4">Resurser</h1>
      
      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Vad letar du efter?"
          className="bg-white pl-10 text-sm"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Options */}
      <div className="space-y-4">
        {/* Senast uppladdade */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Ordning
          </label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
            onChange={(e) => handleFilterChange('orderBy', e.target.value)}
          >
            <option value="created_at">Senast uppladdade</option>
            <option value="downloads">Mest nedladdade</option>
            <option value="rating">Högst rankade</option>
          </select>
        </div>

        {/* Alla typer */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Resurstyp
          </label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">Alla typer</option>
            <option value="prov">Prov</option>
            <option value="anteckningar">Anteckningar</option>
            <option value="lektionsplanering">Lektionsplanering</option>
            <option value="quiz">Quiz</option>
          </select>
        </div>

        {/* Alla ämnen */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Ämne
          </label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
            onChange={(e) => handleFilterChange('subject', e.target.value)}
          >
            <option value="all">Alla ämnen</option>
            <option value="matematik">Matematik</option>
            <option value="svenska">Svenska</option>
            <option value="engelska">Engelska</option>
            <option value="programmering">Programmering</option>
            <option value="samhällskunskap">Samhällskunskap</option>
            <option value="fysik">Fysik</option>
          </select>
        </div>

        {/* Alla årskurser */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Årskurs
          </label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
            onChange={(e) => handleFilterChange('grade', e.target.value)}
          >
            <option value="all">Alla årskurser</option>
            <option value="1">Årskurs 1</option>
            <option value="2">Årskurs 2</option>
            <option value="3">Årskurs 3</option>
            <option value="4">Årskurs 4</option>
            <option value="5">Årskurs 5</option>
            <option value="6">Årskurs 6</option>
            <option value="7">Årskurs 7</option>
            <option value="8">Årskurs 8</option>
            <option value="9">Årskurs 9</option>
            <option value="gy1">Gymnasiet 1</option>
            <option value="gy2">Gymnasiet 2</option>
            <option value="gy3">Gymnasiet 3</option>
          </select>
        </div>

        {/* Svårighetsgrader */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Svårighetsgrad
          </label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          >
            <option value="all">Alla Svårighetsgrader</option>
            <option value="easy">Lätt</option>
            <option value="medium">Medel</option>
            <option value="hard">Svår</option>
          </select>
        </div>
      </div>
    </div>
  );
}