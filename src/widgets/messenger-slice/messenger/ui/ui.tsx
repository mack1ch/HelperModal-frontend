"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button, Input, message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { io, Socket } from "socket.io-client";
import { useCookies } from "react-cookie";
import { uid } from "uid";

import styles from "./ui.module.scss";
import PlaneTilt from "../../../../../public/icons/messenger/paperPlaneTilt.svg";

import { MessagesRender } from "@/features/messenger-slice/messagesRender";
import { IIssue } from "@/shared/interface/issue";
import { IMessage } from "@/shared/interface/message";
import { changeIssueClosingByID, getIssuesByAuthorID } from "../api";
import {
  appendOrMergeMessage,
  closeOldIssues,
  makeUserMessage,
  toDate,
} from "../model";

export const Messenger = () => {
  const [cookies] = useCookies(["user-id"]);
  const userId = cookies["user-id"];

  const [issues, setIssues] = useState<IIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageValue, setMessageValue] = useState("");

  /** Стабильный инстанс сокета только на клиенте */
  const socketRef = useRef<Socket | null>(null);

  /** Последний тикет и его состояние */
  const lastIssue = useMemo(
    () => (issues.length ? issues[issues.length - 1] : null),
    [issues]
  );
  const isLastClosed = !!lastIssue?.isClosed;

  /** Подключение к сокету (без SSR) */
  useEffect(() => {
    if (!userId) return;

    // Вынесено в effect чтобы исключить SSR-инициализацию
    const socketUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://api.rltorg.ru/";
    const s = io(socketUrl, { transports: ["websocket"] });
    socketRef.current = s;

    const joinRoom = () => s.emit("joinRoom", [userId]);

    s.on("connect", joinRoom);

    s.on("messageTextPart", (value: IMessage) => {
      // Пришёл кусок ответа: обновляем только последний тикет
      setIsLoading(false);
      setIssues((prev) => {
        if (!prev.length) return prev;
        const next = [...prev];
        const li = next[next.length - 1];

        const normalizedIncoming: IMessage = {
          ...value,
          createdAt: toDate(value.createdAt),
        };

        next[next.length - 1] = appendOrMergeMessage(li, normalizedIncoming);
        return next;
      });
    });

    s.on("connect_error", () => {
      message.error("Не удалось подключиться к чату. Попробуйте позже.");
    });

    return () => {
      s.removeAllListeners();
      s.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  /** Первая загрузка тикетов пользователя */
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await getIssuesByAuthorID(userId);
        if (res instanceof Error) return;
        setIssues(res ?? []);
      } catch {
        message.error("Не удалось загрузить историю обращений.");
      }
    })();
  }, [userId]);

  /** Автозакрытие старых тикетов (иммутабельно) */
  useEffect(() => {
    if (!issues.length) return;

    (async () => {
      try {
        const shouldClose = closeOldIssues(issues);
        if (!shouldClose) return;

        const last = issues[issues.length - 1];
        const res = await changeIssueClosingByID(last.issueId, shouldClose);
        if (res instanceof Error) return;

        setIssues((prev) => {
          if (!prev.length) return prev;
          const next = [...prev];
          next[next.length - 1] = res;
          return next;
        });
      } catch {
        // молча, чтобы не спамить пользователя
      }
    })();
  }, [issues]);

  /** Принудительное закрытие последнего тикета */
  const handleCloseAndStartNew = useCallback(async () => {
    if (!lastIssue) return;
    try {
      const res = await changeIssueClosingByID(lastIssue.issueId, true);
      if (res instanceof Error) {
        message.error("Ошибка. Наши лучшие разработчики уже решают её");
        return;
      }
      setIssues((prev) => {
        const next = [...prev];
        next[next.length - 1] = res;
        return next;
      });
      message.success("Текущий тикет закрыт. Можно начать новый.");
    } catch {
      message.error("Не удалось закрыть тикет.");
    }
  }, [lastIssue]);

  /** Отправка сообщения */
  const sendMessage = useCallback(
    (textRaw?: string) => {
      const text = (textRaw ?? messageValue).trim();
      if (!userId || !text) return;
      const socket = socketRef.current;
      if (!socket) {
        message.error("Нет соединения с сервером чата.");
        return;
      }

      setIsLoading(true);

      const newIssueId =
        isLastClosed || !lastIssue ? uid(10) : lastIssue.issueId;
      const messageId = uid(10);

      const optimisticMsg = makeUserMessage({
        text,
        authorId: userId,
        issueId: newIssueId,
        messageId,
      });

      setIssues((prev) => {
        if (!prev.length || isLastClosed) {
          const newIssue: IIssue = {
            issueId: newIssueId,
            authorId: userId,
            isClosed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            messages: [optimisticMsg],
          };
          return [...prev, newIssue];
        }

        // Добавляем в существующий последний тикет
        const next = [...prev];
        const li = next[next.length - 1];
        const updated: IIssue = {
          ...li,
          messages: [...(li.messages ?? []), optimisticMsg],
          updatedAt: new Date(),
        };
        next[next.length - 1] = updated;
        return next;
      });

      socket.emit("sendMessage", {
        issueId: newIssueId,
        text,
        authorId: userId,
        isQuestion: true,
        messageId,
        role: "user",
      });

      setMessageValue("");
    },
    [userId, messageValue, lastIssue, isLastClosed]
  );

  /** Сабмит формы (клик по иконке/Enter в инпуте) */
  const onSubmitForm = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      sendMessage();
    },
    [sendMessage]
  );

  return (
    <div className={styles.messenger}>
      <div className={styles.messagesContainer}>
        <MessagesRender issues={issues} />

        {/* {!!issues.length && (
          <Button
            onClick={handleCloseAndStartNew}
            style={{ width: "100%" }}
            size="middle"
            type="text"
          >
            Кликните, чтобы начать новый тикет
          </Button>
        )} */}
      </div>

      <form className={styles.form} onSubmit={onSubmitForm}>
        <Input.Search
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
          onSearch={(val) => sendMessage(val)}
          loading={isLoading}
          placeholder="Задайте свой вопрос"
          size="large"
          variant="borderless"
          enterButton={
            isLoading ? (
              <button
                disabled={isLoading}
                style={{ border: "none", background: "transparent" }}
              >
                {" "}
                <Spin indicator={<LoadingOutlined spin />} size="large" />{" "}
              </button>
            ) : (
              <button className={styles.submitButton}>
                {" "}
                <Image
                  src={PlaneTilt}
                  width={24}
                  height={24}
                  alt="Submit"
                />{" "}
              </button>
            )
          }
        />
      </form>
    </div>
  );
};
