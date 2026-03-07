import { Download } from "lucide-react";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import WindowControlls from "../components/WindowControlls";
import WindowWrapper from "../hoc/WindowWrapper";
import useWindowStore from "../store/window";
import { assetUrl } from "../utils/assetUrl";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const Resume = () => {
  const [numPages, setNumPages] = useState(0);
  const resumeData = useWindowStore((state) => state.windows.resume.data);

  const pdfFile = resumeData?.file || assetUrl("/files/resumee.pdf");
  const pdfTitle = resumeData?.title || "Resume.pdf";

  const handleLoadSuccess = ({ numPages: loadedPages }) => {
    setNumPages(loadedPages);
  };

  return (
    <>
      <div id="window-header">
        <WindowControlls target="resume" />
        <h2>{pdfTitle}</h2>

        <a
          href={pdfFile}
          download
          className="cursor-pointer"
          title={`Download ${pdfTitle}`}
        >
          <Download className="icon" />
        </a>
      </div>

      <div className="resume-scroll">
        <Document file={pdfFile} onLoadSuccess={handleLoadSuccess}>
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`resume-page-${index + 1}`}
              pageNumber={index + 1}
              renderTextLayer
              renderAnnotationLayer
            />
          ))}
        </Document>
      </div>
    </>
  );
};

const ResumeWindow = WindowWrapper(Resume, "resume");

export default ResumeWindow;
