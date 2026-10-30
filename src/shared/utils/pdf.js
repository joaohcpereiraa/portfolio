import { pdfjs } from "react-pdf";

// Points pdf.js at its worker once, for every PDF on the site (the CV on the
// desk, the CV card, the desktop's Resume window). Import this before
// rendering a PDF.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export { pdfjs };
