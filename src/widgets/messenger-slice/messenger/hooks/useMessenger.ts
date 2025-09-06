"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { message as antdMessage } from "antd";
import { uid } from "uid";
import type { Socket } from "socket.io-client";

import { ResponseMode } from "@/widgets/messenger-slice/messenger/types";
import { createSocket } from "@/widgets/messenger-slice/messenger/model";
import { IIssue } from "@/shared/interface/issue";
import { IMessage } from "@/shared/interface/message";
import { changeIssueClosingByID, getIssuesByAuthorID } from "../api";

/* ===================== Helpers ===================== */

const toDate = (v: any): Date =>
  v instanceof Date ? v : v ? new Date(v) : new Date();

/** Единый ключ сообщения: id || messageId → string */
const getMsgKey = (
  m: Partial<IMessage> & { [k: string]: any }
): string | undefined => {
  const key = (m.id ?? (m as any).messageId) as string | number | undefined;
  return key === undefined || key === null ? undefined : String(key);
};

/** Мерж документов c уникализацией по fileLink+title */
const mergeDocuments = (
  a?: IMessage["documents"],
  b?: IMessage["documents"]
) => {
  const res: Required<IMessage>["documents"] = [];
  const seen = new Set<string>();
  const push = (list?: IMessage["documents"]) => {
    (list ?? []).forEach((d) => {
      const key = `${d?.fileLink ?? ""}::${d?.title ?? ""}`;
      if (!seen.has(key)) {
        seen.add(key);
        res.push(d);
      }
    });
  };
  push(a);
  push(b);
  return res;
};

/** Попробовать «умно» слить текст частями */
const mergeTextSmart = (prev: string, incoming: string): string => {
  if (!prev) return incoming ?? "";
  if (!incoming) return prev;

  // Если сервер шлёт каждый раз «целиком накопленный» текст
  if (incoming.length >= prev.length && incoming.startsWith(prev)) {
    return incoming;
  }

  // Если сервер шлёт чистую дельту
  if (!prev.endsWith(incoming)) {
    return prev + incoming;
  }

  // Фолбэк — ничего не меняем
  return prev;
};

/** Мердж одного сообщения внутри issue по ключу (id/messageId) */
const mergeMessageInIssue = (issue: IIssue, incomingRaw: IMessage): IIssue => {
  const list = issue.messages ?? [];
  const incoming: IMessage = {
    ...incomingRaw,
    createdAt: toDate(incomingRaw.createdAt),
  };

  const incomingKey = getMsgKey(incoming);
  if (!incomingKey) {
    // нет ключа → просто добавляем как новое сообщение
    return {
      ...issue,
      messages: [...list, incoming],
      updatedAt: new Date(),
    };
  }

  const idx = list.findIndex((m) => getMsgKey(m) === incomingKey);

  if (idx === -1) {
    // первое появление этого сообщения
    return {
      ...issue,
      messages: [...list, incoming],
      updatedAt: new Date(),
    };
  }

  // есть старое — мержим
  const prev = list[idx];

  const merged: IMessage = {
    ...prev,
    ...incoming,
    // умный мердж текста
    text: mergeTextSmart(prev.text, incoming.text),
    // даты
    createdAt: toDate(incoming.createdAt ?? prev.createdAt),
    // аккуратно мержим документы
    documents: mergeDocuments(prev.documents, incoming.documents),
  };

  const next = [...list];
  next[idx] = merged;

  return {
    ...issue,
    messages: next,
    updatedAt: new Date(),
  };
};

/** Апсерт сообщения по issueId */
const upsertMessageIntoIssues = (
  issues: IIssue[],
  incoming: IMessage
): IIssue[] => {
  const issueId = incoming.issueId;
  if (!issueId) return issues;

  const index = issues.findIndex((i) => i.issueId === issueId);

  if (index === -1) {
    const newIssue: IIssue = {
      issueId,
      authorId: incoming.authorId ?? "",
      isClosed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [{ ...incoming, createdAt: toDate(incoming.createdAt) }],
    };
    return [...issues, newIssue];
  }

  const next = [...issues];
  next[index] = mergeMessageInIssue(next[index], incoming);
  return next;
};

const shouldAutoClose = (issues: IIssue[]) => {
  if (!issues.length) return false;
  const last = issues[issues.length - 1];
  if (!last.updatedAt) return false;
  const diffMin = (Date.now() - +new Date(last.updatedAt)) / 60000;
  return diffMin > 60;
};

/** маппинг режима → признак короткого ответа */
const isShortByMode = (mode: ResponseMode): boolean => mode === "short";

type Params = { userId?: string };
type CompanyType = IMessage["companyType"]; // "physic" | "msp" | "big_company"

/* ===================== Hook ===================== */

