// resourceOptions.ts
export const subjectOptionsForGrundskola = [
  { value: "Svenska", label: "Svenska" },
  { value: "Matematik", label: "Matematik" },
  { value: "Engelska", label: "Engelska" },
  { value: "Biologi", label: "Biologi" },
  { value: "Kemi", label: "Kemi" },
  { value: "Fysik", label: "Fysik" },
  { value: "Teknik", label: "Teknik" },
  { value: "Samhällskunskap", label: "Samhällskunskap" },
  { value: "Historia", label: "Historia" },
  { value: "Geografi", label: "Geografi" },
  { value: "Religionskunskap", label: "Religionskunskap" },
  { value: "Bild", label: "Bild" },
  { value: "Musik", label: "Musik" },
  { value: "Idrott och hälsa", label: "Idrott och hälsa" },
  { value: "Hem- och konsumentkunskap", label: "Hem- och konsumentkunskap" },
  { value: "Moderna språk", label: "Moderna språk" }
];


export const gradeOptionsGrundskola = [
  { value: "Årskurs 1", label: "Årskurs 1" },
  { value: "Årskurs 2", label: "Årskurs 2" },
  { value: "Årskurs 3", label: "Årskurs 3" },
  { value: "Årskurs 4", label: "Årskurs 4" },
  { value: "Årskurs 5", label: "Årskurs 5" },
  { value: "Årskurs 6", label: "Årskurs 6" },
  { value: "Årskurs 7", label: "Årskurs 7" },
  { value: "Årskurs 8", label: "Årskurs 8" },
  { value: "Årskurs 9", label: "Årskurs 9" },
];

export const courseSubjectOptionsForGymnasiet = [
  { value: "Matematik", label: "Matematik" },
  { value: "Engelska", label: "Engelska" },
  { value: "Svenska", label: "Svenska" },
  { value: "Svenska som andraspråk", label: "Svenska som andraspråk" },
  { value: "Filosofi", label: "Filosofi" },
  { value: "Historia", label: "Historia" },
  { value: "Samhällskunskap", label: "Samhällskunskap" },
  { value: "Religionskunskap", label: "Religionskunskap" },
  { value: "Psykologi", label: "Psykologi" },
  { value: "Juridik", label: "Juridik" },
  { value: "Ekonomi", label: "Ekonomi" },
  { value: "Företagsekonomi", label: "Företagsekonomi" },
  { value: "Entreprenörskap", label: "Entreprenörskap" },
  { value: "Marknadsföring", label: "Marknadsföring" },
  { value: "Biologi", label: "Biologi" },
  { value: "Kemi", label: "Kemi" },
  { value: "Fysik", label: "Fysik" },
  { value: "Naturkunskap", label: "Naturkunskap" },
  { value: "Teknik", label: "Teknik" },
  { value: "Programmering", label: "Programmering" },
  { value: "Webbutveckling", label: "Webbutveckling" },
  { value: "Dator- och nätverksteknik", label: "Dator- och nätverksteknik" },
  { value: "Estetisk kommunikation", label: "Estetisk kommunikation" },
  { value: "Bild och form", label: "Bild och form" },
  { value: "Musik", label: "Musik" },
  { value: "Dans", label: "Dans" },
  { value: "Idrott och hälsa", label: "Idrott och hälsa" },
  { value: "Pedagogik", label: "Pedagogik" },
  { value: "Moderna språk", label: "Moderna språk" },
  { value: "Ljudproduktion", label: "Ljudproduktion" },
  { value: "Film- och TV-produktion", label: "Film- och TV-produktion" },
  { value: "Medieproduktion", label: "Medieproduktion" },
  { value: "Konstruktion", label: "Konstruktion" },
];


export const courseLevelsMapping = {
  Matematik: [
    { value: "1a", label: "1a" },
    { value: "1b", label: "1b" },
    { value: "1c", label: "1c" },
    { value: "2a", label: "2a" },
    { value: "2b", label: "2b" },
    { value: "2c", label: "2c" },
    { value: "3b", label: "3b" },
    { value: "3c", label: "3c" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "specialisering", label: "specialisering" }
  ],
  Engelska: [
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" }
  ],
  Svenska: [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" }
  ],
  "Svenska som andraspråk": [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" }
  ],
  Filosofi: [
    { value: "1", label: "1" },
    { value: "2", label: "2" }
  ],
  Historia: [
    { value: "1a1", label: "1a1" },
    { value: "1a2", label: "1a2" },
    { value: "1b", label: "1b" },
    { value: "2a", label: "2a" },
    { value: "2b", label: "2b" }
  ],
  Samhällskunskap: [
    { value: "1a1", label: "1a1" },
    { value: "1a2", label: "1a2" },
    { value: "1b", label: "1b" },
    { value: "2", label: "2" },
    { value: "3", label: "3" }
  ],
  Religionskunskap: [
    { value: "1", label: "1" },
    { value: "2", label: "2" }
  ],
  Psykologi: [
    { value: "1", label: "1" },
    { value: "2a", label: "2a" },
    { value: "2b", label: "2b" }
  ],
  Biologi: [
    { value: "1", label: "1" },
    { value: "2", label: "2" }
  ],
  Kemi: [
    { value: "1", label: "1" },
    { value: "2", label: "2" }
  ],
  Fysik: [
    { value: "1a", label: "1a" },
    { value: "1b1", label: "1b1" },
    { value: "1b2", label: "1b2" },
    { value: "1", label: "1" },
    { value: "2", label: "2" }
  ],
  Naturkunskap: [
    { value: "1a1", label: "1a1" },
    { value: "1a2", label: "1a2" },
    { value: "1b", label: "1b" },
    { value: "2", label: "2" }
  ],
  Teknik: [
    { value: "1", label: "1" }
  ],
  Programmering: [
    { value: "1", label: "1" },
    { value: "2", label: "2" }
  ],
  Webbutveckling: [
    { value: "1", label: "1" },
    { value: "2", label: "2" }
  ],
  "Idrott och hälsa": [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "specialisering", label: "specialisering" }
  ],
  "Moderna språk": [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" }
  ],
  Ekonomi: [
    { value: "1", label: "1" },
    { value: "2", label: "2" }
  ],
};

export const resourceTypeOptions = [
  { value: "Uppgift", label: "Uppgift" },
  { value: "Prov", label: "Prov" },
  { value: "Anteckningar", label: "Anteckningar" },
  { value: "Lektionsplanering", label: "Lektionsplanering" },
  { value: "Quiz", label: "Quiz" },
  { value: "Genomgång", label: "Genomgång" },
];

export const gymnasietGrades = ["Gymnasiet 1", "Gymnasiet 2", "Gymnasiet 3"];
