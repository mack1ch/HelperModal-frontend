"use client";

import { IMessage } from "@/shared/interface/message";
import styles from "./ui.module.scss";
import { useState } from "react";
import { formatTimeToHHMMFormat } from "@/shared/lib/parce/time";
import { Button, Space, Tooltip, message as antMessage } from "antd";
import { DislikeOutlined, LikeOutlined, CopyOutlined } from "@ant-design/icons";

export const Message = ({
  message,
  onRateMessage,
}: {
  message?: IMessage;
  onRateMessage?: (messageId: string, rating: "like" | "dislike") => void;
}) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [localRating, setLocalRating] = useState<"like" | "dislike" | null>(
    message?.userRating || null
  );

  const isNotMessageMine: boolean =
    message?.role == "AI" || message?.role == "operator";

  // Определяем, нужно ли переносить текст
  const shouldWrapText = message?.text && message.text.length > 30; // Переносим если больше 30 символов

  const handleRate = (rating: "like" | "dislike") => {
    if (!message?.id) return;

    setLocalRating(rating);

    if (onRateMessage) {
      onRateMessage(message.id, rating);
    } else {
      antMessage.success(`Оценка "${rating}" отправлена`);
    }
  };

  const handleRemoveRating = () => {
    setLocalRating(null);
    antMessage.info("Оценка удалена");
  };

  const handleCopyText = async () => {
    if (!message?.text) return;

    try {
      await navigator.clipboard.writeText(message.text);
      antMessage.success("Текст скопирован в буфер обмена");
    } catch (err) {
      antMessage.error("Не удалось скопировать текст");
      console.error("Ошибка копирования:", err);
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
              whiteSpace: shouldWrapText ? "normal" : "nowrap", // Перенос только для длинных текстов
            }}
            className={styles.messageText}
          >
            {message?.text}
          </p>

          {/* Кнопки действий - показываем только для AI сообщений */}
          {message?.role === "AI" && (
            <Space
              size="small"
              className={styles.actionButtons}
              style={{
                justifyContent: isNotMessageMine ? "flex-start" : "flex-end",
                marginTop: "8px",
              }}
            >
              {/* Кнопка копирования */}
              <Tooltip title="Скопировать">
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined style={{ color: "#757575" }} />}
                  onClick={handleCopyText}
                  className={styles.copyButton}
                />
              </Tooltip>
              {/* Кнопки лайков/дизлайков */}
              <Tooltip title="Ответ понравился">
                <Button
                  type={localRating === "like" ? "primary" : "text"}
                  size="small"
                  ghost
                  icon={<LikeOutlined style={{ color: "#757575" }} />}
                  onClick={() =>
                    localRating === "like"
                      ? handleRemoveRating()
                      : handleRate("like")
                  }
                  className={localRating === "like" ? styles.activeLike : ""}
                />
              </Tooltip>
              <Tooltip title="Ответ не понравился">
                <Button
                  type={localRating === "dislike" ? "primary" : "text"}
                  size="small"
                  icon={<DislikeOutlined style={{ color: "#757575" }} />}
                  onClick={() =>
                    localRating === "dislike"
                      ? handleRemoveRating()
                      : handleRate("dislike")
                  }
                  danger={localRating === "dislike"}
                  className={
                    localRating === "dislike" ? styles.activeDislike : ""
                  }
                />
              </Tooltip>
            </Space>
          )}
        </div>
      </div>
    </div>
  );
};
