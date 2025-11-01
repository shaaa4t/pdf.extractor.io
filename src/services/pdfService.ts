import { Lesson } from '../types';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.js?url';

// Set the workerSrc for pdfjs-dist. This is crucial for it to work with bundlers like Vite.
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;


const THUMBNAIL_SCALE = 0.4;

export const renderPdfThumbnails = async (file: File): Promise<string[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const thumbnails: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: THUMBNAIL_SCALE });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (context) {
      // FIX: Added the 'canvas' property to the renderContext object, as it is required by the RenderParameters type for the page.render() method.
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        canvas: canvas,
      };
      await page.render(renderContext).promise;
      thumbnails.push(canvas.toDataURL());
    }
  }
  return thumbnails;
};

export const extractAndZipPdfs = async (originalPdfFile: File, lessons: Lesson[]): Promise<void> => {
    const arrayBuffer = await originalPdfFile.arrayBuffer();
    const originalPdfDoc = await PDFDocument.load(arrayBuffer);
    const zip = new JSZip();

    for (const lesson of lessons) {
        const newPdfDoc = await PDFDocument.create();
        const pageIndicesToCopy = lesson.pages;
        const copiedPages = await newPdfDoc.copyPages(originalPdfDoc, pageIndicesToCopy);
        
        copiedPages.forEach(page => {
            newPdfDoc.addPage(page);
        });
        
        const pdfBytes = await newPdfDoc.save();
        zip.file(`${lesson.name}.pdf`, pdfBytes);
    }
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `${originalPdfFile.name.replace('.pdf', '')}_lessons.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};