"use client";

import { IMessage } from "@/shared/interface/message";
import styles from "./ui.module.scss";
import { useState } from "react";
import { formatTimeToHHMMFormat } from "@/shared/lib/parce/time";

export const Message = ({ message }: { message?: IMessage }) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const isNotMessageMine: boolean =
    message?.role == "AI" || message?.role == "operator";
  return (
    <>
      <div className={styles.messageWrap}>
        <div
          id={message?.id}
          style={{
            flexDirection: !isNotMessageMine ? undefined : "row-reverse",
            marginLeft: !isNotMessageMine ? "auto" : "0",
            marginRight: !isNotMessageMine ? "0" : "auto",
          }}
          className={styles.message}
        >
          <span style={{ opacity: isHover ? 1 : 0 }} className={styles.date}>
            {formatTimeToHHMMFormat(message?.createdAt || new Date())}
          </span>
          <p
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            style={{
              backgroundColor: !isNotMessageMine ? undefined : "#eee",
              color: !isNotMessageMine ? undefined : "#222",
            }}
            className={styles.messageText}
          >
            {/* {formatText(message?.text.split("\n") || [])} */}
            {message?.text}
          </p>
        </div>
      </div>
    </>
  );
};
