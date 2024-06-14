"use client";

import { Viewer, Worker } from "@react-pdf-viewer/core";

const PDFViewer = ({ documentUrl }: { documentUrl?: string }) => {
  return (
    <>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
        <div
          style={{
            border: "1px solid rgba(0, 0, 0, 0.3)",
            height: "750px",
          }}
        >
          <Viewer fileUrl={documentUrl || ""} />
        </div>
      </Worker>
    </>
  );
};

export default PDFViewer;
