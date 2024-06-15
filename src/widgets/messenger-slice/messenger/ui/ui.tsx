import { Button, Input, message, Spin } from "antd";
import styles from "./ui.module.scss";
import { MessagesRender } from "@/features/messenger-slice/messagesRender";
import PlaneTilt from "../../../../../public/icons/messenger/paperPlaneTilt.svg";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useCookies } from "react-cookie";
import { uid } from "uid";
import { IIssue } from "@/shared/interface/issue";
import { closeOldIssues } from "../model";
import { changeIssueClosingByID, getIssuesByAuthorID } from "../api";
import { IMessage } from "@/shared/interface/message";
import { LoadingOutlined } from "@ant-design/icons";

const socket = io(`https://helper.unisport.space/`);

export const Messenger = () => {
  const [cookies] = useCookies(["user-id"]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageValue, setMessageValue] = useState<string>("");
  const [issues, setIssues] = useState<IIssue[]>();
  useEffect(() => {
    async function getIssues() {
      const res = await getIssuesByAuthorID(cookies["user-id"]);
      if (res instanceof Error) return;
      setIssues(res);
    }
    getIssues();
  }, []);
  useEffect(() => {
    const joinRoom = () => {
      if (cookies["user-id"]) {
        socket.emit("joinRoom", [cookies["user-id"]]);
      }
    };
    socket.on("connect", joinRoom);
  }, []);

  useEffect(() => {
    async function patchIssueCloses() {
      if (issues && closeOldIssues(issues)) {
        const res = await changeIssueClosingByID(
          issues[issues?.length - 1].issueId,
          closeOldIssues(issues)
        );
        if (res instanceof Error) return;
        else {
          issues[issues?.length - 1] = res;
        }
      }
    }
    patchIssueCloses();
  }, [issues]);

  async function handlePatchIssueClosesByBtn() {
    if (issues) {
      const res = await changeIssueClosingByID(
        issues[issues?.length - 1].issueId,
        false
      );
      if (res instanceof Error)
        message.error("Ошибка. Наши лучшие разработчики уже решают её");
      else {
        message.success("Создано новое обращение");
        issues[issues?.length - 1] = res;
      }
    }
  }

  useEffect(() => {
    function onReceiveMessages(value: IMessage) {
      setIsLoading(false);
      setIssues((prevIssues) => {
        if (!prevIssues || prevIssues.length === 0) {
          return prevIssues;
        }

        const updatedIssues = [...prevIssues];
        const lastIssue = updatedIssues[updatedIssues.length - 1];

        if (lastIssue.messages) {
          lastIssue.messages.push(value);
        } else {
          lastIssue.messages = [value];
        }

        return updatedIssues;
      });
    }
    socket.on("receiveMessage", onReceiveMessages);
  }, [socket]);
  console.log(issues);
  function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (issues && issues.length > 0 && messageValue.length > 0) {
      setIsLoading(true);
      socket.emit("sendMessage", {
        issueId: issues[issues?.length - 1].isClosed
          ? uid(10)
          : issues[issues?.length - 1].issueId,
        text: messageValue,
        authorId: cookies["user-id"],
        isQuestion: true,
      });
    } else if (messageValue.length > 0) {
      setIsLoading(true);
      socket.emit("sendMessage", {
        issueId: uid(10),
        text: messageValue,
        authorId: cookies["user-id"],
        isQuestion: true,
      });
    }
    setIssues((prevIssues) => {
      if (!prevIssues) return [] as IIssue[];
      const updatedIssues = [...prevIssues];
      let lastIssue: IIssue | undefined =
        updatedIssues[updatedIssues.length - 1];

      if ((!prevIssues || prevIssues.length === 0) && messageValue.length > 0) {
        const newIssueID = uid(10);
        const newIssue: IIssue = {
          issueId: newIssueID,
          authorId: cookies["user-id"],
          isClosed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [
            {
              id: "",
              text: messageValue,
              issueId: newIssueID,
              authorId: cookies["user-id"],
            } as IMessage,
          ],
        };
        return [newIssue];
      } else if (
        lastIssue?.messages &&
        lastIssue.messages.length > 0 &&
        !lastIssue.isClosed &&
        messageValue.length > 0
      ) {
        lastIssue.messages.push({
          id: "",
          text: messageValue,
          issueId: lastIssue.issueId,
          authorId: lastIssue.authorId,
        } as IMessage);
      } else if (
        lastIssue?.messages &&
        lastIssue.messages.length > 0 &&
        lastIssue.isClosed &&
        messageValue.length > 0
      ) {
        const newIssueID = uid(10);
        const newIssue: IIssue = {
          issueId: newIssueID,
          authorId: cookies["user-id"],
          isClosed: false,
          messages: [
            {
              id: "",
              text: messageValue,
              issueId: newIssueID,
              authorId: cookies["user-id"],
            } as IMessage,
          ],
        };
        return [...updatedIssues, newIssue];
      }

      return updatedIssues;
    });

    setMessageValue("");
  }

  return (
    <>
      <div className={styles.messenger}>
        <div className={styles.messagesContainer}>
          <MessagesRender issues={issues} />
          {issues && issues?.length > 0 && (
            <Button
              onClick={handlePatchIssueClosesByBtn}
              style={{ width: "100%" }}
              size="middle"
              type="text"
            >
              Кликните, чтобы начать новый тикет
            </Button>
          )}
        </div>
        <form className={styles.form} onSubmit={onSubmit}>
          <Input.Search
            value={messageValue}
            onSearch={() => onSubmit}
            enterButton={
              isLoading ? (
                <button
                  disabled={isLoading}
                  style={{ border: "none", background: "transparent" }}
                >
                  <Spin indicator={<LoadingOutlined spin />} size="large" />
                </button>
              ) : (
                <button onClick={onSubmit} className={styles.submitButton}>
                  <Image src={PlaneTilt} width={24} height={24} alt="Submit" />
                </button>
              )
            }
            onChange={(e) => setMessageValue(e.target.value)}
            size="large"
            placeholder="Задайте свой вопрос"
            variant="borderless"
          />
        </form>
      </div>
    </>
  );
};
