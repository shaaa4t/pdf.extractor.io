import React from 'react';
import { Lesson } from '../types';

interface PdfPreviewProps {
  thumbnails: string[];
  lessons: Lesson[];
  selectedPages: number[];
  onPageSelect: (pageIndex: number) => void;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({ thumbnails, lessons, selectedPages, onPageSelect }) => {

  const getPageStatusStyle = (index: number): string => {
    const lesson = lessons.find(l => l.pages.includes(index));
    if (lesson) {
      return `border-4 cursor-not-allowed opacity-70`;
    }
    if (selectedPages.includes(index)) {
      return 'border-4 border-blue-500 ring-2 ring-blue-300';
    }
    return 'border-2 border-transparent hover:border-blue-400';
  };
  
  const getPageStatusColor = (index: number): React.CSSProperties => {
    const lesson = lessons.find(l => l.pages.includes(index));
    if (lesson) {
      return { borderColor: lesson.color };
    }
    return {};
  }

  return (
    <div className="backdrop-blur-sm bg-white/80 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-slate-700">Select Pages to Create Lessons</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {thumbnails.map((src, index) => (
          <div
            key={index}
            className={`relative rounded-md overflow-hidden shadow-sm transition-all duration-200 transform hover:scale-105 ${getPageStatusStyle(index)}`}
            style={getPageStatusColor(index)}
            onClick={() => onPageSelect(index)}
          >
            <img src={src} alt={`Page ${index + 1}`} className="w-full h-auto block" />
            <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs font-bold px-2 py-1 rounded">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PdfPreview;