export function useMessenger({ userId }: Params) {
  const [issues, setIssues] = useState<IIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const [responseMode, setResponseMode] = useState<ResponseMode>("auto");
  const [companyType, setCompanyType] = useState<CompanyType>("physic");

  // важно хранить в ref, чтобы не пересоздавать сокет
  const sentMessageIdsRef = useRef<Set<string>>(new Set());
  const socketRef = useRef<Socket | null>(null);

  const lastIssue = useMemo(
    () => (issues.length ? issues[issues.length - 1] : null),
    [issues]
  );
  const isLastClosed = !!lastIssue?.isClosed;

  /* ---- socket lifecycle ---- */
  useEffect(() => {
    if (!userId) return;

    const s = createSocket();
    socketRef.current = s;

    const joinRoom = () => s.emit("joinRoom", [userId]);
    s.on("connect", joinRoom);

    s.on("messageTextPart", (value: IMessage | any) => {
      // сервер может присылать messageId без id
      setIsLoading(false);

      // пропускаем эхо собственных user-сообщений
      const mid = getMsgKey(value);
      if (value?.role === "user" && mid && sentMessageIdsRef.current.has(mid)) {
        return;
      }

      const incoming: IMessage = {
        ...value,
        createdAt: toDate(value?.createdAt),
      };

      setIssues((prev) => upsertMessageIntoIssues(prev, incoming));
    });

    s.on("connect_error", () => {
      antdMessage.error("Не удалось подключиться к чату. Попробуйте позже.");
    });

    return () => {
      s.removeAllListeners();
      s.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  /* ---- first load ---- */
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await getIssuesByAuthorID(userId);
        if (res instanceof Error) return;
        setIssues(
          (res ?? []).map((i) => ({
            ...i,
            createdAt: toDate(i.createdAt),
            updatedAt: toDate(i.updatedAt),
            messages: (i.messages ?? []).map((m) => ({
              ...m,
              createdAt: toDate(m.createdAt),
            })),
          }))
        );
      } catch {
        antdMessage.error("Не удалось загрузить историю обращений.");
      }
    })();
  }, [userId]);

  /* ---- auto-close ---- */
  useEffect(() => {
    if (!issues.length) return;
    (async () => {
      try {
        const needClose = shouldAutoClose(issues);
        if (!needClose) return;
        const last = issues[issues.length - 1];
        const res = await changeIssueClosingByID(last.issueId, needClose);
        if (res instanceof Error) return;
        setIssues((prev) => {
          if (!prev.length) return prev;
          const next = [...prev];
          next[next.length - 1] = {
            ...res,
            createdAt: toDate((res as any)?.createdAt),
            updatedAt: toDate((res as any)?.updatedAt),
          };
          return next;
        });
      } catch {
        /* silent */
      }
    })();
  }, [issues]);

  /* ---- actions ---- */
  const sendMessage = useCallback(
    (textRaw?: string) => {
      const text = (textRaw ?? messageValue).trim();
      if (!userId || !text) return;

      const socket = socketRef.current;
      if (!socket) {
        antdMessage.error("Нет соединения с сервером чата.");
        return;
      }

      setIsLoading(true);

      const newIssueId =
        isLastClosed || !lastIssue ? uid(10) : lastIssue.issueId;
      const messageId = uid(10);
      sentMessageIdsRef.current.add(String(messageId));

      const optimisticMsg: IMessage = {
        id: String(messageId),
        text,
        authorId: userId,
        issueId: newIssueId,
        createdAt: new Date(),
        role: "user",
        userRating: "like",
        isShortAnswer: isShortByMode(responseMode),
        companyType,
      };

      // Оптимистичная вставка
      setIssues((prev) => {
        const idx = prev.findIndex((i) => i.issueId === newIssueId);
        if (idx === -1) {
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
        const next = [...prev];
        next[idx] = mergeMessageInIssue(next[idx], optimisticMsg);
        return next;
      });

      // Отправляем на сервер
      socket.emit("sendMessage", {
        issueId: newIssueId,
        text,
        authorId: userId,
        isQuestion: true,
        messageId, // сервер может вернуть только messageId
        role: "user",
        responseMode,
        isShortAnswer: isShortByMode(responseMode),
        companyType,
      });

      setMessageValue("");
    },
    [userId, messageValue, lastIssue, isLastClosed, responseMode, companyType]
  );

  /* ---- UI helpers ---- */
  const setModeByMenuKey = useCallback((key: string) => {
    if (key === "auto" || key === "short" || key === "detailed") {
      const mode = key as ResponseMode;
      antdMessage.info(
        `Режим ответа: ${
          mode === "short"
            ? "Короткий"
            : mode === "detailed"
            ? "Развернутый"
            : "Автоматический (развернутый)"
        }`
      );
      setResponseMode(mode);
      return;
    }

    if (key === "physic" || key === "msp" || key === "big_company") {
      const label =
        key === "physic"
          ? "Физ. лицо"
          : key === "msp"
          ? "МСП"
          : "Крупный поставщик";
      setCompanyType(key as CompanyType);
      antdMessage.success(`Тип компании изменён: ${label}`);
    }
  }, []);

  const getCombinedTooltip = useCallback(
    () =>
      `${
        responseMode === "short"
          ? "Короткий"
          : responseMode === "detailed"
          ? "Развернутый"
          : "Автоматический (развернутый)"
      } ответ · ${
        companyType === "physic"
          ? "Физ. лицо"
          : companyType === "msp"
          ? "МСП"
          : "Крупный поставщик"
      }`,
    [responseMode, companyType]
  );

  return {
    // state
    issues,
    isLoading,
    messageValue,
    responseMode,
    companyType,

    // setters
    setMessageValue,
    setModeByMenuKey,

    // actions
    sendMessage,

    // helpers
    getCombinedTooltip,
  };
}
