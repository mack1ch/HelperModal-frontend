"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button, Input, message, Spin, Dropdown, MenuProps } from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  MonitorOutlined,
  AppstoreOutlined,
  HourglassOutlined,
  UserOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
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
import { responseModeItems } from "../data";

type ResponseMode = "auto" | "short" | "detailed";
type UserRole = "individual" | "entrepreneur" | "legal";

export const Messenger = () => {
  const [cookies] = useCookies(["user-id"]);
  const userId = cookies["user-id"];

  const [issues, setIssues] = useState<IIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const [responseMode, setResponseMode] = useState<ResponseMode>("auto");
  const [userRole, setUserRole] = useState<UserRole>("individual");
  const [sentMessageIds, setSentMessageIds] = useState<Set<string>>(new Set());

  const socketRef = useRef<Socket | null>(null);

  const lastIssue = useMemo(
    () => (issues.length ? issues[issues.length - 1] : null),
    [issues]
  );
  const isLastClosed = !!lastIssue?.isClosed;

  const handleMenuClick = useCallback(({ key }: { key: string }) => {
    if (key.startsWith("role_")) {
      const role = key.split("_")[1] as UserRole;
      setUserRole(role);
      message.success(`Роль изменена на: ${getRoleLabel(role)}`);
    } else {
      setResponseMode(key as ResponseMode);
      message.info(`Режим ответа: ${getModeLabel(key as ResponseMode)}`);
    }
  }, []);

  const getResponseModeIcon = (mode: ResponseMode): React.ReactNode => {
    switch (mode) {
      case "auto":
        return <PlusOutlined style={{ fontSize: "16px" }} />;
      case "short":
        return <PlusOutlined style={{ fontSize: "16px" }} />;
      case "detailed":
        return <PlusOutlined style={{ fontSize: "16px" }} />;
      default:
        return <PlusOutlined />;
    }
  };

  const getRoleIcon = (role: UserRole): React.ReactNode => {
    switch (role) {
      case "individual":
        return <UserOutlined style={{ fontSize: "16px" }} />;
      case "entrepreneur":
        return <ShopOutlined style={{ fontSize: "16px" }} />;
      case "legal":
        return <TeamOutlined style={{ fontSize: "16px" }} />;
      default:
        return <UserOutlined />;
    }
  };

  const getModeLabel = (mode: ResponseMode): string => {
    switch (mode) {
      case "auto":
        return "Автоматический";
      case "short":
        return "Короткий";
      case "detailed":
        return "Развернутый";
      default:
        return "Автоматический";
    }
  };

  const getRoleLabel = (role: UserRole): string => {
    switch (role) {
      case "individual":
        return "Физ. лицо";
      case "entrepreneur":
        return "ИП";
      case "legal":
        return "Юр. лицо";
      default:
        return "Физ. лицо";
    }
  };

  const getCombinedTooltip = (): string => {
    return `${getModeLabel(responseMode)} ответ · ${getRoleLabel(userRole)}`;
  };

  useEffect(() => {
    if (!userId) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://api.rltorg.ru/";
    const s = io(socketUrl, { transports: ["websocket"] });
    socketRef.current = s;

    const joinRoom = () => s.emit("joinRoom", [userId]);

    s.on("connect", joinRoom);

    s.on("messageTextPart", (value: IMessage) => {
      setIsLoading(false);

      if (value.role === "user" && sentMessageIds.has(value.id)) {
        return;
      }

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
  }, [userId, sentMessageIds]);

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

      setSentMessageIds((prev) => new Set(prev).add(messageId));

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
        responseMode,
        userRole, // Добавляем выбранную роль пользователя
      });

      setMessageValue("");
    },
    [userId, messageValue, lastIssue, isLastClosed, responseMode, userRole]
  );

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
      </div>

      <form
        style={{ userSelect: "none" }}
        className={styles.form}
        onSubmit={onSubmitForm}
      >
        <Input.Search
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
          onSearch={(val) => sendMessage(val)}
          loading={isLoading}
          placeholder="Задайте свой вопрос"
          size="large"
          variant="borderless"
          addonBefore={
            <Dropdown
              menu={{
                items: responseModeItems,
                onClick: handleMenuClick,
                selectedKeys: [responseMode, `role_${userRole}`],
              }}
              trigger={["click"]}
              placement="topLeft"
            >
              <Button
                size="small"
                type="text"
                icon={<PlusOutlined style={{ fontSize: "16px" }} />}
                title={getCombinedTooltip()}
                className={styles.modeButton}
              />
            </Dropdown>
          }
          enterButton={
            isLoading ? (
              <button disabled={isLoading} className={styles.submitButton}>
                <Spin indicator={<LoadingOutlined spin />} size="small" />
              </button>
            ) : (
              <button className={styles.submitButton}>
                <Image src={PlaneTilt} width={24} height={24} alt="Submit" />
              </button>
            )
          }
          className={styles.searchInput}
        />
      </form>
    </div>
  );
};
