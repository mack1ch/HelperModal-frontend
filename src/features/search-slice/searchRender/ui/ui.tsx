"use client";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import styles from "./ui.module.scss";
import { useEffect, useRef } from "react";

import { Document, Page } from "react-pdf";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
export const PDFViewerComponent = ({
  documentUrl,
  currentPage,
}: {
  documentUrl?: string;
  currentPage?: number;
}) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const zoomPluginInstance = zoomPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();

  const viewerRef = useRef<any>(null);

  useEffect(() => {
    if (viewerRef.current && currentPage) {
      viewerRef.current.pageViewer.current.page = 9 - 1;
    }
  }, [currentPage]);
  return (
    <>
      {documentUrl && currentPage && (
        <div className={styles.renderPages}>
          <object
            data={documentUrl + `#page=${currentPage}`}
            width="500"
            height="678"
          >
            <iframe
              src={documentUrl + `#page=${currentPage}`}
              width="500"
              height="678"
            >
              <p>This browser does not support PDF!</p>
            </iframe>
          </object>
        </div>
      )}
    </>
  );
};
