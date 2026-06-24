//textExtractor.js
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

async function extractFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function extractFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageTexts = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(' ');
    pageTexts.push(pageText);
  }

  return pageTexts.join('\n\n');
}

async function extractFromTxt(file) {
  return file.text();
}

/**
 * Reads a File object (.docx, .pdf, or .txt) and resolves with its
 * plain-text contents. Throws a descriptive error for unsupported types.
 */
export async function extractText(file) {
  const name = file.name.toLowerCase();

  if (name.endsWith('.docx')) {
    return extractFromDocx(file);
  }
  if (name.endsWith('.pdf')) {
    return extractFromPdf(file);
  }
  if (name.endsWith('.txt')) {
    return extractFromTxt(file);
  }

  throw new Error(
    `Unsupported file type: "${file.name}". Please upload a .docx, .pdf, or .txt file.`
  );
}
