// "use client";

import { useCallback, useMemo, useState } from "react";
import { Button, Space, Tooltip, App } from "antd";
import { DislikeOutlined, LikeOutlined, CopyOutlined } from "@ant-design/icons";
import styles from "./ui.module.scss";

import { IMessage } from "@/shared/interface/message";
import { formatTimeToHHMMFormat } from "@/shared/lib/parce/time";
import { rateMessage, UserReaction } from "../api";

// Markdown
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

// Подсветка кода (лёгкий билд)
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import ts from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import md from "react-syntax-highlighter/dist/esm/languages/hljs/markdown";
import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash";
import sql from "react-syntax-highlighter/dist/esm/languages/hljs/sql";
import githubStyle from "react-syntax-highlighter/dist/esm/styles/hljs/github";

// Регистрируем нужные языки (добавляй по необходимости)
SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("typescript", ts);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("markdown", md);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("sql", sql);

// Тип для кастомного рендера <code> под react-markdown
type CodeElementProps = React.ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export const Message = ({ message }: { message?: IMessage }) => {
  const { message: antdMessage } = App.useApp();

  const [isHover, setIsHover] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [localRating, setLocalRating] = useState<"like" | "dislike" | null>(
    message?.userReaction || null
  );

  const isNotMessageMine =
    message?.role === "AI" || message?.role === "operator";
  const shouldWrapText = (message?.text?.length ?? 0) > 30;

  const createdAtLabel = useMemo(
    () => formatTimeToHHMMFormat(message?.createdAt || new Date()),
    [message?.createdAt]
  );

  const sendReaction = useCallback(
    async (userReaction?: UserReaction) => {
      if (!message?.id || !message?.issueId || !message?.authorId) return;
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
    try {
      await sendReaction(rating);
    } catch (err) {
      setLocalRating(prev);
      antdMessage.error("Не удалось отправить оценку");
      // console.error(err);
    }
  };

  const handleRemoveRating = async () => {
    const prev = localRating;
    setLocalRating(null);
    try {
      await sendReaction(undefined);
    } catch (err) {
      setLocalRating(prev);
      antdMessage.error("Не удалось удалить оценку");
      // console.error(err);
    }
  };

  const handleCopyText = async () => {
    if (!message?.text) return;
    try {
      await navigator.clipboard.writeText(message.text);
      antdMessage.success("Текст скопирован в буфер обмена");
    } catch {
      antdMessage.error("Не удалось скопировать текст");
    }
  };

  // Рендер <code> внутри Markdown
  const CodeBlock = ({
    inline,
    className,
    children,
    ...rest
  }: CodeElementProps) => {
    const code = String(children ?? "").trim();

    if (inline) {
      return (
        <code className={styles.mdCodeInline} {...rest}>
          {code}
        </code>
      );
    }

    const match = /language-(\w+)/.exec(className ?? "");
    // поддерживаем ряд языков; если не распознали — markdown
    const language = (match?.[1] || "markdown") as
      | "javascript"
      | "typescript"
      | "json"
      | "markdown"
      | "bash"
      | "sql";

    return (
      <div className={styles.mdCodeBlock}>
        <SyntaxHighlighter
          language={language}
          style={githubStyle}
          PreTag="div"
          customStyle={{ margin: 0, background: "transparent" }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  };

  // Кастомные markdown-компоненты для «пузыря»
  const mdComponents: Partial<Components> = {
    code: CodeBlock as Components["code"],
    p: ({ children }) => <p className={styles.mdP}>{children}</p>,
    strong: ({ children }) => (
      <strong className={styles.mdStrong}>{children}</strong>
    ),
    em: ({ children }) => <em className={styles.mdEm}>{children}</em>,
    ul: ({ children }) => <ul className={styles.mdUl}>{children}</ul>,
    ol: ({ children }) => <ol className={styles.mdOl}>{children}</ol>,
    li: ({ children }) => <li className={styles.mdLi}>{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className={styles.mdBlockquote}>{children}</blockquote>
    ),
    a: ({ children, href }) => (
      <a
        className={styles.mdLink}
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
      >
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div className={styles.mdTableWrap}>
        <table className={styles.mdTable}>{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className={styles.mdThead}>{children}</thead>
    ),
    tbody: ({ children }) => (
      <tbody className={styles.mdTbody}>{children}</tbody>
    ),
    th: ({ children }) => <th className={styles.mdTh}>{children}</th>,
    td: ({ children }) => <td className={styles.mdTd}>{children}</td>,
  };

  return (
    <div className={styles.messageWrap}>
      <div
        id={message?.id}
        className={styles.message}
        style={{
          flexDirection: !isNotMessageMine ? undefined : "row-reverse",
          marginLeft: !isNotMessageMine ? "auto" : "0",
          marginRight: !isNotMessageMine ? "0" : "auto",
        }}
      >
        <span style={{ opacity: isHover ? 1 : 0 }} className={styles.date}>
          {createdAtLabel}
        </span>

        <div className={styles.messageContent}>
          <div
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className={styles.messageText}
            style={{
              backgroundColor: !isNotMessageMine ? undefined : "#eee",
              color: !isNotMessageMine ? undefined : "#222",
              whiteSpace: shouldWrapText ? "normal" : "nowrap",
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              skipHtml
              components={mdComponents}
            >
              {message?.text ?? ""}
            </ReactMarkdown>
          </div>

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
                  className={localRating === "like" ? styles.activeDislike : ""}
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
                    localRating === "dislike" ? styles.activeDislike : ""
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
