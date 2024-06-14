"use client";

import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import styles from "./ui.module.scss";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export const PDFViewer = ({
  documentUrl,
  currentPage,
}: {
  documentUrl?: string;
  currentPage?: number;
}) => {
  return (
    <>
      <Document file={documentUrl}>
        <div className={styles.renderPages}>
          <Page
            pageNumber={currentPage}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </div>
      </Document>
    </>
  );
};
