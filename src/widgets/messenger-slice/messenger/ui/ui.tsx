import { Input } from "antd";
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

const socket = io(`https://helper.unisport.space/`);

export const Messenger = () => {
  const [cookies] = useCookies(["user-id"]);
  console.log(cookies);
  const [messageValue, setMessageValue] = useState<string>("");
  const [issues, setIssues] = useState<IIssue[]>();
  useEffect(() => {
    async function getIssues() {
      const res = await getIssuesByAuthorID(cookies["user-id"]);
      if (res instanceof Error) return;
      setIssues(res);
    }
    getIssues();
  }, [cookies]);
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

  useEffect(() => {
    function onReceiveMessages(value: IMessage) {
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

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (issues && issues.length > 0 && messageValue.length > 0) {
      socket.emit("sendMessage", {
        issueId: issues[issues?.length - 1].isClosed
          ? uid(16)
          : issues[issues?.length - 1].issueId,
        text: messageValue,
        authorId: cookies["user-id"],
        isQuestion: true,
      });
    } else if (messageValue.length > 0) {
      socket.emit("sendMessage", {
        issueId: uid(16),
        text: messageValue,
        authorId: cookies["user-id"],
        isQuestion: true,
      });
    }
    setMessageValue("");
  }

  return (
    <>
      <div className={styles.messenger}>
        <MessagesRender issues={issues} />
        <form className={styles.form} onSubmit={onSubmit}>
          <Input.Search
            value={messageValue}
            onSearch={() => onSubmit}
            enterButton={
              <button onClick={onSubmit} className={styles.submitButton}>
                <Image src={PlaneTilt} width={24} height={24} alt="Submit" />
              </button>
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
