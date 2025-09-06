"use client";

import Image from "next/image";
import { Button, Dropdown, Input, Spin, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

import styles from "./ui.module.scss";
import PlaneTilt from "../../../../../public/icons/messenger/paperPlaneTilt.svg";

import { MessagesRender } from "@/features/messenger-slice/messagesRender";
import { useCookies } from "react-cookie";
import { useMessenger } from "../hooks/useMessenger";
import { responseModeItems } from "../data";

export const Messenger = () => {
  const [cookies] = useCookies(["user-id"]);
  const userId = cookies["user-id"] as string | undefined;

  const {
    issues,
    isLoading,
    messageValue,
    responseMode,
    companyType, // ⬅️ берём companyType
    setMessageValue,
    setModeByMenuKey,
    sendMessage,
    getCombinedTooltip,
  } = useMessenger({ userId });

  const lastIssueId = issues.length
    ? issues[issues.length - 1].issueId
    : undefined;

  const escalateToOperator = async () => {
    try {
      if (!userId || !lastIssueId) {
        message.warning("Нет активного чата для передачи оператору.");
        return;
      }
      const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
      const url = `${base}/add_new_assistant_request?authorId=${encodeURIComponent(
        userId
      )}&issueId=${encodeURIComponent(lastIssueId)}`;

      const res = await fetch(url, { method: "GET", credentials: "include" });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }

      message.success("Запрос передан оператору.");
    } catch (e: any) {
      message.error(`Не удалось передать оператору: ${e?.message ?? "ошибка"}`);
    }
  };

  const menuItems = [
    ...(responseModeItems ?? []),
    { type: "divider" as const },
    { key: "escalate", label: "Передать оператору", danger: true },
  ];

  const onMenuClick = ({ key }: { key: string }) => {
    if (key === "escalate") {
      void escalateToOperator();
    } else {
      setModeByMenuKey(key); // обрабатывает auto/short/detailed и physic/msp/big_company
    }
  };

  const onSubmitForm = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    sendMessage();
  };

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
                items: menuItems,
                onClick: onMenuClick,
                selectedKeys: [responseMode, companyType], // ⬅️ без role_*
              }}
              trigger={["click"]}
              placement="topLeft"
            >
              <Button
                size="small"
                type="text"
                icon={<PlusOutlined style={{ fontSize: 16 }} />}
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
