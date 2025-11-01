import React, { useState, useCallback } from 'react';
import { Lesson } from './types';
import { renderPdfThumbnails, extractAndZipPdfs } from './services/pdfService';
import FileUpload from './components/FileUpload';
import PdfPreview from './components/PdfPreview';
import LessonManager from './components/LessonManager';
import { Spinner } from './components/Spinner';

// Predefined colors for lessons for better visual distinction
const LESSON_COLORS = [
  '#34D399', // Emerald
  '#60A5FA', // Blue
  '#F87171', // Red
  '#FBBF24', // Amber
  '#A78BFA', // Violet
  '#2DD4BF', // Teal
  '#F472B6', // Pink
];

const App: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    setPdfFile(file);
    setThumbnails([]);
    setLessons([]);
    setSelectedPages([]);
    setError(null);
    setIsLoading(true);
    setLoadingMessage('Generating page previews...');

    try {
      const newThumbnails = await renderPdfThumbnails(file);
      setThumbnails(newThumbnails);
    } catch (err) {
      setError('Failed to process PDF. Please ensure it is a valid, uncorrupted file.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handlePageSelect = (pageIndex: number) => {
    // Prevent selection of pages already assigned to a lesson
    if (lessons.some(lesson => lesson.pages.includes(pageIndex))) {
      return;
    }
    setSelectedPages(prev =>
      prev.includes(pageIndex)
        ? prev.filter(p => p !== pageIndex)
        : [...prev, pageIndex].sort((a, b) => a - b)
    );
  };
  
  const handleAddLesson = () => {
    if (selectedPages.length === 0) return;

    let newLessonName = `Lesson ${lessons.length + 1}`;
    if (lessons.length > 0) {
      const lastLessonName = lessons[lessons.length - 1].name;
      const match = lastLessonName.match(/^(\d+)-(\d+)$/);
      if (match) {
        const grade = match[1];
        const lessonNumber = parseInt(match[2], 10);
        newLessonName = `${grade}-${lessonNumber + 1}`;
      }
    }

    const newLesson: Lesson = {
      name: newLessonName,
      pages: selectedPages,
      color: LESSON_COLORS[lessons.length % LESSON_COLORS.length],
    };
    setLessons(prev => [...prev, newLesson]);
    setSelectedPages([]);
  };

  const handleUpdateLessonName = (lessonIndex: number, newName: string) => {
    setLessons(prevLessons => {
      const updatedLessons = [...prevLessons];
      if (updatedLessons[lessonIndex]) {
        updatedLessons[lessonIndex].name = newName;
      }
      return updatedLessons;
    });
  };

  const handleDeleteLesson = (lessonIndex: number) => {
    setLessons(prevLessons => prevLessons.filter((_, index) => index !== lessonIndex));
  };

  const handleExtract = async () => {
    if (!pdfFile || lessons.length === 0) return;

    setIsLoading(true);
    setLoadingMessage('Extracting pages and creating ZIP file...');
    setError(null);
    
    try {
      await extractAndZipPdfs(pdfFile, lessons);
    } catch (err) {
        setError('An error occurred during extraction. Please try again.');
        console.error(err);
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  };
  
  const handleReset = () => {
    setPdfFile(null);
    setThumbnails([]);
    setLessons([]);
    setSelectedPages([]);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      <header className="bg-slate-800 shadow-xl p-4 sticky top-0 z-20 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">PDF Lesson Extractor</h1>
          {pdfFile && <button onClick={handleReset} className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-semibold">Reset</button>}
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-50">
            <Spinner />
            <p className="text-white text-lg mt-4">{loadingMessage}</p>
          </div>
        )}

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        {!pdfFile ? (
          <FileUpload onFileChange={handleFileChange} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-9">
              <PdfPreview 
                thumbnails={thumbnails}
                lessons={lessons}
                selectedPages={selectedPages}
                onPageSelect={handlePageSelect}
              />
            </div>
            <div className="lg:col-span-3">
               <LessonManager
                  lessons={lessons}
                  selectedPages={selectedPages}
                  onAddLesson={handleAddLesson}
                  onExtract={handleExtract}
                  onUpdateLessonName={handleUpdateLessonName}
                  onDeleteLesson={handleDeleteLesson}
               />
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-slate-800 p-4 text-center text-slate-300 text-sm mt-8">
        <p>&copy; 2024 PDF Lesson Extractor.</p>
        <p className="mt-1">تم إنشاؤه بواسطة Google AI Studio</p>
      </footer>
    </div>
  );
};

export default App;