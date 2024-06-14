"use client";

import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import styles from "./ui.module.scss";
import "../config";

export const PDFViewer = ({
  documentUrl,
  currentPage,
}: {
  documentUrl?: string;
  currentPage?: number;
}) => {
  return (
    <>
      {documentUrl && (
        <Document file={documentUrl}>
          <div className={styles.renderPages}>
            <Page
              pageNumber={currentPage}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </div>
        </Document>
      )}
    </>
  );
};
