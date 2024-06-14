"use client";

import React, { useEffect, useRef, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFViewerProps {
  pdfUrl: string;
  searchText: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, searchText }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageTextContent, setPageTextContent] = useState<string[]>([]);
  const viewerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const getPageText = async (page: any) => {
    const textContent = await page.getTextContent();
    return textContent.items.map((item: any) => item.str).join(" ");
  };

  const findTextInPDF = async (pdf: any) => {
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const text = await getPageText(page);
      setPageTextContent((prev) => [...prev, text]);

      if (text.includes(searchText)) {
        setPageNumber(i);
        viewerRef.current?.scrollTo(0, 0); // Прокрутка в начало страницы
        break;
      }
    }
  };

  useEffect(() => {
    (async () => {
      const loadingTask = pdfjs.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      await findTextInPDF(pdf);
    })();
  }, [pdfUrl, searchText]);

  return (
    <div ref={viewerRef}>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
    </div>
  );
};

export default PDFViewer;
