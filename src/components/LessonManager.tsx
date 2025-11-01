import React, { useState } from 'react';
import { Lesson } from '../types';

interface LessonManagerProps {
  lessons: Lesson[];
  selectedPages: number[];
  onAddLesson: () => void;
  onExtract: () => void;
  onUpdateLessonName: (lessonIndex: number, newName: string) => void;
  onDeleteLesson: (lessonIndex: number) => void;
}

const LessonManager: React.FC<LessonManagerProps> = ({ lessons, selectedPages, onAddLesson, onExtract, onUpdateLessonName, onDeleteLesson }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const handleStartEditing = (index: number, name: string) => {
    setEditingIndex(index);
    setEditingName(name);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value);
  };

  const handleSaveName = (index: number) => {
    if (editingName.trim()) {
      onUpdateLessonName(index, editingName.trim());
    }
    setEditingIndex(null);
    setEditingName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      handleSaveName(index);
    } else if (e.key === 'Escape') {
      setEditingIndex(null);
      setEditingName('');
    }
  };

  return (
    <div className="sticky top-24 backdrop-blur-sm bg-white/80 p-6 rounded-lg shadow-lg flex flex-col h-fit">
      <h2 className="text-xl font-bold mb-4 border-b pb-2 text-slate-700">Manage Lessons</h2>
      
      <div className="mb-4">
          <h3 className="font-semibold text-slate-600">Currently Selected:</h3>
          <p className="text-sm text-slate-500 h-12 overflow-y-auto p-2 bg-slate-50 rounded-md border">
            {selectedPages.length > 0 ? `Pages: ${selectedPages.map(p => p + 1).join(', ')}` : 'Select pages from the left.'}
          </p>
      </div>

      <button
        onClick={onAddLesson}
        disabled={selectedPages.length === 0}
        className="w-full bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed mb-4 shadow-md hover:shadow-lg disabled:shadow-none"
      >
        Create Lesson ({selectedPages.length} pages)
      </button>

      <div className="flex-grow min-h-[150px]">
        <h3 className="font-semibold text-slate-600 mb-2">Created Lessons:</h3>
        {lessons.length === 0 ? (
          <p className="text-sm text-center text-slate-400 p-4 bg-slate-50 rounded-md border">No lessons created yet.</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {lessons.map((lesson, index) => (
              <li 
                key={index} 
                className="group flex items-center justify-between text-sm p-2 rounded-md transition-colors hover:bg-sky-50" 
                style={{ borderLeft: `5px solid ${lesson.color}`, backgroundColor: '#f8fafc' }}
              >
                <div className="flex items-center overflow-hidden">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={handleNameChange}
                      onBlur={() => handleSaveName(index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      autoFocus
                      className="text-sm p-1 border rounded-md w-full bg-white"
                    />
                  ) : (
                    <>
                      <span className="font-bold text-slate-700 truncate cursor-pointer" onClick={() => handleStartEditing(index, lesson.name)}>
                        {lesson.name}
                      </span>
                      <span className="mx-2 text-slate-400">:</span>
                      <span className="text-slate-500">{lesson.pages.length} page(s)</span>
                    </>
                  )}
                </div>
                <div className="flex items-center">
                  <button onClick={() => handleStartEditing(index, lesson.name)} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-blue-600 ml-2 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
                    </svg>
                  </button>
                   <button onClick={() => onDeleteLesson(index)} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-red-600 ml-1 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={onExtract}
        disabled={lessons.length === 0}
        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-sky-600 transition-all duration-300 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download {lessons.length} Lesson(s) as ZIP
      </button>
    </div>
  );
};

export default LessonManager;