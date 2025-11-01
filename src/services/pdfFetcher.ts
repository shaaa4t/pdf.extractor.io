/**
 * Service for fetching PDF files from URLs
 */

// CORS proxy services (public proxies - use with caution for sensitive data)
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
];

export interface FetchProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FetchOptions {
  onProgress?: (progress: FetchProgress) => void;
  useProxy?: boolean;
  proxyIndex?: number;
}

/**
 * Fetches a PDF from a URL and converts it to a File object
 * @param url - The URL of the PDF to fetch
 * @param options - Fetch options including progress callback and proxy settings
 * @returns Promise<File> - The fetched PDF as a File object
 */
export const fetchPdfFromUrl = async (
  url: string,
  options: FetchOptions = {}
): Promise<File> => {
  const { onProgress, useProxy = false, proxyIndex = 0 } = options;
  // Validate URL format
  try {
    new URL(url);
  } catch (error) {
    throw new Error('Invalid URL format. Please enter a valid URL.');
  }

  try {
    // Construct the fetch URL (with or without proxy)
    const fetchUrl = useProxy
      ? `${CORS_PROXIES[proxyIndex]}${encodeURIComponent(url)}`
      : url;

    const response = await fetch(fetchUrl);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('PDF not found. Please check the URL and try again.');
      } else if (response.status === 403) {
        throw new Error('Access denied. The PDF may require authentication.');
      } else {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }
    }

    // Check if the response is actually a PDF
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('application/pdf')) {
      throw new Error('The URL does not point to a PDF file. Please check the URL.');
    }

    // Get total size for progress calculation
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    // Read the response with progress tracking
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Unable to read response from URL.');
    }

    const chunks: Uint8Array[] = [];
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      loaded += value.length;

      // Report progress
      if (onProgress && total > 0) {
        onProgress({
          loaded,
          total,
          percentage: Math.round((loaded / total) * 100),
        });
      }
    }

    // Combine chunks into a single Uint8Array
    const allChunks = new Uint8Array(loaded);
    let position = 0;
    for (const chunk of chunks) {
      allChunks.set(chunk, position);
      position += chunk.length;
    }

    // Create a Blob from the data
    const blob = new Blob([allChunks], { type: 'application/pdf' });

    // Extract filename from URL
    const filename = extractFilenameFromUrl(url);

    // Convert Blob to File
    const file = new File([blob], filename, { type: 'application/pdf' });

    return file;
  } catch (error) {
    // Handle network errors (likely CORS)
    if (error instanceof TypeError) {
      if (useProxy) {
        throw new Error(
          'Failed to fetch PDF even with proxy. Try downloading the PDF and uploading it directly.'
        );
      } else {
        throw new Error(
          'CORS_ERROR' // Special error code to trigger proxy suggestion in UI
        );
      }
    }

    // Re-throw our custom errors
    if (error instanceof Error) {
      throw error;
    }

    // Generic error
    throw new Error('Failed to load PDF from URL. Please try again.');
  }
};

/**
 * Extracts a filename from a URL
 * @param url - The URL to extract filename from
 * @returns A filename string
 */
const extractFilenameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const segments = pathname.split('/');
    const lastSegment = segments[segments.length - 1];

    // If the last segment looks like a filename, use it
    if (lastSegment && lastSegment.includes('.')) {
      return lastSegment;
    }

    // Otherwise, generate a generic filename
    return 'document.pdf';
  } catch {
    return 'document.pdf';
  }
};

/**
 * Validates if a string is a valid URL
 * @param urlString - The string to validate
 * @returns boolean - True if valid URL
 */
export const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};
