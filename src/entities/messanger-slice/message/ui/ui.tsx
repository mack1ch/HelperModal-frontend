"use client";

import { IMessage } from "@/shared/interface/message";
import styles from "./ui.module.scss";
import { useCallback, useState } from "react";
import { formatTimeToHHMMFormat } from "@/shared/lib/parce/time";
import { Button, Space, Tooltip, message as antMessage } from "antd";
import { DislikeOutlined, LikeOutlined, CopyOutlined } from "@ant-design/icons";
import { rateMessage, UserReaction } from "../api";

export const Message = ({ message }: { message?: IMessage }) => {
  const [isHover, setIsHover] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [localRating, setLocalRating] = useState<"like" | "dislike" | null>(
    message?.userReaction || null
  );

  const isNotMessageMine = message?.role == "AI" || message?.role == "operator";
  const shouldWrapText = message?.text && message.text.length > 30;

  const sendReaction = useCallback(
    async (userReaction?: UserReaction) => {
      if (!message?.id || !message.issueId || !message.authorId) return;
      try {
        setIsSending(true);
        await rateMessage({
          messageId: message.id,
          issueId: message.issueId,
          authorId: message.authorId,
          userReaction,
        });
      } finally {
        setIsSending(false);
      }
    },
    [message?.id, message?.issueId, message?.authorId]
  );

  const handleRate = async (rating: "like" | "dislike") => {
    if (!message?.id) return;
    const prev = localRating;
    setLocalRating(rating);
    console.log(rating);
    try {
      await sendReaction(rating);
    } catch (err) {
      setLocalRating(prev);
      antMessage.error("Не удалось отправить оценку");
      console.error(err);
    }
  };

  const handleRemoveRating = async () => {
    const prev = localRating;
    setLocalRating(null);

    try {
      await sendReaction(undefined);
    } catch (err) {
      setLocalRating(prev);
      antMessage.error("Не удалось удалить оценку");
      console.error(err);
    }
  };

  const handleCopyText = async () => {
    if (!message?.text) return;
    try {
      await navigator.clipboard.writeText(message.text);
      antMessage.success("Текст скопирован в буфер обмена");
    } catch (err) {
      antMessage.error("Не удалось скопировать текст");
      console.error(err);
    }
  };

  return (
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

        <div className={styles.messageContent}>
          <p
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            style={{
              backgroundColor: !isNotMessageMine ? undefined : "#eee",
              color: !isNotMessageMine ? undefined : "#222",
              whiteSpace: shouldWrapText ? "normal" : "nowrap",
            }}
            className={styles.messageText}
          >
            {message?.text}
          </p>

          {message?.role === "AI" && (
            <Space
              size="small"
              className={styles.actionButtons}
              style={{
                justifyContent: isNotMessageMine ? "flex-start" : "flex-end",
                marginTop: 8,
                opacity: isSending ? 0.6 : 1,
                pointerEvents: isSending ? "none" : "auto",
              }}
            >
              <Tooltip title="Скопировать">
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined style={{ color: "#757575" }} />}
                  onClick={handleCopyText}
                  className={styles.copyButton}
                />
              </Tooltip>

              <Tooltip title="Ответ понравился">
                <Button
                  type={localRating === "like" ? "primary" : "text"}
                  size="small"
                  ghost
                  className={localRating == "like" ? styles.activeDislike : ""}
                  icon={<LikeOutlined style={{ color: "#757575" }} />}
                  onClick={() =>
                    localRating === "like"
                      ? handleRemoveRating()
                      : handleRate("like")
                  }
                />
              </Tooltip>

              <Tooltip title="Ответ не понравился">
                <Button
                  type={localRating === "dislike" ? "primary" : "text"}
                  size="small"
                  icon={<DislikeOutlined style={{ color: "#757575" }} />}
                  className={
                    localRating == "dislike" ? styles.activeDislike : ""
                  }
                  onClick={() =>
                    localRating === "dislike"
                      ? handleRemoveRating()
                      : handleRate("dislike")
                  }
                  danger={localRating === "dislike"}
                />
              </Tooltip>
            </Space>
          )}
        </div>
      </div>
    </div>
  );
};
