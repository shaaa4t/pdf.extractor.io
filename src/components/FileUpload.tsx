import React, { useCallback, useState } from 'react';
import { fetchPdfFromUrl, isValidUrl } from '../services/pdfFetcher';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  onUrlLoad?: (url: string) => void;
}

type TabType = 'upload' | 'url';

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, onUrlLoad }) => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (e.dataTransfer.files[0].type === "application/pdf") {
        onFileChange(e.dataTransfer.files[0]);
      } else {
        alert("Please upload a valid PDF file.");
      }
    }
  }, [onFileChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  const handleUrlLoad = async () => {
    setUrlError(null);

    // Validate URL
    if (!urlInput.trim()) {
      setUrlError('Please enter a URL');
      return;
    }

    if (!isValidUrl(urlInput.trim())) {
      setUrlError('Please enter a valid HTTP or HTTPS URL');
      return;
    }

    setIsLoadingUrl(true);
    setLoadProgress(0);

    try {
      const file = await fetchPdfFromUrl(urlInput.trim(), (progress) => {
        setLoadProgress(progress.percentage);
      });

      onFileChange(file);
      setUrlInput(''); // Clear input on success
      setLoadProgress(0);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load PDF from URL';
      setUrlError(errorMessage);
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const handleUrlKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoadingUrl) {
      handleUrlLoad();
    }
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-300 mb-6">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'upload'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Upload File
        </button>
        <button
          onClick={() => setActiveTab('url')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'url'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Load from URL
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'upload' ? (
        /* Upload Tab */
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-96 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-12 h-12 mb-4 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-lg text-slate-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-sm text-slate-500">PDF files only</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" accept="application/pdf" onChange={handleFileSelect} />
          </label>
        </div>
      ) : (
        /* URL Tab */
        <div className="flex flex-col items-center justify-center w-full h-96 border-2 border-slate-300 rounded-lg bg-slate-50 p-8">
          <div className="w-full max-w-2xl">
            <div className="mb-6 text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Load PDF from URL</h3>
              <p className="text-sm text-slate-500">Enter a direct link to a PDF file</p>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setUrlError(null);
                  }}
                  onKeyPress={handleUrlKeyPress}
                  placeholder="https://example.com/document.pdf"
                  disabled={isLoadingUrl}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              {urlError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{urlError}</p>
                </div>
              )}

              {isLoadingUrl && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Loading PDF...</span>
                    <span>{loadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${loadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <button
                onClick={handleUrlLoad}
                disabled={isLoadingUrl || !urlInput.trim()}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoadingUrl ? 'Loading...' : 'Load PDF'}
              </button>

              <p className="text-xs text-slate-500 text-center">
                Note: Some URLs may not work due to CORS restrictions. In that case, download the PDF and use the Upload tab.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
