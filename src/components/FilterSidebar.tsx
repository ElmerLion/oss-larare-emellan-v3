import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  subjectOptionsForGrundskola,
  gradeOptionsGrundskola,
  courseSubjectOptionsForGymnasiet,
  courseLevelsMapping,
  gymnasietGrades,
  resourceTypeOptions, // <-- Import the resource type options here as well
} from "@/types/resourceOptions";

export interface ResourceFilters {
  orderBy: 'created_at' | 'downloads' | 'rating';
  type: string;
  school: string;
  subject: string;       // For Grundskola: subject; for Gymnasiet: course subject
  grade: string;         // For Grundskola only
  courseLevel: string;   // For Gymnasiet only
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
}

interface FilterSidebarProps {
  onFilterChange: (filters: ResourceFilters) => void;
  onSearchChange: (search: string) => void;
}

export function FilterSidebar({ onFilterChange, onSearchChange }: FilterSidebarProps) {
  // Local state for selected values.
  const [currentSchool, setCurrentSchool] = useState("");
  const [currentGrade, setCurrentGrade] = useState("all");
  const [currentCourseSubject, setCurrentCourseSubject] = useState("all");
  const [currentCourseLevel, setCurrentCourseLevel] = useState("all");

  const handleFilterChange = (key: keyof ResourceFilters, value: string) => {
    onFilterChange((prevFilters: ResourceFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  return (
    // On mobile, take full width; on large screens use fixed width with sticky behavior.
    <div className="w-full lg:w-64 bg-white p-6 lg:border-r lg:border-l lg:border-gray-300 lg:min-h-screen lg:sticky lg:top-0 lg:-ml-6 lg:-mt-6">
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

      <div className="space-y-4">
        {/* Order */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Ordning</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
            onChange={(e) => handleFilterChange('orderBy', e.target.value)}
          >
            <option value="created_at">Senast uppladdade</option>
            <option value="downloads">Mest nedladdade</option>
            <option value="rating">Högst rankade</option>
          </select>
        </div>

        {/* Resource Type */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Resurstyp</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">Alla typer</option>
            {resourceTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Skolnivå Filter */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Skolnivå</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
            onChange={(e) => {
              const selectedSchool = e.target.value;
              setCurrentSchool(selectedSchool);
              // Reset dependent fields when school changes
              setCurrentGrade("all");
              setCurrentCourseSubject("all");
              setCurrentCourseLevel("all");
              handleFilterChange('school', selectedSchool);
              // Clear dependent filters
              handleFilterChange('grade', "all");
              handleFilterChange('courseLevel', "all");
              handleFilterChange('subject', "all");
            }}
          >
            <option value="">Välj skolnivå</option>
            <option value="Grundskola">Grundskola</option>
            <option value="Gymnasiet">Gymnasiet</option>
          </select>
        </div>

        {/* Conditional Filters */}
        {currentSchool === "Grundskola" && (
          <>
            {/* Årskurs Filter */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Årskurs</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                onChange={(e) => {
                  const selectedGrade = e.target.value;
                  setCurrentGrade(selectedGrade);
                  handleFilterChange('grade', selectedGrade);
                }}
              >
                <option value="all">Alla årskurser</option>
                {gradeOptionsGrundskola.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Ämne Filter */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Ämne</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                onChange={(e) => handleFilterChange('subject', e.target.value)}
              >
                <option value="all">Alla ämnen</option>
                {subjectOptionsForGrundskola.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {currentSchool === "Gymnasiet" && (
          <>
            {/* Kursämne Filter */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Kursämne</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                onChange={(e) => {
                  const selectedCourseSubject = e.target.value;
                  setCurrentCourseSubject(selectedCourseSubject);
                  handleFilterChange('subject', selectedCourseSubject);
                }}
              >
                <option value="all">Alla kursämnen</option>
                {courseSubjectOptionsForGymnasiet.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Kursnivå Filter (conditional) */}
            {currentCourseSubject !== "all" &&
              courseLevelsMapping[currentCourseSubject] &&
              courseLevelsMapping[currentCourseSubject].length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Kursnivå</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                    onChange={(e) => {
                      const selectedCourseLevel = e.target.value;
                      setCurrentCourseLevel(selectedCourseLevel);
                      handleFilterChange('courseLevel', selectedCourseLevel);
                    }}
                  >
                    <option value="all">Alla nivåer</option>
                    {courseLevelsMapping[currentCourseSubject].map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
          </>
        )}

        {/* Difficulty Filter */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Svårighetsgrad</label>
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
