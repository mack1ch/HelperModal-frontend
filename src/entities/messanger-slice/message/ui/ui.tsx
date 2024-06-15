"use client";

import { IMessage } from "@/shared/interface/message";
import styles from "./ui.module.scss";
import { useCookies } from "react-cookie";
import { useState } from "react";
import { formatTimeToHHMMFormat } from "@/shared/lib/parce/time";
import { formatText } from "../model";

export const Message = ({ message }: { message?: IMessage }) => {
  const [cookies] = useCookies(["user-id"]);
  const [isHover, setIsHover] = useState<boolean>(false);
  const isMessageMine: boolean = message?.authorId === cookies["user-id"];
  return (
    <>
      <div className={styles.messageWrap}>
        <div
          id={message?.id}
          style={{
            flexDirection: isMessageMine ? undefined : "row-reverse",
            marginLeft: isMessageMine ? "auto" : "0",
            marginRight: isMessageMine ? "0" : "auto",
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
              backgroundColor: isMessageMine ? undefined : "#eee",
              color: isMessageMine ? undefined : "#222",
            }}
            className={styles.messageText}
          >
            {formatText(message?.text.split("\n") || [])}
          </p>
        </div>
      </div>
    </>
  );
};
