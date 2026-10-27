import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { assetUrl } from "../../../utils/assetUrl";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const CV_URL = assetUrl("/files/resumee.pdf");

// Page height that fits the viewport under the action bar.
const fitHeight = () => Math.min(Math.round(window.innerHeight * 0.78), 1000);

// The CV picked up off the desk: the real PDF page, centred in front of the
// visitor like a sheet of paper, with Open / Download above it. Back puts it
// down on the desk again (Esc leaves the desk). ← → (or the arrows) turn
// pages when there's more than one.
const CvCard = ({ onClose }) => {
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [failed, setFailed] = useState(false);
  const [height, setHeight] = useState(fitHeight);

  useEffect(() => {
    const onResize = () => setHeight(fitHeight());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setPage((p) => Math.min(p + 1, pages));
      if (e.key === "ArrowLeft") setPage((p) => Math.max(p - 1, 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pages]);

  return (
    <div className="cv-card-wrap">
      <div className="cv-card-bar">
        <button type="button" onClick={onClose}>
          <ArrowLeft size={14} /> Back
        </button>
        <a href={CV_URL} target="_blank" rel="noreferrer">
          <ExternalLink size={14} /> Open
        </a>
        <a href={CV_URL} download className="primary">
          <Download size={14} /> Download
        </a>
      </div>

      <div className="cv-card" style={{ minHeight: height }}>
        {failed ? (
          <p className="cv-card-note">Preview unavailable. Use Open or Download above.</p>
        ) : (
          <Document
            file={CV_URL}
            onLoadSuccess={({ numPages }) => setPages(numPages)}
            onLoadError={() => setFailed(true)}
            loading={<p className="cv-card-note">Loading…</p>}
          >
            <Page pageNumber={page} height={height} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>
        )}
      </div>

      {pages > 1 && (
        <div className="cv-card-pages">
          <button type="button" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} aria-label="Previous page">
            <ChevronLeft size={16} />
          </button>
          <span>
            {page} / {pages}
          </span>
          <button type="button" onClick={() => setPage((p) => Math.min(p + 1, pages))} disabled={page === pages} aria-label="Next page">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CvCard;
