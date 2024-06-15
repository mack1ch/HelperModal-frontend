"use client";

import styles from "./ui.module.scss";
import { useState } from "react";

import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
export const PDFViewerComponent = ({
  documentUrl,
  currentPage,
}: {
  documentUrl?: string;
  currentPage?: number;
}) => {
  const [isPDFOpen, setPDFOpen] = useState<boolean>(
    Boolean(documentUrl && currentPage)
  );
  return (
    <>
      {documentUrl && currentPage && (
        <>
          <button
            style={{ borderRadius: isPDFOpen ? undefined : "8px" }}
            onClick={() => setPDFOpen(!isPDFOpen)}
            className={styles.btn}
          >
            {isPDFOpen ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            Показать материалы
          </button>
          <div
            style={{ display: isPDFOpen ? "block" : "none" }}
            className={styles.renderPages}
          >
            <object
              data={documentUrl + `#page=${currentPage}`}
              width="100%"
              height="100%"
            >
              <iframe
                src={documentUrl + `#page=${currentPage}`}
                width="100%"
                height="500"
              >
                <p>Ваш браузер не поддерживает PDF</p>
              </iframe>
            </object>
          </div>
        </>
      )}
    </>
  );
};
