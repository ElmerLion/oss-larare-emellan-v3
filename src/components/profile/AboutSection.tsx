interface AboutSectionProps {
  purpose: string;
  motivation: string;
  contribution: string;
}

export function AboutSection({ purpose, motivation, contribution }: AboutSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Om Mig</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Jag är här för att</h3>
          <p className="text-gray-800">{purpose}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Jag jobbar som lärare för att</h3>
          <p className="text-gray-800">{motivation}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">På Oss Lärare Emellan bidrar jag med</h3>
          <p className="text-gray-800">{contribution}</p>
        </div>
      </div>
    </div>
  );
}