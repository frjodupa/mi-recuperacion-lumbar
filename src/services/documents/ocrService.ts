export async function extractDocumentText(file: File, onProgress?: (progress: number) => void) {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    return extractTextFromPdf(file, onProgress);
  }
  return extractTextFromImage(file, onProgress);
}

async function extractTextFromImage(file: File, onProgress?: (progress: number) => void) {
  const imageFile = await normalizeHeic(file);
  const Tesseract = await import('tesseract.js');
  const result = await Tesseract.recognize(imageFile, 'spa+eng', {
    logger: (message: { status?: string; progress?: number }) => {
      if (message.status === 'recognizing text' && typeof message.progress === 'number' && onProgress) {
        onProgress(Math.max(5, Math.min(95, Math.round(message.progress * 100))));
      }
    },
  });
  return result.data.text?.trim() || '';
}

async function extractTextFromPdf(file: File, onProgress?: (progress: number) => void) {
  const pdfjs = await import('pdfjs-dist');
  (pdfjs as unknown as { GlobalWorkerOptions: { workerSrc: string } }).GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = (pdfjs as unknown as { getDocument: (data: { data: ArrayBuffer }) => { promise: Promise<{ numPages: number; getPage: (pageNum: number) => Promise<{ getTextContent: () => Promise<{ items: Array<{ str?: string }> }> }> }> } }).getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const chunks: string[] = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str || '').join(' ').trim();
    if (pageText) chunks.push(pageText);
    if (onProgress) {
      onProgress(Math.max(5, Math.min(95, Math.round((pageNum / pdf.numPages) * 100))));
    }
  }

  return chunks.join('\n\n').trim();
}

async function normalizeHeic(file: File) {
  const isHeic = file.type.includes('heic') || file.type.includes('heif') || /\.hei[cf]$/i.test(file.name);
  if (!isHeic) return file;

  const heic2anyModule = await import('heic2any');
  const converted = await heic2anyModule.default({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.92,
  });
  const blob = Array.isArray(converted) ? converted[0] : converted;
  return new File([blob], file.name.replace(/\.hei[cf]$/i, '.jpg'), { type: 'image/jpeg' });
}
