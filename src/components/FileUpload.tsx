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
  const [useProxy, setUseProxy] = useState(false);
  const [showProxySuggestion, setShowProxySuggestion] = useState(false);

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
    setShowProxySuggestion(false);

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
      const file = await fetchPdfFromUrl(urlInput.trim(), {
        onProgress: (progress) => {
          setLoadProgress(progress.percentage);
        },
        useProxy,
      });

      onFileChange(file);
      setUrlInput(''); // Clear input on success
      setLoadProgress(0);
      setShowProxySuggestion(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load PDF from URL';

      // Check if it's a CORS error
      if (errorMessage === 'CORS_ERROR') {
        setUrlError('Unable to load PDF due to CORS restrictions.');
        setShowProxySuggestion(true);
      } else {
        setUrlError(errorMessage);
        setShowProxySuggestion(false);
      }
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
                    setShowProxySuggestion(false);
                  }}
                  onKeyPress={handleUrlKeyPress}
                  placeholder="https://example.com/document.pdf"
                  disabled={isLoadingUrl}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Proxy Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="use-proxy"
                  checked={useProxy}
                  onChange={(e) => setUseProxy(e.target.checked)}
                  disabled={isLoadingUrl}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                />
                <label htmlFor="use-proxy" className="text-sm text-slate-600 cursor-pointer">
                  Use CORS proxy (slower but bypasses restrictions)
                </label>
              </div>

              {urlError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{urlError}</p>
                </div>
              )}

              {/* CORS Suggestion */}
              {showProxySuggestion && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800 mb-2">Try using the CORS proxy</p>
                      <p className="text-xs text-blue-700 mb-3">
                        Enable the "Use CORS proxy" option above and try again. This routes the request through a proxy server to bypass CORS restrictions.
                      </p>
                      <button
                        onClick={() => {
                          setUseProxy(true);
                          setShowProxySuggestion(false);
                        }}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
                      >
                        Enable proxy and retry
                      </button>
                    </div>
                  </div>
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
                {isLoadingUrl ? (useProxy ? 'Loading via proxy...' : 'Loading...') : 'Load PDF'}
              </button>

              <div className="text-xs text-slate-500 space-y-1">
                <p className="text-center">
                  <strong>Tip:</strong> If direct loading fails, try enabling the CORS proxy option.
                </p>
                {useProxy && (
                  <p className="text-center text-slate-600 bg-slate-100 p-2 rounded">
                    ⚠️ Proxy mode: Your PDF URL will be routed through a third-party service. Avoid using this for sensitive documents.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
