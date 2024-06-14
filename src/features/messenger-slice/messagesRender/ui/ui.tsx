"use client";

import { PageLayout } from "@/shared/layouts/pageLayout";
import styles from "./ui.module.scss";
import { IIssue } from "@/shared/interface/issue";
import { Message } from "@/entities/messanger-slice/message";
import { formatDateToDayMonthYearFormat } from "@/shared/lib/parce/date";
import { PDFViewer } from "@/features/search-slice/searchRender/ui/ui";

export const MessagesRender = ({ issues }: { issues?: IIssue[] }) => {
  return (
    <>
      <PageLayout>
        <div className={styles.messengerWrap}>
          {issues?.map((issue) => {
            const { day, month, year } = formatDateToDayMonthYearFormat(
              issue.createdAt
            );
            return (
              <>
                <span className={styles.date}>
                  {day} {month} {year} г.
                </span>
                <div className={styles.render}>
                  {issue.messages.map((message) => (
                    <>
                      <Message key={message.id} message={message} />
                      <PDFViewer
                        currentPage={message.page}
                        documentUrl={message.fileLink}
                      />
                    </>
                  ))}
                </div>
                {issue.isClosed && (
                  <span className={styles.date}>Обращение закрыто</span>
                )}
              </>
            );
          })}
        </div>
      </PageLayout>
    </>
  );
};
